package com.example.backend.service.impl;

import com.example.backend.dto.OrderItemRequestDTO;
import com.example.backend.dto.OrderRequestDTO;
import com.example.backend.dto.OrderResposeDTO;
import com.example.backend.dto.PaymentRequestDTO;
import com.example.backend.entity.Order;
import com.example.backend.entity.OrderItem;
import com.example.backend.entity.OrderStatus;
import com.example.backend.entity.Product;
import com.example.backend.repository.OrderRepo;
import com.example.backend.repository.ProductRepo;
import com.example.backend.service.custom.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepo orderRepo;
    private final ProductRepo productRepo;

    @Override
    @Transactional
    public OrderResposeDTO createOrder(OrderRequestDTO requestDTO) {
        Order order = new Order();
        order.setStatus(OrderStatus.RESERVED);
        order.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequestDTO itemDTO : requestDTO.getItems()) {
            Product product = productRepo.findByIdWithPessimisticLock(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemDTO.getProductId()));
            
            if (product.getAvailableStock() < itemDTO.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            product.setAvailableStock(product.getAvailableStock() - itemDTO.getQuantity());
            product.setReservedStock(product.getReservedStock() + itemDTO.getQuantity());
            productRepo.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setUnitPrice(product.getPrice());
            
            orderItems.add(orderItem);
            
            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(itemDTO.getQuantity()));
            totalAmount = totalAmount.add(lineTotal);
        }

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);
        
        Order savedOrder = orderRepo.save(order);

        return OrderResposeDTO.builder()
                .orderId(savedOrder.getId())
                .status(savedOrder.getStatus())
                .totalAmount(savedOrder.getTotalAmount())
                .createdAt(savedOrder.getCreatedAt())
                .expiresAt(savedOrder.getExpiresAt())
                .build();
    }

    @Override
    @Transactional
    public void processPayment(PaymentRequestDTO paymentRequestDTO) {
        Order order = orderRepo.findById(paymentRequestDTO.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() != OrderStatus.RESERVED) {
            throw new RuntimeException("Order is not in RESERVED status");
        }

        if ("SUCCESS".equalsIgnoreCase(paymentRequestDTO.getPaymentStatus())) {
            order.setStatus(OrderStatus.PAID);
            for (OrderItem item : order.getItems()) {
                Product product = item.getProduct();
                product.setReservedStock(product.getReservedStock() - item.getQuantity());
                productRepo.save(product);
            }
        } else if ("FAILED".equalsIgnoreCase(paymentRequestDTO.getPaymentStatus()) || 
                   "TIMEOUT".equalsIgnoreCase(paymentRequestDTO.getPaymentStatus())) {
            order.setStatus(OrderStatus.FAILED);
            for (OrderItem item : order.getItems()) {
                Product product = item.getProduct();
                product.setReservedStock(product.getReservedStock() - item.getQuantity());
                product.setAvailableStock(product.getAvailableStock() + item.getQuantity());
                productRepo.save(product);
            }
        } else {
            throw new RuntimeException("Unknown payment status: " + paymentRequestDTO.getPaymentStatus());
        }

        orderRepo.save(order);
    }

    @Override
    @Transactional
    @Scheduled(fixedRate = 60000)
    public void releaseExpiredReservations() {
        List<Order> expiredOrders = orderRepo.findByStatusAndExpiresAtBefore(OrderStatus.RESERVED, LocalDateTime.now());
        for (Order order : expiredOrders) {
            order.setStatus(OrderStatus.EXPIRED);
            for (OrderItem item : order.getItems()) {
                Product product = item.getProduct();
                product.setReservedStock(product.getReservedStock() - item.getQuantity());
                product.setAvailableStock(product.getAvailableStock() + item.getQuantity());
                productRepo.save(product);
            }
            orderRepo.save(order);
        }
    }

    @Override
    @Transactional
    public void cancelOrder(Long orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() != OrderStatus.RESERVED) {
            throw new RuntimeException("Only RESERVED orders can be cancelled");
        }

        order.setStatus(OrderStatus.CANCELLED);
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setReservedStock(product.getReservedStock() - item.getQuantity());
            product.setAvailableStock(product.getAvailableStock() + item.getQuantity());
            productRepo.save(product);
        }
        orderRepo.save(order);
    }
}

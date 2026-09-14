package com.example.backend.service.custom;

import com.example.backend.dto.OrderRequestDTO;
import com.example.backend.dto.OrderResposeDTO;
import com.example.backend.dto.PaymentRequestDTO;

public interface OrderService {
    OrderResposeDTO createOrder(OrderRequestDTO requestDTO);
    void processPayment(PaymentRequestDTO paymentRequestDTO);
    void releaseExpiredReservations();
    void cancelOrder(Long orderId);
    java.util.List<OrderResposeDTO> getAllOrders();
}

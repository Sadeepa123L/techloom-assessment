package com.example.backend.controller;

import com.example.backend.dto.OrderRequestDTO;
import com.example.backend.dto.OrderResposeDTO;
import com.example.backend.dto.PaymentRequestDTO;
import com.example.backend.service.custom.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResposeDTO> createOrder(@Valid @RequestBody OrderRequestDTO requestDTO) {
        return new ResponseEntity<>(orderService.createOrder(requestDTO), HttpStatus.CREATED);
    }

    @PostMapping("/payment")
    public ResponseEntity<String> processPayment(@Valid @RequestBody PaymentRequestDTO paymentRequestDTO) {
        orderService.processPayment(paymentRequestDTO);
        return ResponseEntity.ok("Payment processed successfully");
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<String> cancelOrder(@PathVariable Long id) {
        orderService.cancelOrder(id);
        return ResponseEntity.ok("Order cancelled successfully");
    }
}

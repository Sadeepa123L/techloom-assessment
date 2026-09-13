package com.example.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.backend.entity.OrderStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderResposeDTO {
    private Long orderId;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
}

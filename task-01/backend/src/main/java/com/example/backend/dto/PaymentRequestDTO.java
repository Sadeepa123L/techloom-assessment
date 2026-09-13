package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentRequestDTO {
    @NotNull(message = "Order ID is required")
    private Long orderId;

    // Status can be: SUCCESS, FAILED, TIMEOUT
    @NotBlank(message = "Payment status is required")
    private String paymentStatus;
}

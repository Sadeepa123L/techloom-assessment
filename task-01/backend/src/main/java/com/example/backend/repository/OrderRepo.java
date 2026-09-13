package com.example.backend.repository;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.Order;
import com.example.backend.entity.OrderStatus;
import java.util.List;

public interface OrderRepo extends JpaRepository<Order, Long> {
    List<Order> findByStatusAndExpiresAtBefore(OrderStatus status, LocalDateTime time);
}

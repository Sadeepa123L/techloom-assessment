package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.OrderItem;

public interface OrderIteamRepo extends JpaRepository<OrderItem, Long> {

}

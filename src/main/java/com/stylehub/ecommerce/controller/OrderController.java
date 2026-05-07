package com.stylehub.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    // Must be logged in to place an order
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> placeOrder() {
        return ResponseEntity.ok("Order placed successfully!");
    }
}
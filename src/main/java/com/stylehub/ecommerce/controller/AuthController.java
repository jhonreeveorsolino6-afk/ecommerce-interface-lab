package com.stylehub.ecommerce.controller;

import com.stylehub.ecommerce.dto.RegisterUserDto;
import com.stylehub.ecommerce.model.User;
import com.stylehub.ecommerce.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @Valid @RequestBody RegisterUserDto dto) {

        User user = new User();
        user.setUsername(dto.username());
        // Always hash before saving!
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setRole(dto.role());
        userRepository.save(user);

        return ResponseEntity.ok("User registered: " + dto.username());
    }
}
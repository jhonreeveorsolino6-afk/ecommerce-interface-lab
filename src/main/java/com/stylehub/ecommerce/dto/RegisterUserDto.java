package com.stylehub.ecommerce.dto;

import jakarta.validation.constraints.*;

public record RegisterUserDto(

        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 20, message = "Username must be 3-20 characters")
        String username,

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        String password,

        @NotBlank(message = "Role is required")
        String role  // send "ROLE_USER" or "ROLE_ADMIN"
) {}
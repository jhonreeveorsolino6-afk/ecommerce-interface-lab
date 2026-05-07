package com.stylehub.ecommerce.dto;

import jakarta.validation.constraints.*;

public record CreateProductDto(

        @NotBlank(message = "Product name is required")
        @Size(max = 100, message = "Name must be under 100 characters")
        String name,

        @NotNull(message = "Price is required")
        @Positive(message = "Price must be a positive number")
        Double price,

        String image,

        @NotNull(message = "Category ID is required")
        Long categoryId
) {}
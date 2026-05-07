package com.stylehub.ecommerce.controller;

import com.stylehub.ecommerce.model.Product;
import com.stylehub.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // PUBLIC - anyone can get products
    @GetMapping
    public List<Product> getAll(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {
        if (category != null)
            return productService.getByCategory(category);
        if (minPrice != null && maxPrice != null)
            return productService.getByPriceRange(minPrice, maxPrice);
        return productService.getAllProducts();
    }

    // PUBLIC - anyone can view one product
    @GetMapping("/{id}")
    public Product getOne(@PathVariable Long id) {
        return productService.getById(id);
    }

    // ADMIN ONLY - only admins can add products
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Product create(@RequestBody Product product) {
        return productService.save(product);
    }

    // ADMIN ONLY - only admins can update
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Product update(@PathVariable Long id,
                          @RequestBody Product product) {
        return productService.update(id, product);
    }

    // ADMIN ONLY - only admins can delete
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
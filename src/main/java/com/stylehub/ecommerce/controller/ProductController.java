package com.stylehub.ecommerce.controller;

import com.stylehub.ecommerce.model.Product;
import com.stylehub.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // GET /api/products
    // GET /api/products?category=men
    // GET /api/products?minPrice=0&maxPrice=500
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

//GET /api/products/1
    @GetMapping("/{id}")
    public Product getOne(@PathVariable Long id) {
        return productService.getById(id);
    }

    // POST /api/products
    @PostMapping
    public Product create(@RequestBody Product product) {
        return productService.save(product);
    }

    // PUT /api/products/1
    @PutMapping("/{id}")
    public Product update(@PathVariable Long id,
                          @RequestBody Product product) {
        return productService.update(id, product);
    }

    // DELETE /api/products/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
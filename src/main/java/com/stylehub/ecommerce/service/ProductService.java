package com.stylehub.ecommerce.service;

import com.stylehub.ecommerce.model.Product;
import com.stylehub.ecommerce.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Product not found: " + id));
    }

    public List<Product> getByCategory(String cat) {
        return productRepository.findByCategoryName(cat);
    }

    public List<Product> getByPriceRange(Double min, Double max) {
        return productRepository.findByPriceRange(min, max);
    }

    public Product save(Product product) {
        return productRepository.save(product);
    }

    public Product update(Long id, Product updated) {
        Product p = getById(id);
        p.setName(updated.getName());
        p.setPrice(updated.getPrice());
        p.setImage(updated.getImage());
        return productRepository.save(p);
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }
}

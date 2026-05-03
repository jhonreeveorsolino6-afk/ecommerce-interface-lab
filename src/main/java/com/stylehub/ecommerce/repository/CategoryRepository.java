package com.stylehub.ecommerce.repository;

import com.stylehub.ecommerce.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository
        extends JpaRepository<Category, Long> {

    // Spring auto-generates: SELECT * FROM category WHERE name = ?
    Category findByName(String name);
}
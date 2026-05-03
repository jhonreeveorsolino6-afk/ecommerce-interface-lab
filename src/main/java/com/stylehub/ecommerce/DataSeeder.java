package com.stylehub.ecommerce;

import com.stylehub.ecommerce.model.*;
import com.stylehub.ecommerce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private CategoryRepository catRepo;
    @Autowired private ProductRepository prodRepo;

    @Override
    public void run(String... args) {
        // Skip if already seeded
        if (prodRepo.count() > 0) return;

        Category men   = saveCategory("men");
        Category women = saveCategory("women");
        Category kids  = saveCategory("kids");

        // Your exact 12 products from script.js
        add("Spring Autumn Corduroy Jacket Men", 473.0,
                "7e8fb219505ed05a3baf675067248802.jpg", men);
        add("TALA TUBE MAXI DRESS", 250.0,
                "ph-11134207-7rasl-m3umjcz992n356.webp", women);
        add("Classic Denim Jacket Women", 699.0,
                "https://images.unsplash.com/photo-1544441893-675973e31985?w=400", women);
        add("Slim Fit Chinos Men", 399.0,
                "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400", men);
        add("Floral Summer Dress", 350.0,
                "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400", women);
        add("Kids Hooded Sweatshirt", 299.0,
                "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400", kids);
        add("Oversized Graphic Tee Men", 199.0,
                "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400", men);
        add("Knit Cardigan Women", 549.0,
                "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400", women);
        add("Kids Denim Overalls", 320.0,
                "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400", kids);
        add("Linen Button-Down Shirt Men", 450.0,
                "https://images.unsplash.com/photo-1602810316693-3667c854239a?w=400", men);
        add("Pleated Midi Skirt Women", 380.0,
                "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400", women);
        add("Kids Puffer Jacket", 420.0,
                "https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?w=400", kids);

        System.out.println("Seeded 12 StyleHub products!");
    }

    private Category saveCategory(String name) {
        Category c = new Category();
        c.setName(name);
        return catRepo.save(c);
    }

    private void add(String name, Double price,
                     String image, Category cat) {
        Product p = new Product();
        p.setName(name);
        p.setPrice(price);
        p.setImage(image);
        p.setCategory(cat);
        prodRepo.save(p);
    }
}
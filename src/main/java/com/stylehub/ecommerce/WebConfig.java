package com.stylehub.ecommerce;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                // Live Server uses 5500 or 5501
                .allowedOrigins(
                        "http://localhost:5500",
                        "http://127.0.0.1:5500",
                        "http://localhost:5501",
                        "http://127.0.0.1:5501"
                )
                .allowedMethods("GET","POST","PUT","DELETE")
                .allowedHeaders("Authorization","Content-Type")
                .allowCredentials(true);
    }
}
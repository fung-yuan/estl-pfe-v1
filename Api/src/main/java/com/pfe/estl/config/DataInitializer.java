package com.pfe.estl.config;

import com.pfe.estl.model.User;
import com.pfe.estl.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            // Check if the default admin user already exists
            if (userRepository.findByUsername("admin").isEmpty()) {
                logger.info("Creating default admin user...");
                User adminUser = new User();
                adminUser.setUsername("admin");
                // IMPORTANT: Use a secure default password or prompt for one
                // For demonstration, using "password". Change this immediately!
                adminUser.setPassword(passwordEncoder.encode("password")); 
                // We could set roles here if we add a role field to User model
                userRepository.save(adminUser);
                logger.info("Default admin user created with username 'admin' and password 'password'. Please change the password.");
            } else {
                logger.info("Admin user already exists. Skipping creation.");
            }
        };
    }
}

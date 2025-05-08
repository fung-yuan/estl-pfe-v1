package com.pfe.estl.controller;

import com.pfe.estl.dto.ChangePasswordRequest;
import com.pfe.estl.model.User; 
import com.pfe.estl.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Gets the details of the currently authenticated user.
     * @param userDetails The UserDetails object automatically injected by Spring Security.
     * @return A ResponseEntity containing the username.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            // This shouldn't happen if the endpoint is properly secured,
            // but it's good practice to handle it.
            return ResponseEntity.status(401).body("User not authenticated");
        }
        // You could return the entire UserDetails object, but for now,
        // let's just return the username in a simple map.
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("username", userDetails.getUsername());
        // You could add roles here too if needed: userMap.put("roles", userDetails.getAuthorities());

        return ResponseEntity.ok(userMap);
    }

    /**
     * Changes the password for the currently authenticated user.
     * @param changePasswordRequest DTO containing current and new passwords.
     * @param userDetails The UserDetails object automatically injected by Spring Security.
     * @return A ResponseEntity indicating success or failure.
     */
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("User not authenticated");
        }

        String username = userDetails.getUsername();
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isEmpty()) {
            // Should not happen if token is valid, but good to check
            return ResponseEntity.status(404).body("User not found");
        }

        User user = userOptional.get();

        // Verify current password
        if (!passwordEncoder.matches(changePasswordRequest.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.status(400).body("Incorrect current password");
        }

        // Check if new password is provided and not empty
        if (changePasswordRequest.getNewPassword() == null || changePasswordRequest.getNewPassword().isBlank()) {
            return ResponseEntity.status(400).body("New password cannot be empty");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("Password changed successfully");
    }
}

package com.fitness.backend_core.service;

import com.fitness.backend_core.entity.User;
import com.fitness.backend_core.repository.UserRepository;
import com.fitness.backend_core.util.JwtUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    public User registerUser(User user) {
        validateRegistration(user.getEmail(), user.getPasswordHash());
        ensureEmailIsAvailable(user.getEmail());

        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));

        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("USER");
        }

        return userRepository.save(user);
    }

    public User registerUser(String email, String rawPassword, String phoneNumber) {
        validateRegistration(email, rawPassword);
        ensureEmailIsAvailable(email);

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setPhoneNumber(phoneNumber);
        user.setRole("USER");

        return userRepository.save(user);
    }

    public User loginUser(String email, String rawPassword) {
        if (email == null || email.isBlank() || rawPassword == null || rawPassword.isBlank()) {
            throw new RuntimeException("Email and password are required");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        return user;
    }

    public String authenticateAndGenerateToken(String email, String rawPassword) {
        User user = loginUser(email, rawPassword);
        return jwtUtils.generateToken(user.getEmail());
    }

    private void validateRegistration(String email, String rawPassword) {
        if (email == null || email.isBlank()) {
            throw new RuntimeException("Email is required");
        }

        if (rawPassword == null || rawPassword.isBlank()) {
            throw new RuntimeException("Password is required");
        }
    }

    private void ensureEmailIsAvailable(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
    }
}

package com.fitness.backend_core.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity 
@Table(name = "users")
public class User {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID userId;
    
    @Column(nullable = false, unique = true) 
    private String email;
    
    @Column(name = "password_hash", nullable = false) 
    private String passwordHash;
    
    @Column(name = "phone_number", unique = true) 
    private String phoneNumber;
    
    @Column(nullable = false) 
    private String role = "USER";
    
    @CreationTimestamp 
    @Column(name = "created_at", updatable = false) 
    private LocalDateTime createdAt;
    
    @UpdateTimestamp 
    @Column(name = "updated_at") 
    private LocalDateTime updatedAt;

    // Default constructor
    public User() {
    }

    // Getters and Setters
    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
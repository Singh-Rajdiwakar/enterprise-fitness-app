package com.fitness.backend_core.model.repository;

import com.fitness.backend_core.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ModelUserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
}

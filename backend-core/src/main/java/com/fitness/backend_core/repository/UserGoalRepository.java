package com.fitness.backend_core.repository;

import com.fitness.backend_core.entity.UserGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserGoalRepository extends JpaRepository<UserGoal, UUID> {
    Optional<UserGoal> findByUser_Email(String email);
}

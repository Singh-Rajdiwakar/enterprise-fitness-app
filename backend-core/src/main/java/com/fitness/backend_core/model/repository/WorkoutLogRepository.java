package com.fitness.backend_core.model.repository;

import com.fitness.backend_core.model.WorkoutLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WorkoutLogRepository extends JpaRepository<WorkoutLog, UUID> {
    List<WorkoutLog> findByUser_Email(String email);
}

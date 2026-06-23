package com.fitness.backend_core.repository;

import com.fitness.backend_core.entity.WorkoutHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WorkoutHistoryRepository extends JpaRepository<WorkoutHistory, UUID> {
    List<WorkoutHistory> findByUser_EmailOrderByCompletedAtDesc(String email);
}

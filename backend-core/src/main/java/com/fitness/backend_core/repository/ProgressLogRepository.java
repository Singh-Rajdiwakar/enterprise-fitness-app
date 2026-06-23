package com.fitness.backend_core.repository;

import com.fitness.backend_core.entity.ProgressLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProgressLogRepository extends JpaRepository<ProgressLog, UUID> {
    List<ProgressLog> findByUser_EmailOrderByDateDesc(String email);
}

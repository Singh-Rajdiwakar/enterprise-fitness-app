package com.fitness.backend_core.repository;

import com.fitness.backend_core.entity.StepLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StepLogRepository extends JpaRepository<StepLog, UUID> {
    Optional<StepLog> findByUser_EmailAndDate(String email, LocalDate date);

    List<StepLog> findByUser_EmailOrderByDateDesc(String email);
}

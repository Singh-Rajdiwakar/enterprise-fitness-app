package com.fitness.backend_core.repository;

import com.fitness.backend_core.entity.SleepLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SleepLogRepository extends JpaRepository<SleepLog, UUID> {
    Optional<SleepLog> findByUser_EmailAndDate(String email, LocalDate date);

    List<SleepLog> findByUser_EmailOrderByDateDesc(String email);
}

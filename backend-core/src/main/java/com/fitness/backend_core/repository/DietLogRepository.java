package com.fitness.backend_core.repository;

import com.fitness.backend_core.entity.DietLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DietLogRepository extends JpaRepository<DietLog, UUID> {
    Optional<DietLog> findByUser_EmailAndDate(String email, LocalDate date);

    List<DietLog> findByUser_Email(String email);
}

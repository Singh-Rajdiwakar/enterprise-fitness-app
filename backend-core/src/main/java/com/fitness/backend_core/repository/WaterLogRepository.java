package com.fitness.backend_core.repository;

import com.fitness.backend_core.entity.WaterLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WaterLogRepository extends JpaRepository<WaterLog, UUID> {
    Optional<WaterLog> findByUser_EmailAndDate(String email, LocalDate date);

    List<WaterLog> findByUser_EmailOrderByDateDesc(String email);
}

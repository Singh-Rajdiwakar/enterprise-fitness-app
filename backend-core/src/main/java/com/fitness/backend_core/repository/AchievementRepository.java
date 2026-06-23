package com.fitness.backend_core.repository;

import com.fitness.backend_core.entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, UUID> {
    List<Achievement> findByUser_EmailOrderByEarnedDateDesc(String email);

    boolean existsByUser_EmailAndTitle(String email, String title);
}

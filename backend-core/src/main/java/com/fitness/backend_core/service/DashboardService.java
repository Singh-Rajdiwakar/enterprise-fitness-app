package com.fitness.backend_core.service;

import com.fitness.backend_core.dto.DailySummaryDTO;
import com.fitness.backend_core.entity.ProgressLog;
import com.fitness.backend_core.repository.AchievementRepository;
import com.fitness.backend_core.repository.DietLogRepository;
import com.fitness.backend_core.repository.ProgressLogRepository;
import com.fitness.backend_core.repository.WaterLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DashboardService {

    private final DietLogRepository dietLogRepository;
    private final WaterLogRepository waterLogRepository;
    private final ProgressLogRepository progressLogRepository;
    private final AchievementRepository achievementRepository;

    public DashboardService(
            DietLogRepository dietLogRepository,
            WaterLogRepository waterLogRepository,
            ProgressLogRepository progressLogRepository,
            AchievementRepository achievementRepository) {
        this.dietLogRepository = dietLogRepository;
        this.waterLogRepository = waterLogRepository;
        this.progressLogRepository = progressLogRepository;
        this.achievementRepository = achievementRepository;
    }

    public DailySummaryDTO getDailySummary(String email, LocalDate date) {
        Integer caloriesConsumed = dietLogRepository.findByUser_EmailAndDate(email, date)
                .map(dietLog -> dietLog.getTotalCalories() == null ? 0 : dietLog.getTotalCalories())
                .orElse(0);

        Integer waterConsumedMl = waterLogRepository.findByUser_EmailAndDate(email, date)
                .map(waterLog -> waterLog.getAmountMl() == null ? 0 : waterLog.getAmountMl())
                .orElse(0);

        List<ProgressLog> progressLogs = progressLogRepository.findByUser_EmailOrderByDateDesc(email);
        Double currentWeight = 0.0;
        if (!progressLogs.isEmpty() && progressLogs.get(0).getWeight() != null) {
            currentWeight = progressLogs.get(0).getWeight();
        }

        int achievementsCount = achievementRepository.findByUser_EmailOrderByEarnedDateDesc(email).size();

        return new DailySummaryDTO(caloriesConsumed, waterConsumedMl, currentWeight, achievementsCount);
    }
}

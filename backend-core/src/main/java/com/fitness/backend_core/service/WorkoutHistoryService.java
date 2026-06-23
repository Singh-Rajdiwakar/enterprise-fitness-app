package com.fitness.backend_core.service;

import com.fitness.backend_core.entity.User;
import com.fitness.backend_core.entity.WorkoutHistory;
import com.fitness.backend_core.entity.WorkoutPlan;
import com.fitness.backend_core.repository.UserRepository;
import com.fitness.backend_core.repository.WorkoutHistoryRepository;
import com.fitness.backend_core.repository.WorkoutPlanRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class WorkoutHistoryService {

    private final WorkoutHistoryRepository workoutHistoryRepository;
    private final UserRepository userRepository;
    private final WorkoutPlanRepository workoutPlanRepository;

    public WorkoutHistoryService(
            WorkoutHistoryRepository workoutHistoryRepository,
            UserRepository userRepository,
            WorkoutPlanRepository workoutPlanRepository) {
        this.workoutHistoryRepository = workoutHistoryRepository;
        this.userRepository = userRepository;
        this.workoutPlanRepository = workoutPlanRepository;
    }

    public WorkoutHistory logWorkout(String email, UUID planId, Integer durationMinutes, Integer caloriesBurned) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        WorkoutPlan workoutPlan = workoutPlanRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Workout plan not found"));

        WorkoutHistory workoutHistory = new WorkoutHistory();
        workoutHistory.setUser(user);
        workoutHistory.setWorkoutPlan(workoutPlan);
        workoutHistory.setDurationMinutes(durationMinutes);
        workoutHistory.setCaloriesBurned(caloriesBurned);
        workoutHistory.setCompletedAt(LocalDateTime.now());

        return workoutHistoryRepository.save(workoutHistory);
    }

    public List<WorkoutHistory> getUserHistory(String email) {
        return workoutHistoryRepository.findByUser_EmailOrderByCompletedAtDesc(email);
    }
}

package com.fitness.backend_core.controller;

import com.fitness.backend_core.entity.WorkoutHistory;
import com.fitness.backend_core.service.WorkoutHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/workout-history")
public class WorkoutHistoryController {

    private final WorkoutHistoryService workoutHistoryService;

    public WorkoutHistoryController(WorkoutHistoryService workoutHistoryService) {
        this.workoutHistoryService = workoutHistoryService;
    }

    @PostMapping("/log")
    public ResponseEntity<WorkoutHistory> logWorkout(
            @RequestParam UUID planId,
            @RequestParam Integer durationMinutes,
            @RequestParam Integer caloriesBurned,
            Principal principal) {
        WorkoutHistory savedHistory = workoutHistoryService.logWorkout(
                principal.getName(),
                planId,
                durationMinutes,
                caloriesBurned);
        return ResponseEntity.ok(savedHistory);
    }

    @GetMapping
    public ResponseEntity<List<WorkoutHistory>> getUserHistory(Principal principal) {
        List<WorkoutHistory> history = workoutHistoryService.getUserHistory(principal.getName());
        return ResponseEntity.ok(history);
    }
}

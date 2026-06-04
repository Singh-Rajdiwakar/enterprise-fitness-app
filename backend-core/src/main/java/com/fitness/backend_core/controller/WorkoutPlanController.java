package com.fitness.backend_core.controller;

import com.fitness.backend_core.dto.WorkoutPlanRequest;
import com.fitness.backend_core.entity.WorkoutPlan;
import com.fitness.backend_core.service.WorkoutPlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/workouts")
public class WorkoutPlanController {

    private final WorkoutPlanService workoutPlanService;

    public WorkoutPlanController(WorkoutPlanService workoutPlanService) {
        this.workoutPlanService = workoutPlanService;
    }

    @PostMapping
    public ResponseEntity<WorkoutPlan> createPlan(@RequestBody WorkoutPlanRequest request, Principal principal) {
        WorkoutPlan savedPlan = workoutPlanService.createPlan(principal.getName(), request);
        return ResponseEntity.ok(savedPlan);
    }

    @GetMapping("/me")
    public ResponseEntity<List<WorkoutPlan>> getUserPlans(Principal principal) {
        List<WorkoutPlan> plans = workoutPlanService.getUserPlans(principal.getName());
        return ResponseEntity.ok(plans);
    }
}

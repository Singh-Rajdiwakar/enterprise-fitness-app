package com.fitness.backend_core.service;

import com.fitness.backend_core.dto.WorkoutPlanRequest;
import com.fitness.backend_core.entity.Exercise;
import com.fitness.backend_core.entity.User;
import com.fitness.backend_core.entity.WorkoutPlan;
import com.fitness.backend_core.repository.ExerciseRepository;
import com.fitness.backend_core.repository.UserRepository;
import com.fitness.backend_core.repository.WorkoutPlanRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
public class WorkoutPlanService {

    private final WorkoutPlanRepository workoutPlanRepository;
    private final UserRepository userRepository;
    private final ExerciseRepository exerciseRepository;

    public WorkoutPlanService(WorkoutPlanRepository workoutPlanRepository, UserRepository userRepository, ExerciseRepository exerciseRepository) {
        this.workoutPlanRepository = workoutPlanRepository;
        this.userRepository = userRepository;
        this.exerciseRepository = exerciseRepository;
    }

    public WorkoutPlan createPlan(String email, WorkoutPlanRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Exercise> exercises = exerciseRepository.findAllById(request.getExerciseIds());

        WorkoutPlan plan = new WorkoutPlan();
        plan.setName(request.getName());
        plan.setDescription(request.getDescription());
        plan.setCreator(user);
        plan.setExercises(new HashSet<>(exercises));

        return workoutPlanRepository.save(plan);
    }

    public List<WorkoutPlan> getUserPlans(String email) {
        return workoutPlanRepository.findByCreator_Email(email);
    }
}

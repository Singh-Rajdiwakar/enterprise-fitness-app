package com.fitness.backend_core.service;

import com.fitness.backend_core.entity.User;
import com.fitness.backend_core.entity.UserGoal;
import com.fitness.backend_core.repository.UserGoalRepository;
import com.fitness.backend_core.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserGoalService {

    private final UserGoalRepository userGoalRepository;
    private final UserRepository userRepository;

    public UserGoalService(UserGoalRepository userGoalRepository, UserRepository userRepository) {
        this.userGoalRepository = userGoalRepository;
        this.userRepository = userRepository;
    }

    public UserGoal upsertUserGoal(String email, UserGoal request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userGoalRepository.findByUser_Email(email)
                .map(existing -> {
                    existing.setDailyCalorieTarget(request.getDailyCalorieTarget());
                    existing.setDailyWaterTargetMl(request.getDailyWaterTargetMl());
                    existing.setTargetWeight(request.getTargetWeight());
                    return userGoalRepository.save(existing);
                })
                .orElseGet(() -> {
                    request.setUser(user);
                    return userGoalRepository.save(request);
                });
    }

    public UserGoal getUserGoal(String email) {
        return userGoalRepository.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("User goal not found"));
    }
}

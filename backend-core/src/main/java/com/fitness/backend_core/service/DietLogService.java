package com.fitness.backend_core.service;

import com.fitness.backend_core.entity.DietLog;
import com.fitness.backend_core.entity.User;
import com.fitness.backend_core.repository.DietLogRepository;
import com.fitness.backend_core.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DietLogService {

    private final DietLogRepository dietLogRepository;
    private final UserRepository userRepository;

    public DietLogService(DietLogRepository dietLogRepository, UserRepository userRepository) {
        this.dietLogRepository = dietLogRepository;
        this.userRepository = userRepository;
    }

    public DietLog logDiet(String email, DietLog request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return dietLogRepository.findByUser_EmailAndDate(email, request.getDate())
                .map(existing -> {
                    existing.setTotalCalories(addIntegers(existing.getTotalCalories(), request.getTotalCalories()));
                    existing.setProtein(addDoubles(existing.getProtein(), request.getProtein()));
                    existing.setCarbs(addDoubles(existing.getCarbs(), request.getCarbs()));
                    existing.setFats(addDoubles(existing.getFats(), request.getFats()));
                    return dietLogRepository.save(existing);
                })
                .orElseGet(() -> {
                    request.setUser(user);
                    return dietLogRepository.save(request);
                });
    }

    public List<DietLog> getUserDietLogs(String email) {
        return dietLogRepository.findByUser_Email(email);
    }

    private Integer addIntegers(Integer currentValue, Integer addedValue) {
        int current = currentValue == null ? 0 : currentValue;
        int added = addedValue == null ? 0 : addedValue;
        return current + added;
    }

    private Double addDoubles(Double currentValue, Double addedValue) {
        double current = currentValue == null ? 0.0 : currentValue;
        double added = addedValue == null ? 0.0 : addedValue;
        return current + added;
    }
}

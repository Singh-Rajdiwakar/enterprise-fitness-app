package com.fitness.backend_core.service;

import com.fitness.backend_core.entity.StepLog;
import com.fitness.backend_core.entity.User;
import com.fitness.backend_core.repository.StepLogRepository;
import com.fitness.backend_core.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class StepLogService {

    private final StepLogRepository stepLogRepository;
    private final UserRepository userRepository;

    public StepLogService(StepLogRepository stepLogRepository, UserRepository userRepository) {
        this.stepLogRepository = stepLogRepository;
        this.userRepository = userRepository;
    }

    public StepLog logSteps(String email, StepLog request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getDate() == null) {
            request.setDate(LocalDate.now());
        }

        return stepLogRepository.findByUser_EmailAndDate(email, request.getDate())
                .map(existing -> {
                    existing.setStepCount(addIntegers(existing.getStepCount(), request.getStepCount()));
                    existing.setDistanceKm(addDoubles(existing.getDistanceKm(), request.getDistanceKm()));
                    return stepLogRepository.save(existing);
                })
                .orElseGet(() -> {
                    request.setUser(user);
                    return stepLogRepository.save(request);
                });
    }

    public List<StepLog> getUserStepLogs(String email) {
        return stepLogRepository.findByUser_EmailOrderByDateDesc(email);
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

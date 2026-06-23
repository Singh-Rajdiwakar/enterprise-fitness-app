package com.fitness.backend_core.service;

import com.fitness.backend_core.entity.User;
import com.fitness.backend_core.entity.WaterLog;
import com.fitness.backend_core.repository.UserRepository;
import com.fitness.backend_core.repository.WaterLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class WaterLogService {

    private final WaterLogRepository waterLogRepository;
    private final UserRepository userRepository;

    public WaterLogService(WaterLogRepository waterLogRepository, UserRepository userRepository) {
        this.waterLogRepository = waterLogRepository;
        this.userRepository = userRepository;
    }

    public WaterLog logWater(String email, WaterLog request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getDate() == null) {
            request.setDate(LocalDate.now());
        }

        return waterLogRepository.findByUser_EmailAndDate(email, request.getDate())
                .map(existing -> {
                    existing.setAmountMl(addAmounts(existing.getAmountMl(), request.getAmountMl()));
                    return waterLogRepository.save(existing);
                })
                .orElseGet(() -> {
                    request.setUser(user);
                    return waterLogRepository.save(request);
                });
    }

    public List<WaterLog> getUserWaterLogs(String email) {
        return waterLogRepository.findByUser_EmailOrderByDateDesc(email);
    }

    private Integer addAmounts(Integer currentValue, Integer addedValue) {
        int current = currentValue == null ? 0 : currentValue;
        int added = addedValue == null ? 0 : addedValue;
        return current + added;
    }
}

package com.fitness.backend_core.service;

import com.fitness.backend_core.entity.SleepLog;
import com.fitness.backend_core.entity.User;
import com.fitness.backend_core.repository.SleepLogRepository;
import com.fitness.backend_core.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class SleepLogService {

    private final SleepLogRepository sleepLogRepository;
    private final UserRepository userRepository;

    public SleepLogService(SleepLogRepository sleepLogRepository, UserRepository userRepository) {
        this.sleepLogRepository = sleepLogRepository;
        this.userRepository = userRepository;
    }

    public SleepLog logSleep(String email, SleepLog request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getDate() == null) {
            request.setDate(LocalDate.now());
        }

        return sleepLogRepository.findByUser_EmailAndDate(email, request.getDate())
                .map(existing -> {
                    existing.setDurationMinutes(request.getDurationMinutes());
                    existing.setSleepQuality(request.getSleepQuality());
                    return sleepLogRepository.save(existing);
                })
                .orElseGet(() -> {
                    request.setUser(user);
                    return sleepLogRepository.save(request);
                });
    }

    public List<SleepLog> getUserSleepLogs(String email) {
        return sleepLogRepository.findByUser_EmailOrderByDateDesc(email);
    }
}

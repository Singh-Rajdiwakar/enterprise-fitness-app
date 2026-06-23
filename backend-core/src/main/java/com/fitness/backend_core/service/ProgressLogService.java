package com.fitness.backend_core.service;

import com.fitness.backend_core.entity.ProgressLog;
import com.fitness.backend_core.entity.User;
import com.fitness.backend_core.repository.ProgressLogRepository;
import com.fitness.backend_core.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ProgressLogService {

    private final ProgressLogRepository progressLogRepository;
    private final UserRepository userRepository;

    public ProgressLogService(ProgressLogRepository progressLogRepository, UserRepository userRepository) {
        this.progressLogRepository = progressLogRepository;
        this.userRepository = userRepository;
    }

    public ProgressLog addProgressLog(String email, ProgressLog request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        request.setUser(user);

        if (request.getDate() == null) {
            request.setDate(LocalDate.now());
        }

        return progressLogRepository.save(request);
    }

    public List<ProgressLog> getUserProgressLogs(String email) {
        return progressLogRepository.findByUser_EmailOrderByDateDesc(email);
    }
}

package com.fitness.backend_core.service;

import com.fitness.backend_core.entity.Achievement;
import com.fitness.backend_core.entity.User;
import com.fitness.backend_core.repository.AchievementRepository;
import com.fitness.backend_core.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final UserRepository userRepository;

    public AchievementService(AchievementRepository achievementRepository, UserRepository userRepository) {
        this.achievementRepository = achievementRepository;
        this.userRepository = userRepository;
    }

    public Achievement awardAchievement(String email, String title, String description) {
        if (achievementRepository.existsByUser_EmailAndTitle(email, title)) {
            throw new RuntimeException("Achievement already earned");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Achievement achievement = new Achievement();
        achievement.setUser(user);
        achievement.setTitle(title);
        achievement.setDescription(description);
        achievement.setEarnedDate(LocalDate.now());

        return achievementRepository.save(achievement);
    }

    public List<Achievement> getUserAchievements(String email) {
        return achievementRepository.findByUser_EmailOrderByEarnedDateDesc(email);
    }
}

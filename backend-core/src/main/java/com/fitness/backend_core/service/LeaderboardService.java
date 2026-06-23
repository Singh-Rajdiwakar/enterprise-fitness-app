package com.fitness.backend_core.service;

import com.fitness.backend_core.dto.LeaderboardEntryDTO;
import com.fitness.backend_core.entity.User;
import com.fitness.backend_core.repository.AchievementRepository;
import com.fitness.backend_core.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class LeaderboardService {

    private static final int POINTS_PER_ACHIEVEMENT = 50;
    private static final int LEADERBOARD_LIMIT = 10;

    private final UserRepository userRepository;
    private final AchievementRepository achievementRepository;

    public LeaderboardService(UserRepository userRepository, AchievementRepository achievementRepository) {
        this.userRepository = userRepository;
        this.achievementRepository = achievementRepository;
    }

    public List<LeaderboardEntryDTO> getGlobalLeaderboard() {
        List<User> users = userRepository.findAll();
        List<LeaderboardEntryDTO> leaderboardEntries = new ArrayList<>();

        for (User user : users) {
            int totalAchievements = achievementRepository
                    .findByUser_EmailOrderByEarnedDateDesc(user.getEmail())
                    .size();
            int totalPoints = totalAchievements * POINTS_PER_ACHIEVEMENT;

            leaderboardEntries.add(new LeaderboardEntryDTO(user.getEmail(), totalAchievements, totalPoints));
        }

        leaderboardEntries.sort(Comparator.comparing(LeaderboardEntryDTO::getTotalPoints).reversed());

        if (leaderboardEntries.size() <= LEADERBOARD_LIMIT) {
            return leaderboardEntries;
        }

        return leaderboardEntries.subList(0, LEADERBOARD_LIMIT);
    }
}

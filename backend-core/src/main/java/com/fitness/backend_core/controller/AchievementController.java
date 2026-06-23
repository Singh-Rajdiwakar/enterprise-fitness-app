package com.fitness.backend_core.controller;

import com.fitness.backend_core.entity.Achievement;
import com.fitness.backend_core.service.AchievementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    private final AchievementService achievementService;

    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @PostMapping("/award")
    public ResponseEntity<Achievement> awardAchievement(
            @RequestParam String title,
            @RequestParam String description,
            Principal principal) {
        Achievement savedAchievement = achievementService.awardAchievement(principal.getName(), title, description);
        return ResponseEntity.ok(savedAchievement);
    }

    @GetMapping
    public ResponseEntity<List<Achievement>> getUserAchievements(Principal principal) {
        List<Achievement> achievements = achievementService.getUserAchievements(principal.getName());
        return ResponseEntity.ok(achievements);
    }
}

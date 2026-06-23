package com.fitness.backend_core.controller;

import com.fitness.backend_core.dto.LeaderboardEntryDTO;
import com.fitness.backend_core.service.LeaderboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping
    public ResponseEntity<List<LeaderboardEntryDTO>> getGlobalLeaderboard(Principal principal) {
        List<LeaderboardEntryDTO> leaderboard = leaderboardService.getGlobalLeaderboard();
        return ResponseEntity.ok(leaderboard);
    }
}

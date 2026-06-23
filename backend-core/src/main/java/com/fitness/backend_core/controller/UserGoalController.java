package com.fitness.backend_core.controller;

import com.fitness.backend_core.entity.UserGoal;
import com.fitness.backend_core.service.UserGoalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/goals")
public class UserGoalController {

    private final UserGoalService userGoalService;

    public UserGoalController(UserGoalService userGoalService) {
        this.userGoalService = userGoalService;
    }

    @PutMapping
    public ResponseEntity<UserGoal> upsertUserGoal(@RequestBody UserGoal request, Principal principal) {
        UserGoal savedGoal = userGoalService.upsertUserGoal(principal.getName(), request);
        return ResponseEntity.ok(savedGoal);
    }

    @GetMapping
    public ResponseEntity<UserGoal> getUserGoal(Principal principal) {
        UserGoal goal = userGoalService.getUserGoal(principal.getName());
        return ResponseEntity.ok(goal);
    }
}

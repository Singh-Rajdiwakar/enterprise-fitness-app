package com.fitness.backend_core.controller;

import com.fitness.backend_core.entity.DietLog;
import com.fitness.backend_core.service.DietLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/diet")
public class DietLogController {

    private final DietLogService dietLogService;

    public DietLogController(DietLogService dietLogService) {
        this.dietLogService = dietLogService;
    }

    @PostMapping
    public ResponseEntity<DietLog> logDiet(@RequestBody DietLog request, Principal principal) {
        DietLog savedLog = dietLogService.logDiet(principal.getName(), request);
        return ResponseEntity.ok(savedLog);
    }

    @GetMapping
    public ResponseEntity<List<DietLog>> getUserDietLogs(Principal principal) {
        List<DietLog> logs = dietLogService.getUserDietLogs(principal.getName());
        return ResponseEntity.ok(logs);
    }
}

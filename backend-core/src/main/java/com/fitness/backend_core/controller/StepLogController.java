package com.fitness.backend_core.controller;

import com.fitness.backend_core.entity.StepLog;
import com.fitness.backend_core.service.StepLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/steps")
public class StepLogController {

    private final StepLogService stepLogService;

    public StepLogController(StepLogService stepLogService) {
        this.stepLogService = stepLogService;
    }

    @PostMapping
    public ResponseEntity<StepLog> logSteps(@RequestBody StepLog request, Principal principal) {
        StepLog savedLog = stepLogService.logSteps(principal.getName(), request);
        return ResponseEntity.ok(savedLog);
    }

    @GetMapping
    public ResponseEntity<List<StepLog>> getUserStepLogs(Principal principal) {
        List<StepLog> logs = stepLogService.getUserStepLogs(principal.getName());
        return ResponseEntity.ok(logs);
    }
}

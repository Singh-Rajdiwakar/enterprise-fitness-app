package com.fitness.backend_core.controller;

import com.fitness.backend_core.entity.ProgressLog;
import com.fitness.backend_core.service.ProgressLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class ProgressLogController {

    private final ProgressLogService progressLogService;

    public ProgressLogController(ProgressLogService progressLogService) {
        this.progressLogService = progressLogService;
    }

    @PostMapping
    public ResponseEntity<ProgressLog> addProgressLog(@RequestBody ProgressLog request, Principal principal) {
        ProgressLog savedLog = progressLogService.addProgressLog(principal.getName(), request);
        return ResponseEntity.ok(savedLog);
    }

    @GetMapping
    public ResponseEntity<List<ProgressLog>> getUserProgressLogs(Principal principal) {
        List<ProgressLog> logs = progressLogService.getUserProgressLogs(principal.getName());
        return ResponseEntity.ok(logs);
    }
}

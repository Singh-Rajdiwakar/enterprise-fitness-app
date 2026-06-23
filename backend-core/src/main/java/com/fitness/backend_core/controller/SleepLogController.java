package com.fitness.backend_core.controller;

import com.fitness.backend_core.entity.SleepLog;
import com.fitness.backend_core.service.SleepLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/sleep")
public class SleepLogController {

    private final SleepLogService sleepLogService;

    public SleepLogController(SleepLogService sleepLogService) {
        this.sleepLogService = sleepLogService;
    }

    @PostMapping
    public ResponseEntity<SleepLog> logSleep(@RequestBody SleepLog request, Principal principal) {
        SleepLog savedLog = sleepLogService.logSleep(principal.getName(), request);
        return ResponseEntity.ok(savedLog);
    }

    @GetMapping
    public ResponseEntity<List<SleepLog>> getUserSleepLogs(Principal principal) {
        List<SleepLog> logs = sleepLogService.getUserSleepLogs(principal.getName());
        return ResponseEntity.ok(logs);
    }
}

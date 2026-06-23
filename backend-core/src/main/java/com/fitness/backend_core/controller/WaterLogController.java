package com.fitness.backend_core.controller;

import com.fitness.backend_core.entity.WaterLog;
import com.fitness.backend_core.service.WaterLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/water")
public class WaterLogController {

    private final WaterLogService waterLogService;

    public WaterLogController(WaterLogService waterLogService) {
        this.waterLogService = waterLogService;
    }

    @PostMapping
    public ResponseEntity<WaterLog> logWater(@RequestBody WaterLog request, Principal principal) {
        WaterLog savedLog = waterLogService.logWater(principal.getName(), request);
        return ResponseEntity.ok(savedLog);
    }

    @GetMapping
    public ResponseEntity<List<WaterLog>> getUserWaterLogs(Principal principal) {
        List<WaterLog> logs = waterLogService.getUserWaterLogs(principal.getName());
        return ResponseEntity.ok(logs);
    }
}

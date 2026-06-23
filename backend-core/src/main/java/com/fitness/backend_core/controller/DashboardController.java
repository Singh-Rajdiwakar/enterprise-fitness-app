package com.fitness.backend_core.controller;

import com.fitness.backend_core.dto.DailySummaryDTO;
import com.fitness.backend_core.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/daily")
    public ResponseEntity<DailySummaryDTO> getDailySummary(
            @RequestParam(required = false) LocalDate date,
            Principal principal) {
        LocalDate summaryDate = date == null ? LocalDate.now() : date;
        DailySummaryDTO summary = dashboardService.getDailySummary(principal.getName(), summaryDate);
        return ResponseEntity.ok(summary);
    }
}

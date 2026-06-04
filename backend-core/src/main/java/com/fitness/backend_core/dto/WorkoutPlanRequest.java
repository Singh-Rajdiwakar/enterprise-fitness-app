package com.fitness.backend_core.dto;

import java.util.List;
import java.util.UUID;

public class WorkoutPlanRequest {
    private String name;
    private String description;
    private List<UUID> exerciseIds;

    public WorkoutPlanRequest() {
    }

    public WorkoutPlanRequest(String name, String description, List<UUID> exerciseIds) {
        this.name = name;
        this.description = description;
        this.exerciseIds = exerciseIds;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<UUID> getExerciseIds() {
        return exerciseIds;
    }

    public void setExerciseIds(List<UUID> exerciseIds) {
        this.exerciseIds = exerciseIds;
    }
}

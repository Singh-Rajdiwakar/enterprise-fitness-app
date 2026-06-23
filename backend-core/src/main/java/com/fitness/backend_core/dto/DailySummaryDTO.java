package com.fitness.backend_core.dto;

public class DailySummaryDTO {

    private Integer caloriesConsumed;
    private Integer waterConsumedMl;
    private Double currentWeight;
    private int achievementsCount;

    public DailySummaryDTO() {
    }

    public DailySummaryDTO(Integer caloriesConsumed, Integer waterConsumedMl, Double currentWeight, int achievementsCount) {
        this.caloriesConsumed = caloriesConsumed;
        this.waterConsumedMl = waterConsumedMl;
        this.currentWeight = currentWeight;
        this.achievementsCount = achievementsCount;
    }

    public Integer getCaloriesConsumed() {
        return caloriesConsumed;
    }

    public void setCaloriesConsumed(Integer caloriesConsumed) {
        this.caloriesConsumed = caloriesConsumed;
    }

    public Integer getWaterConsumedMl() {
        return waterConsumedMl;
    }

    public void setWaterConsumedMl(Integer waterConsumedMl) {
        this.waterConsumedMl = waterConsumedMl;
    }

    public Double getCurrentWeight() {
        return currentWeight;
    }

    public void setCurrentWeight(Double currentWeight) {
        this.currentWeight = currentWeight;
    }

    public int getAchievementsCount() {
        return achievementsCount;
    }

    public void setAchievementsCount(int achievementsCount) {
        this.achievementsCount = achievementsCount;
    }
}

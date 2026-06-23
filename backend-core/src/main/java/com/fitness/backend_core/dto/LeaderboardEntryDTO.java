package com.fitness.backend_core.dto;

public class LeaderboardEntryDTO {

    private String userEmail;
    private Integer totalAchievements;
    private Integer totalPoints;

    public LeaderboardEntryDTO() {
    }

    public LeaderboardEntryDTO(String userEmail, Integer totalAchievements, Integer totalPoints) {
        this.userEmail = userEmail;
        this.totalAchievements = totalAchievements;
        this.totalPoints = totalPoints;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public Integer getTotalAchievements() {
        return totalAchievements;
    }

    public void setTotalAchievements(Integer totalAchievements) {
        this.totalAchievements = totalAchievements;
    }

    public Integer getTotalPoints() {
        return totalPoints;
    }

    public void setTotalPoints(Integer totalPoints) {
        this.totalPoints = totalPoints;
    }
}

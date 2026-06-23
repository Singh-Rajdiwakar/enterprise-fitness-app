package com.fitness.backend_core.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "user_goals")
public class UserGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private Integer dailyCalorieTarget;
    private Integer dailyWaterTargetMl;
    private Double targetWeight;

    public UserGoal() {
    }

    public UserGoal(UUID id, User user, Integer dailyCalorieTarget, Integer dailyWaterTargetMl, Double targetWeight) {
        this.id = id;
        this.user = user;
        this.dailyCalorieTarget = dailyCalorieTarget;
        this.dailyWaterTargetMl = dailyWaterTargetMl;
        this.targetWeight = targetWeight;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Integer getDailyCalorieTarget() {
        return dailyCalorieTarget;
    }

    public void setDailyCalorieTarget(Integer dailyCalorieTarget) {
        this.dailyCalorieTarget = dailyCalorieTarget;
    }

    public Integer getDailyWaterTargetMl() {
        return dailyWaterTargetMl;
    }

    public void setDailyWaterTargetMl(Integer dailyWaterTargetMl) {
        this.dailyWaterTargetMl = dailyWaterTargetMl;
    }

    public Double getTargetWeight() {
        return targetWeight;
    }

    public void setTargetWeight(Double targetWeight) {
        this.targetWeight = targetWeight;
    }
}

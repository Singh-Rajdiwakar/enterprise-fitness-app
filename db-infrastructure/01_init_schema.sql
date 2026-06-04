-- This script initializes the core database schema for the Enterprise Fitness Application.
-- It is designed for high performance and scalability, targeting up to 1,000,000 concurrent users.
-- Primary Keys: UUIDs are used to ensure unique identifiers across distributed systems.
-- Indexes: Strategically placed to optimize query performance for common access patterns.
-- Foreign Keys: Enforce data integrity with cascade deletes where appropriate.

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: users
-- Stores core user authentication and contact information.
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'user', -- e.g., 'user', 'trainer', 'admin'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for 'users' table
-- Index on 'email' for fast login lookups.
CREATE INDEX idx_users_email ON users(email);
-- Index on 'role' for filtering users by their role.
CREATE INDEX idx_users_role ON users(role);


-- Table: user_profiles
-- Stores detailed profile information for each user.
CREATE TABLE user_profiles (
    profile_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    full_name VARCHAR(255),
    age INT,
    weight_kg DECIMAL(5, 2),
    height_cm DECIMAL(5, 2),
    fitness_goal TEXT,
    fitness_level VARCHAR(50), -- e.g., 'beginner', 'intermediate', 'advanced'
    profile_picture_url VARCHAR(255),

    -- Foreign Key to users table
    -- Ensures that a user profile is always associated with a valid user.
    -- ON DELETE CASCADE will automatically delete the profile if the user is deleted.
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES users(user_id) 
        ON DELETE CASCADE
);

-- Index for 'user_profiles' table
-- A unique index on 'user_id' ensures a one-to-one relationship between a user and their profile.
CREATE UNIQUE INDEX idx_user_profiles_user_id ON user_profiles(user_id);


-- Table: exercises
-- A catalog of all available exercises.
CREATE TABLE exercises (
    exercise_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    target_muscle VARCHAR(100),
    equipment_required VARCHAR(100),
    video_url VARCHAR(255),
    animation_3d_url VARCHAR(255)
);

-- Index for 'exercises' table
-- Index on 'target_muscle' for quickly finding exercises for a specific muscle group.
CREATE INDEX idx_exercises_target_muscle ON exercises(target_muscle);


-- Table: workout_plans
-- Stores user-created or pre-defined workout plans.
CREATE TABLE workout_plans (
    plan_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty_level VARCHAR(50), -- e.g., 'easy', 'medium', 'hard'
    created_by UUID,

    -- Foreign Key to users table
    -- Associates a plan with its creator.
    -- ON DELETE SET NULL means if the creator's account is deleted, the plan is not deleted but the creator is anonymized.
    CONSTRAINT fk_created_by
        FOREIGN KEY(created_by) 
        REFERENCES users(user_id) 
        ON DELETE SET NULL
);

-- Index for 'workout_plans' table
-- Index on 'created_by' to quickly find all plans created by a specific user.
CREATE INDEX idx_workout_plans_created_by ON workout_plans(created_by);


-- Table: plan_exercises
-- A join table linking exercises to workout plans, defining the structure of a workout.
CREATE TABLE plan_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL,
    exercise_id UUID NOT NULL,
    sets INT,
    reps INT,
    rest_time_seconds INT,

    -- Foreign Key to workout_plans
    -- ON DELETE CASCADE ensures that if a workout plan is deleted, all its associated exercise entries are also removed.
    CONSTRAINT fk_plan
        FOREIGN KEY(plan_id) 
        REFERENCES workout_plans(plan_id) 
        ON DELETE CASCADE,

    -- Foreign Key to exercises
    -- ON DELETE CASCADE ensures that if an exercise is removed from the catalog, it's also removed from all workout plans.
    CONSTRAINT fk_exercise
        FOREIGN KEY(exercise_id) 
        REFERENCES exercises(exercise_id) 
        ON DELETE CASCADE
);

-- Indexes for 'plan_exercises' table
-- Index on 'plan_id' to quickly retrieve all exercises for a given workout plan.
CREATE INDEX idx_plan_exercises_plan_id ON plan_exercises(plan_id);
-- Index on 'exercise_id' to find which workout plans include a specific exercise.
CREATE INDEX idx_plan_exercises_exercise_id ON plan_exercises(exercise_id);


-- Table: food_items
-- A catalog of food items for diet tracking.
CREATE TABLE food_items (
    food_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    barcode VARCHAR(100) UNIQUE,
    calories DECIMAL(10, 2),
    protein_g DECIMAL(10, 2),
    carbs_g DECIMAL(10, 2),
    fats_g DECIMAL(10, 2)
);

-- Index for 'food_items' table
-- Index on 'barcode' for very fast lookups via a barcode scanner.
CREATE INDEX idx_food_items_barcode ON food_items(barcode);
-- Index on 'name' for text-based food searches.
CREATE INDEX idx_food_items_name ON food_items(name);


-- Table: daily_diet_logs
-- Logs the food items consumed by a user on a specific date.
CREATE TABLE daily_diet_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    food_id UUID NOT NULL,
    quantity_grams DECIMAL(10, 2) NOT NULL,
    log_date DATE NOT NULL,
    meal_type VARCHAR(50), -- e.g., 'breakfast', 'lunch', 'dinner', 'snack'

    -- Foreign Key to users
    -- ON DELETE CASCADE ensures that if a user is deleted, all their diet logs are also deleted.
    CONSTRAINT fk_user_log
        FOREIGN KEY(user_id) 
        REFERENCES users(user_id) 
        ON DELETE CASCADE,

    -- Foreign Key to food_items
    -- ON DELETE CASCADE is used here. If a food item is deleted from the catalog, related logs are removed.
    -- An alternative would be ON DELETE SET NULL if we wanted to keep the log but anonymize the food item.
    CONSTRAINT fk_food_log
        FOREIGN KEY(food_id) 
        REFERENCES food_items(food_id) 
        ON DELETE CASCADE
);

-- Indexes for 'daily_diet_logs' table
-- A composite index on 'user_id' and 'log_date' is crucial for performance.
-- This will be the most common query pattern: "Show me all food logged by a user for a specific day".
CREATE INDEX idx_daily_diet_logs_user_id_log_date ON daily_diet_logs(user_id, log_date);

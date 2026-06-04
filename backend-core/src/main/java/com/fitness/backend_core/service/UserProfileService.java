package com.fitness.backend_core.service;

import com.fitness.backend_core.entity.User;
import com.fitness.backend_core.entity.UserProfile;
import com.fitness.backend_core.repository.UserProfileRepository;
import com.fitness.backend_core.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    public UserProfileService(UserProfileRepository userProfileRepository, UserRepository userRepository) {
        this.userProfileRepository = userProfileRepository;
        this.userRepository = userRepository;
    }

    public UserProfile createOrUpdateProfile(String email, UserProfile profileData) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<UserProfile> existingProfileOpt = userProfileRepository.findByUser_Email(email);

        UserProfile profileToSave;
        if (existingProfileOpt.isPresent()) {
            profileToSave = existingProfileOpt.get();
            profileToSave.setFullName(profileData.getFullName());
            profileToSave.setAge(profileData.getAge());
            profileToSave.setWeight(profileData.getWeight());
            profileToSave.setHeight(profileData.getHeight());
            profileToSave.setFitnessGoal(profileData.getFitnessGoal());
        } else {
            profileToSave = profileData;
            profileToSave.setUser(user);
        }

        return userProfileRepository.save(profileToSave);
    }

    public UserProfile getProfile(String email) {
        return userProfileRepository.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }
}

package com.fitness.backend_core.controller;

import com.fitness.backend_core.entity.UserProfile;
import com.fitness.backend_core.service.UserProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/profiles")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfile> getProfile(Principal principal) {
        UserProfile profile = userProfileService.getProfile(principal.getName());
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/me")
    public ResponseEntity<UserProfile> createOrUpdateProfile(@RequestBody UserProfile profileData, Principal principal) {
        UserProfile savedProfile = userProfileService.createOrUpdateProfile(principal.getName(), profileData);
        return ResponseEntity.ok(savedProfile);
    }
}

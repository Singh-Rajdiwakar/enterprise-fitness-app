package com.fitness.backend_core.controller;

import com.fitness.backend_core.entity.User;
import com.fitness.backend_core.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:5174", "http://localhost:8081"})
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody Map<String, String> registrationData) {
        String email = registrationData.get("email");
        String password = registrationData.get("password");

        if (password == null || password.isBlank()) {
            password = registrationData.get("passwordHash");
        }

        String phoneNumber = registrationData.get("phoneNumber");
        User registeredUser = userService.registerUser(email, password, phoneNumber);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Registration successful");
        response.put("userId", registeredUser.getUserId().toString());
        response.put("email", registeredUser.getEmail());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");
        String token = userService.authenticateAndGenerateToken(email, password);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("token", token);
        
        return ResponseEntity.ok(response);
    }
}

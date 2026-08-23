package com.love.portfolio.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/admin")
public class AdminAuthController {
    private final String adminPin;

    public AdminAuthController(@Value("${admin.pin:${ADMIN_PIN:}}") String adminPin) {
        this.adminPin = adminPin;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request, HttpSession session) {
        String submittedPin = request.getOrDefault("pin", "");
        if (adminPin.isBlank() || !MessageDigest.isEqual(
                adminPin.getBytes(StandardCharsets.UTF_8), submittedPin.getBytes(StandardCharsets.UTF_8))) {
            return ResponseEntity.status(401).body(Map.of("message", "Mã PIN không đúng."));
        }
        session.setAttribute("adminAuthenticated", true);
        return ResponseEntity.ok(Map.of("authenticated", true));
    }

    @GetMapping("/me")
    public Map<String, Boolean> me(HttpSession session) {
        return Map.of("authenticated", Boolean.TRUE.equals(session.getAttribute("adminAuthenticated")));
    }

    @PostMapping("/logout")
    public Map<String, Boolean> logout(HttpSession session) {
        session.invalidate();
        return Map.of("authenticated", false);
    }
}

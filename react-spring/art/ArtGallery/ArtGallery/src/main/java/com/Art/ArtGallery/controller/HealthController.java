package com.Art.ArtGallery.controller;

import com.Art.ArtGallery.repository.ArtworkRepository;
import com.Art.ArtGallery.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    @Autowired
    private ArtworkRepository artworkRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/actuator/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        try {
            // Test database connections
            long artworkCount = artworkRepository.count();
            long userCount = userRepository.count();

            return ResponseEntity.ok(Map.of(
                    "status", "UP",
                    "service", "Art Gallery API",
                    "database", "CONNECTED",
                    "artworks", artworkCount,
                    "users", userCount,
                    "timestamp", java.time.LocalDateTime.now().toString()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(503).body(Map.of(
                    "status", "DOWN",
                    "service", "Art Gallery API",
                    "database", "DISCONNECTED",
                    "error", e.getMessage(),
                    "timestamp", java.time.LocalDateTime.now().toString()
            ));
        }
    }

    @GetMapping("/api/test/artworks")
    public ResponseEntity<Map<String, Object>> testArtworksEndpoint() {
        try {
            var artworks = artworkRepository.findAll();
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "count", artworks.size(),
                    "artworks", artworks
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
}
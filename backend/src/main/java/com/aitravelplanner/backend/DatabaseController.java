package com.aitravelplanner.backend;

import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/database")
public class DatabaseController {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/status")
    public Map<String, Object> databaseStatus() {
        Integer destinations = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM destinations",
                Integer.class
        );

        Integer attractions = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM attractions",
                Integer.class
        );

        return Map.of(
                "status", "CONNECTED",
                "database", "ai_travel_planner",
                "destinationCount", destinations,
                "attractionCount", attractions
        );
    }
}

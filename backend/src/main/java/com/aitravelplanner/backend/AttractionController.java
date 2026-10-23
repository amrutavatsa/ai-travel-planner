package com.aitravelplanner.backend;

import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/attractions")
public class AttractionController {

    private final JdbcTemplate jdbcTemplate;

    public AttractionController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<Map<String, Object>> getAttractions(
            @RequestParam(defaultValue = "Shivamogga") String destination) {

        String sql = """
                SELECT
                    a.id,
                    d.name AS destination,
                    a.name,
                    a.category,
                    a.description,
                    a.latitude,
                    a.longitude,
                    a.estimated_visit_minutes AS estimatedVisitMinutes,
                    a.estimated_cost AS estimatedCost
                FROM attractions a
                JOIN destinations d ON d.id = a.destination_id
                WHERE d.name = ?
                  AND a.is_active = TRUE
                ORDER BY a.name
                """;

        return jdbcTemplate.queryForList(sql, destination);
    }
}

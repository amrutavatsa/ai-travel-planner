
package com.aitravelplanner.backend;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = {
    "http://localhost:5500",
    "http://127.0.0.1:5500"
})
public class TripController {

    @PostMapping("/preview")
    public Map<String, Object> previewTrip(
            @RequestBody TripRequest request) {

        if (request.destination() == null
                || request.destination().isBlank()
                || request.startPoint() == null
                || request.startPoint().isBlank()
                || request.durationHours() == null
                || request.durationHours() <= 0
                || request.interests() == null
                || request.interests().isEmpty()) {

            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Destination, starting point, positive duration, and at least one interest are required."
            );
        }

        return Map.of(
            "status", "RECEIVED",
            "message", "Trip request received successfully.",
            "tripRequest", request
        );
    }
}

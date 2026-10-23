
package com.aitravelplanner.backend;

import java.util.List;

public record TripRequest(
    String destination,
    String startPoint,
    String tripDate,
    String startTime,
    Integer durationHours,
    String pace,
    List<String> interests
) {
}

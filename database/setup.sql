CREATE DATABASE IF NOT EXISTS ai_travel_planner
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE ai_travel_planner;

CREATE TABLE IF NOT EXISTS destinations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL UNIQUE,
    state VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attractions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    destination_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    latitude DECIMAL(10, 7) NULL,
    longitude DECIMAL(10, 7) NULL,
    estimated_visit_minutes INT NOT NULL DEFAULT 60,
    estimated_cost DECIMAL(10, 2) NULL DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_attractions_destination
        FOREIGN KEY (destination_id) REFERENCES destinations(id),
    CONSTRAINT chk_visit_minutes CHECK (estimated_visit_minutes > 0),
    CONSTRAINT chk_estimated_cost CHECK (estimated_cost >= 0),
    CONSTRAINT uq_attraction_destination_name UNIQUE (destination_id, name)
);

INSERT INTO destinations (name, state, description)
VALUES (
    'Shivamogga',
    'Karnataka',
    'Initial destination dataset for the AI Travel Planner prototype.'
)
ON DUPLICATE KEY UPDATE
    state = VALUES(state);

INSERT INTO attractions
    (destination_id, name, category, description, estimated_visit_minutes,
     latitude, longitude, estimated_cost, is_active)
SELECT d.id, seed.name, seed.category, seed.description, seed.visit_minutes,
       NULL, NULL, NULL, TRUE
FROM destinations d
JOIN (
    SELECT 'Shivappa Nayaka Palace' AS name, 'Heritage' AS category,
           'Historic palace in Shivamogga. Visit duration is an initial estimate.' AS description,
           60 AS visit_minutes
    UNION ALL
    SELECT 'Sakrebyle Elephant Camp', 'Wildlife',
           'Elephant camp near Shivamogga. Check official visiting hours before travel.',
           90
    UNION ALL
    SELECT 'Shivamogga Zoo and Safari', 'Wildlife',
           'Zoo and safari attraction. Check current operating hours and availability.',
           120
    UNION ALL
    SELECT 'Freedom Park', 'Park',
           'Park in Shivamogga. Visit duration is an initial estimate.',
           45
    UNION ALL
    SELECT 'Jog Falls Viewpoint', 'Nature',
           'Waterfall viewpoint in the wider Shivamogga region; travel distance must be considered.',
           90
) AS seed
WHERE d.name = 'Shivamogga'
ON DUPLICATE KEY UPDATE
    category = VALUES(category);

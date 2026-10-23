# AI Travel Planner — Phase 1

A web-based travel-planning project using HTML, CSS and JavaScript, a Java Spring Boot backend, and MySQL. Shivamogga, Karnataka is the initial destination.

## Current Phase 1 status

Implemented:
- Web frontend with trip request form and destination interface.
- Spring Boot health endpoint: `GET /api/health`.
- Database status endpoint: `GET /api/database/status`.
- Attraction listing endpoint: `GET /api/attractions?destination=Shivamogga`.
- Trip request validation endpoint: `POST /api/trips/preview`.
- MySQL schema and initial attraction seed script.

Not implemented yet:
- AI-generated itinerary optimization.
- Random Forest crowd prediction.
- Genetic Algorithm itinerary optimization.
- Verified live crowd and traffic data.
- Persistent trip and itinerary storage.

The trip preview endpoint currently validates and acknowledges a request; it does not generate or save an itinerary. Initial attraction durations are estimates. Coordinates and costs are not yet populated.

## Technology stack

- Frontend: HTML, CSS, JavaScript
- Backend: Java 21, Spring Boot 4.0.8, Maven Wrapper
- Database: MySQL 8
- Planned future work: Python, scikit-learn, Random Forest, Genetic Algorithm

## Requirements on Windows

Install:
1. Git for Windows.
2. JDK 21.
3. MySQL Community Server 8.
4. Visual Studio Code and its Live Server extension, or another static web server.

You do not need to install Maven separately; the project includes the Maven Wrapper.

Verify Java and Git in PowerShell:

```powershell
java -version
git --version
```

## 1. Download the project

```powershell
git clone https://github.com/amrutavatsa/ai-travel-planner.git
Set-Location .\ai-travel-planner
```

## 2. Create the database

Open MySQL Workbench, connect as a MySQL administrator, open `database/setup.sql`, and execute the script.

Alternatively, from PowerShell in the project root, use the MySQL client if it is installed at the default Windows location:

```powershell
cmd /c '"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < database\setup.sql'
```

Enter the MySQL administrator password when prompted. If MySQL is installed elsewhere, adjust the executable path.

The script creates the `ai_travel_planner` database, tables, and initial Shivamogga attraction records.

## 3. Create the application database user

In MySQL Workbench, run the following as an administrator. Replace the example password with a strong password of your own:

```sql
CREATE USER 'travel_app'@'localhost'
IDENTIFIED BY 'choose-a-strong-local-password';

GRANT SELECT, INSERT, UPDATE, DELETE
ON ai_travel_planner.*
TO 'travel_app'@'localhost';
```

If the user already exists, use `ALTER USER` instead of `CREATE USER`. Never commit real passwords to Git.

## 4. Start the backend

Open PowerShell and change to the cloned project folder. If you are already in the project root, skip the first command.

```powershell
Set-Location "C:\path\to\ai-travel-planner\backend"

$env:DB_USERNAME = "travel_app"
$env:DB_PASSWORD = Read-Host "Enter the travel_app MySQL password"

.\mvnw.cmd spring-boot:run
```

Replace `C:\path\to\ai-travel-planner\backend` with the actual backend folder path on your computer. Keep this terminal open while using the application. The database password is entered locally and must not be committed to Git.

The first start may take some time while Maven downloads dependencies.

## 5. Verify the backend

Open these URLs in a browser:

- `http://localhost:8080/api/health`
- `http://localhost:8080/api/database/status`
- `http://localhost:8080/api/attractions`

The database status should report `CONNECTED`, and the attraction endpoint should return the seeded records.

## 6. Start the frontend

Open the cloned project folder in Visual Studio Code. Install the **Live Server** extension if necessary.

Right-click `frontend/index.html` and choose **Open with Live Server**. Use a URL on port 5500, such as:

`http://127.0.0.1:5500/frontend/index.html`

Keep the backend running in its separate terminal. The frontend is configured to call the backend at `http://localhost:8080`.

## Troubleshooting

- **Java not found:** Install JDK 21 and ensure `java` is available in a new terminal.
- **Database connection failed:** Confirm MySQL is running, the database user/password are correct, and the database exists.
- **Port 8080 already in use:** Stop the other process using that port before starting the backend.
- **Frontend request blocked:** Use the supported Live Server origin on port 5500 and verify the backend is running.
- **No attraction coordinates or costs:** These fields are currently unpopulated; this is expected in the initial dataset.

## Current API summary

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check backend status |
| GET | `/api/database/status` | Check database connectivity and row counts |
| GET | `/api/attractions` | List attractions; optional `destination` parameter |
| POST | `/api/trips/preview` | Validate and acknowledge a trip request |

## Project structure

```text
ai-travel-planner/
├── backend/       # Spring Boot API
├── database/      # MySQL schema and seed data
├── docs/          # Project documentation
├── frontend/      # HTML, CSS and JavaScript
└── ml/            # Planned machine-learning work
```

## Data and research note

The initial attraction records are a prototype dataset, not a verified live tourism feed. Validate opening hours, visit durations, coordinates, costs, and travel estimates before using them for real-world itineraries.

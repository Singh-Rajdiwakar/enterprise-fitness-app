# Enterprise Fitness App

Enterprise Fitness App is a full-stack fitness platform for workout planning, nutrition tracking, hydration, body progress, sleep, steps, achievements, real-time trainer communication, and mobile-first user engagement.

The ecosystem is split into four deployable layers:

- `backend-core`: Spring Boot REST API for auth, business logic, trackers, goals, dashboard summaries, achievements, and Swagger documentation.
- `backend-realtime`: Node.js and Socket.IO service for live trainer chat, community posts, and future horizontally-scaled real-time events.
- `frontend-web`: React and Vite trainer/admin portal with premium dashboard UI and live trainer chat.
- `frontend-mobile`: Expo React Native user app with auth, dashboard, workouts, diet, community, profile, AI camera placeholder, wearables simulation, sockets, and push-notification readiness.

## Tech Stack

- Java 17, Spring Boot 3, Spring Security, Spring Data JPA
- PostgreSQL and Redis via Docker Compose
- Node.js, Express, Socket.IO, optional Redis adapter structure
- React, Vite, Tailwind CSS, Axios, Socket.IO client
- Expo React Native, React Navigation, AsyncStorage, Expo Notifications
- JWT bearer authentication
- OpenAPI/Swagger UI

## Local Ports

| Service | URL |
| --- | --- |
| Spring Boot API | `http://localhost:8080` |
| Swagger UI | `http://localhost:8080/swagger-ui.html` |
| Realtime service | `http://localhost:3000` |
| Realtime health check | `http://localhost:3000/health` |
| React web portal | `http://localhost:5174` |
| Expo Metro | `http://localhost:8081` |
| PostgreSQL | `localhost:5433` |
| Redis | `localhost:6379` |

## Quick Start

Use the root helper scripts for local end-to-end startup instructions.

Windows:

```bat
start-local.bat
```

Bash:

```bash
./start-local.sh
```

On Linux systems with `gnome-terminal`, this can open startup tabs:

```bash
./start-local.sh --run
```

## Manual Startup

Run each layer in a separate terminal.

1. Start PostgreSQL and Redis:

```bash
cd db-infrastructure
docker compose up -d
```

If Windows PowerShell says `docker` is not recognized but Docker Desktop is installed, start Docker Desktop and run:

```powershell
cd db-infrastructure
& "C:\Program Files\Docker\Docker\resources\bin\docker.exe" compose up -d
```

2. Start the Spring Boot API:

```bash
cd backend-core
./mvnw spring-boot:run
```

Windows:

```bat
cd backend-core
mvnw.cmd spring-boot:run
```

3. Start the Socket.IO realtime service:

```bash
cd backend-realtime
npm install
npm run dev
```

4. Start the React web portal:

```bash
cd frontend-web
npm install
npm run dev
```

5. Start the Expo mobile app:

```bash
cd frontend-mobile
npm install
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080/api EXPO_PUBLIC_REALTIME_URL=http://localhost:3000 npx expo start --port 8081
```

Windows PowerShell:

```powershell
cd frontend-mobile
$env:EXPO_PUBLIC_API_BASE_URL='http://localhost:8080/api'
$env:EXPO_PUBLIC_REALTIME_URL='http://localhost:3000'
npx expo start --port 8081
```

For Android Emulator networking, replace `localhost` with `10.0.2.2` in `frontend-mobile/.env`. For physical devices, use the host machine LAN IP address.

## Environment

Backend defaults are configured for the included Docker Compose database:

```text
DB_URL=jdbc:postgresql://localhost:5433/fitness_db
DB_USERNAME=admin
DB_PASSWORD=Raj@3395
```

Realtime defaults:

```text
PORT=3000
CLIENT_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:8081
REDIS_URL=redis://localhost:6379
ENABLE_REDIS_ADAPTER=false
```

Mobile local defaults are in `frontend-mobile/.env`:

```text
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080/api
EXPO_PUBLIC_REALTIME_URL=http://localhost:3000
```

Web realtime defaults are in `frontend-web/.env`:

```text
VITE_REALTIME_URL=http://localhost:3000
```

## Key Features

- Secure registration/login with JWT bearer authentication
- Protected web and mobile routes
- Dashboard summary aggregation for calories, water, weight, achievements, and activity
- Diet, hydration, sleep, step, progress, workout history, workout plan, and user-goal tracking
- Achievement and leaderboard modules
- Web trainer chat using Socket.IO rooms
- Mobile community live updates and trainer-room socket subscriptions
- Expo notification permission and token readiness
- Swagger/OpenAPI API documentation
- Dark premium glassmorphism UI across web and mobile

## Project Structure

```text
enterprise-fitness-app/
  backend-core/        Spring Boot REST API, security, services, repositories, entities
  backend-realtime/    Express + Socket.IO service for chat and live events
  db-infrastructure/   Docker Compose for PostgreSQL and Redis
  frontend-web/        React + Vite trainer/admin web portal
  frontend-mobile/     Expo React Native mobile app
  start-local.bat      Windows local startup helper
  start-local.sh       Bash local startup helper
```

## Verification Commands

```bash
cd backend-core && ./mvnw -DskipTests compile
cd backend-realtime && npm test
cd frontend-web && npm run build
cd frontend-mobile && npx expo export --platform android
```

The Expo export creates a temporary `dist/` folder. It can be removed after verification if you are not preparing a build artifact.

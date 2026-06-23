# Enterprise Fitness App

Enterprise Fitness App is a full-stack fitness tracking platform for managing workouts, nutrition, hydration, body progress, sleep, steps, achievements, goals, and dashboard analytics. It combines a Spring Boot backend with a polished React frontend designed for a premium user experience.

## Tech Stack

- Java with Spring Boot
- React with Vite
- SQL / PostgreSQL
- Tailwind CSS

## Features

- Secure authentication with JWT-based login and protected frontend routes
- Premium dashboard with responsive Bento Grid layout
- Real-time data logging for water, diet, steps, sleep, workouts, progress, and goals
- Achievement tracking and leaderboard support
- Swagger/OpenAPI documentation for backend API testing
- Glassmorphism UI with responsive Tailwind CSS styling

## Setup Guide

### Backend

```bash
cd backend-core
./mvnw spring-boot:run
```

On Windows:

```bash
cd backend-core
.\mvnw.cmd spring-boot:run
```

The backend runs on `http://localhost:8080`.

Swagger UI is available at:

```text
http://localhost:8080/swagger-ui.html
```

### Frontend

```bash
cd frontend-web
npm install
npm run dev
```

The frontend runs on the Vite development URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Project Structure

```text
enterprise-fitness-app/
  backend-core/        Spring Boot REST API, entities, services, repositories, security
  backend-realtime/    Realtime backend service placeholder/module
  db-infrastructure/   Database schema and infrastructure scripts
  frontend-web/        React + Vite web application
  frontend-mobile/     Mobile frontend placeholder/module
```

## Notes

- Backend endpoints use JWT bearer authentication after login.
- The frontend stores the JWT token in `localStorage` and uses an Axios interceptor for authenticated API calls.
- Dashboard data is aggregated from tracker modules such as diet, water, steps, progress, and achievements.

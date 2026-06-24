@echo off
setlocal

set "ROOT=%~dp0"
set "DB_DIR=%ROOT%db-infrastructure"
set "CORE_DIR=%ROOT%backend-core"
set "REALTIME_DIR=%ROOT%backend-realtime"
set "WEB_DIR=%ROOT%frontend-web"
set "MOBILE_DIR=%ROOT%frontend-mobile"

echo.
echo Enterprise Fitness App - Local Ecosystem
echo ========================================
echo.
echo Ports:
echo   Postgres:        localhost:5433 -^> container:5432
echo   Redis:           localhost:6379
echo   Spring Boot API: http://localhost:8080
echo   Realtime API:    http://localhost:3000
echo   React Web:       http://localhost:5174
echo   Expo Metro:      http://localhost:8081
echo.
echo Open these commands in separate terminals if you prefer manual startup:
echo.
echo   1. Docker:
echo      cd /d "%DB_DIR%" ^&^& docker compose up -d
echo.
echo   2. Spring Boot backend:
echo      cd /d "%CORE_DIR%" ^&^& mvnw.cmd spring-boot:run
echo.
echo   3. Realtime backend:
echo      cd /d "%REALTIME_DIR%" ^&^& npm run dev
echo.
echo   4. React web portal:
echo      cd /d "%WEB_DIR%" ^&^& npm run dev
echo.
echo   5. Expo mobile app:
echo      cd /d "%MOBILE_DIR%" ^&^& npx expo start --port 8081
echo.

choice /C YN /M "Open the local stack in separate command windows now"
if errorlevel 2 (
  echo Startup cancelled. Use the commands above when ready.
  exit /b 0
)

echo Starting Docker infrastructure...
start "Fitness Docker" cmd /k pushd "%DB_DIR%" ^&^& docker compose up -d ^&^& docker compose ps

echo Starting Spring Boot backend...
start "Fitness Spring Boot" cmd /k pushd "%CORE_DIR%" ^&^& mvnw.cmd spring-boot:run

echo Starting realtime backend...
start "Fitness Realtime" cmd /k pushd "%REALTIME_DIR%" ^&^& npm run dev

echo Starting React web portal...
start "Fitness Web" cmd /k pushd "%WEB_DIR%" ^&^& npm run dev

echo Starting Expo mobile app...
start "Fitness Mobile" cmd /k pushd "%MOBILE_DIR%" ^&^& set EXPO_PUBLIC_API_BASE_URL=http://localhost:8080/api ^&^& set EXPO_PUBLIC_REALTIME_URL=http://localhost:3000 ^&^& npx expo start --port 8081

echo.
echo Startup windows launched.
echo Wait for Docker/Postgres to become healthy before using backend login/register.
endlocal

#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DB_DIR="$ROOT/db-infrastructure"
CORE_DIR="$ROOT/backend-core"
REALTIME_DIR="$ROOT/backend-realtime"
WEB_DIR="$ROOT/frontend-web"
MOBILE_DIR="$ROOT/frontend-mobile"

print_commands() {
  cat <<EOF

Enterprise Fitness App - Local Ecosystem
========================================

Ports:
  Postgres:        localhost:5433 -> container:5432
  Redis:           localhost:6379
  Spring Boot API: http://localhost:8080
  Realtime API:    http://localhost:3000
  React Web:       http://localhost:5174
  Expo Metro:      http://localhost:8081

Open these commands in separate terminals:

1. Docker:
   cd "$DB_DIR" && docker compose up -d

2. Spring Boot backend:
   cd "$CORE_DIR" && ./mvnw spring-boot:run

3. Realtime backend:
   cd "$REALTIME_DIR" && npm run dev

4. React web portal:
   cd "$WEB_DIR" && npm run dev

5. Expo mobile app:
   cd "$MOBILE_DIR" && EXPO_PUBLIC_API_BASE_URL=http://localhost:8080/api EXPO_PUBLIC_REALTIME_URL=http://localhost:3000 npx expo start --port 8081

Run './start-local.sh --run' to launch these in separate gnome-terminal tabs when available.

EOF
}

open_gnome_tab() {
  local title="$1"
  local directory="$2"
  local command="$3"

  gnome-terminal --tab --title="$title" -- bash -lc "cd '$directory' && $command; exec bash"
}

print_commands

if [[ "${1:-}" != "--run" ]]; then
  exit 0
fi

if ! command -v gnome-terminal >/dev/null 2>&1; then
  echo "No supported terminal launcher found. Use the commands above manually."
  exit 0
fi

open_gnome_tab "Fitness Docker" "$DB_DIR" "docker compose up -d && docker compose ps"
open_gnome_tab "Fitness Spring Boot" "$CORE_DIR" "./mvnw spring-boot:run"
open_gnome_tab "Fitness Realtime" "$REALTIME_DIR" "npm run dev"
open_gnome_tab "Fitness Web" "$WEB_DIR" "npm run dev"
open_gnome_tab "Fitness Mobile" "$MOBILE_DIR" "EXPO_PUBLIC_API_BASE_URL=http://localhost:8080/api EXPO_PUBLIC_REALTIME_URL=http://localhost:3000 npx expo start --port 8081"

echo "Startup tabs launched. Wait for Docker/Postgres before using backend login/register."

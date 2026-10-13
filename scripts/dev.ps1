#!/usr/bin/env pwsh
# Local dev bootstrap (Windows PowerShell 5.1+ / pwsh).
#
# What it does, in order:
#   1. Fails fast when the repo-root `.env` is missing (Prisma + backend both
#      need it; the error otherwise surfaces as a cryptic Zod/Prisma crash).
#   2. Starts only the `postgres` + `redis` compose services. The backend and
#      frontend run on the host via `pnpm dev`, so the app containers stay down.
#   3. Waits until Postgres accepts connections (pg_isready, ~60 s cap).
#   4. Applies pending Prisma migrations (`migrate deploy` is idempotent: a
#      no-op on an up-to-date volume, so re-runs are safe).
#   5. Hands over to `pnpm dev` (backend + frontend concurrently).
#
# Switches:
#   -SkipDocker    Postgres/Redis are managed externally; skip compose + wait.
#   -SkipMigrate   Skip `prisma migrate deploy` (e.g. the DBA applies schema).
param(
  [switch]$SkipDocker,
  [switch]$SkipMigrate
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Resolve the repo root from this script's location so the script works no
# matter which directory it is invoked from.
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

# 1. The whole stack reads the repo-root .env (backend via src/config/env.ts,
#    frontend via Vite envDir, Prisma via --env-file below).
if (-not (Test-Path "$Root/.env")) {
  Write-Error "Missing $Root/.env — copy the template first:  Copy-Item .env.example .env"
}

# The wait loop authenticates as the superuser the compose file creates.
# Honors an explicit POSTGRES_USER in .env, defaults to postgres.
$PgUser = "postgres"
$match = Select-String -Path "$Root/.env" -Pattern '^POSTGRES_USER=(.*)$' | Select-Object -Last 1
if ($match -and $match.Matches[0].Groups[1].Value.Trim()) {
  $PgUser = $match.Matches[0].Groups[1].Value.Trim()
}

if (-not $SkipDocker) {
  # 2. Docker must be reachable before touching compose.
  try {
    docker info 2>$null | Out-Null
  } catch {
    Write-Error "Docker is not reachable (docker info failed). Start Docker Desktop or re-run with -SkipDocker against an external database."
  }

  Write-Host "Starting postgres + redis..."
  docker compose up -d postgres redis

  # 3. pg_isready exit 0 means "accepting connections" even before the first
  # checkpoint finishes; the backend retries its own connects anyway, but
  # waiting here turns a wall of P1001 retries into one clean handover.
  Write-Host "Waiting for Postgres (user $PgUser)..."
  $ready = $false
  for ($i = 0; $i -lt 30; $i++) {
    docker compose exec -T postgres pg_isready -U $PgUser 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) { $ready = $true; break }
    Start-Sleep -Seconds 2
  }
  if (-not $ready) {
    Write-Error "Postgres did not become ready in ~60 s. Inspect with:  docker compose logs postgres"
  }
  Write-Host "Postgres is accepting connections."
}

if (-not $SkipMigrate) {
  # 4. Run from the repo root: the root .bin shim finds prisma and Prisma
  # auto-loads ./.env by itself, so no --env-file plumbing is needed.
  # migrate deploy never needs a shadow database and never touches applied
  # migrations.
  Write-Host "Applying pending Prisma migrations..."
  & "$Root/node_modules/.bin/prisma" migrate deploy --schema apps/backend/prisma/schema.prisma
}

# 5. Hand over to the dev servers; Ctrl+C stops both (concurrently forwards it).
Write-Host "Starting dev servers (backend + frontend)..."
pnpm dev

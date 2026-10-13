#!/bin/sh
# Local dev bootstrap (Linux/macOS, Git Bash, WSL).
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
# Flags:
#   --skip-docker    Postgres/Redis are managed externally; skip compose + wait.
#   --skip-migrate   Skip `prisma migrate deploy` (e.g. the DBA applies schema).
set -e

# Resolve the repo root from this script's location so the script works no
# matter which directory it is invoked from.
ROOT="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$ROOT"

SKIP_DOCKER=0
SKIP_MIGRATE=0
for arg in "$@"; do
  case "$arg" in
    --skip-docker) SKIP_DOCKER=1 ;;
    --skip-migrate) SKIP_MIGRATE=1 ;;
    -h|--help)
      echo "Usage: ./scripts/dev.sh [--skip-docker] [--skip-migrate]"
      exit 0
      ;;
    *)
      echo "Unknown flag: $arg (see --help)" >&2
      exit 1
      ;;
  esac
done

# 1. The whole stack reads the repo-root .env (backend via src/config/env.ts,
#    frontend via Vite envDir, Prisma via --env-file below).
if [ ! -f "$ROOT/.env" ]; then
  echo "Missing $ROOT/.env — copy the template first:" >&2
  echo "  cp .env.example .env" >&2
  exit 1
fi

# The wait loop authenticates as the superuser the compose file creates.
# Honors an explicit POSTGRES_USER in .env, defaults to postgres.
PGUSER_CONFIG="$(sed -n 's/^POSTGRES_USER=//p' "$ROOT/.env" | tail -n 1 | tr -d '\r')"
PGUSER_CONFIG="${PGUSER_CONFIG:-postgres}"

if [ "$SKIP_DOCKER" -eq 0 ]; then
  # 2. Docker must be reachable before touching compose.
  if ! docker info >/dev/null 2>&1; then
    echo "Docker is not reachable (docker info failed). Start Docker Desktop" >&2
    echo "or re-run with --skip-docker against an external database." >&2
    exit 1
  fi

  echo "Starting postgres + redis..."
  docker compose up -d postgres redis

  # 3. pg_isready exit 0 means "accepting connections" even before the first
  # checkpoint finishes; the backend retries its own connects anyway, but
  # waiting here turns a wall of P1001 retries into one clean handover.
  echo "Waiting for Postgres (user $PGUSER_CONFIG)..."
  READY=0
  for _ in $(seq 1 30); do
    if docker compose exec -T postgres pg_isready -U "$PGUSER_CONFIG" >/dev/null 2>&1; then
      READY=1
      break
    fi
    sleep 2
  done
  if [ "$READY" -ne 1 ]; then
    echo "Postgres did not become ready in ~60 s. Inspect with:" >&2
    echo "  docker compose logs postgres" >&2
    exit 1
  fi
  echo "Postgres is accepting connections."
fi

if [ "$SKIP_MIGRATE" -eq 0 ]; then
  # 4. Run from the repo root: the root .bin shim finds prisma and Prisma
  # auto-loads ./.env by itself, so no --env-file plumbing is needed. migrate
  # deploy never needs a shadow database and never touches applied migrations.
  echo "Applying pending Prisma migrations..."
  ./node_modules/.bin/prisma migrate deploy --schema apps/backend/prisma/schema.prisma
fi

# 5. Replace this shell with the dev servers; Ctrl+C stops both (concurrently
# forwards SIGINT) and returns here only on failure.
echo "Starting dev servers (backend + frontend)..."
exec pnpm dev

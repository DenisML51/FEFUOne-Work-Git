#!/bin/sh
set -e

# Apply migrations, retrying briefly while the database finishes starting up.
attempts=0
until alembic upgrade head; do
    attempts=$((attempts + 1))
    if [ "$attempts" -ge 15 ]; then
        echo "Database not reachable after $attempts attempts, giving up." >&2
        exit 1
    fi
    echo "Waiting for database (attempt $attempts)..." >&2
    sleep 2
done

exec uvicorn app.main:app --host 0.0.0.0 --port 8000

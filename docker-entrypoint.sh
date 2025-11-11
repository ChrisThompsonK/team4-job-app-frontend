#!/bin/sh
set -e

# Set default environment variables if not provided
export NODE_ENV="${NODE_ENV:-production}"
export PORT="${PORT:-3000}"
export API_BASE_URL="${API_BASE_URL:-http://host.docker.internal:3001}"

# Generate random session secret if not provided
if [ -z "$SESSION_SECRET" ]; then
  export SESSION_SECRET=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
  echo "Generated SESSION_SECRET"
fi

echo "Starting application..."
exec npm start

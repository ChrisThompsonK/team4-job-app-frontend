#!/bin/bash

# Run the frontend Docker container as a standalone container
echo "Starting frontend Docker container..."

# Stop and remove existing container if it exists
docker stop job-app-frontend-standalone 2>/dev/null || true
docker rm job-app-frontend-standalone 2>/dev/null || true

# Get the host's IP address (for Mac, we'll use host.docker.internal)
# For Linux, you might need to use the actual host IP
BACKEND_URL=${BACKEND_URL:-http://host.docker.internal:3001}

# Run the frontend container
docker run -d \
  --name job-app-frontend-standalone \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e API_BASE_URL=${BACKEND_URL} \
  -e SESSION_SECRET=${SESSION_SECRET:-your-session-secret-change-in-production} \
  --restart unless-stopped \
  job-app-frontend:latest

echo "Frontend container started successfully!"
echo "Access the frontend at: http://localhost:3000"
echo "Backend URL configured as: ${BACKEND_URL}"
echo "To view logs: docker logs -f job-app-frontend-standalone"
echo "To stop: docker stop job-app-frontend-standalone"

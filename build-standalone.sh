#!/bin/bash

# Build the frontend Docker image as a standalone container
echo "Building frontend Docker image..."
docker build -t job-app-frontend:latest .

echo "Frontend image built successfully!"
echo "To run the frontend container, use: ./run-standalone.sh"

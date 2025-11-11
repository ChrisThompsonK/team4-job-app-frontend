# Docker & Azure Container Registry Guide

This guide covers containerizing the Team 4 Job App Frontend and deploying it to Azure Container Registry (ACR).

## Quick Start

### 1. Build and Push to Azure

```bash
# Set your Azure Container Registry details
export DOCKER_REGISTRY="myregistry.azurecr.io"
export DOCKER_IMAGE="team4-job-app-frontend"
export DOCKER_TAG="latest"

# Run the push script
./scripts/docker-push-azure.sh
```

### 2. Run Locally with Docker

```bash
# Build the image
docker build -t team4-job-app-frontend .

# Run the container
docker run -p 3000:3000 \
  -e API_BASE_URL=http://host.docker.internal:8080 \
  team4-job-app-frontend
```

### 3. Run with Docker Compose

```bash
# Start both frontend and backend
docker-compose up

# In another terminal, start the backend
cd ../team4-job-app-backend
docker-compose up
```

---

## Prerequisites

### Required Tools

- **Docker Desktop** or Docker Engine
- **Azure CLI** - [Install guide](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)
- **Azure Subscription** with Container Registry access
- **Git** for version control

### Verify Installation

```bash
docker --version
az --version
git --version
```

---

## Docker Configuration

### Dockerfile Overview

The `Dockerfile` uses a multi-stage build for optimized image size:

**Build Stage:**
- Uses `node:20-alpine` as base
- Installs dependencies (`npm ci`)
- Compiles TypeScript and builds CSS

**Production Stage:**
- Uses `node:20-alpine` (minimal base)
- Installs only production dependencies
- Copies built artifacts from build stage
- Creates non-root user for security
- Includes health check

### File: `.dockerignore`

Excludes unnecessary files from the Docker build:
- `node_modules/`, `dist/` (will be rebuilt)
- Test files (`*.test.ts`, `*.spec.ts`)
- Documentation and configuration files

---

## Building Docker Images

### Local Build

```bash
# Build with default tag
docker build -t team4-job-app-frontend .

# Build with specific tag
docker build -t team4-job-app-frontend:v1.0.0 .

# Build with custom Dockerfile
docker build -f Dockerfile -t team4-job-app-frontend:latest .

# View image details
docker image inspect team4-job-app-frontend
```

### Build Arguments

You can pass build arguments if needed (currently not configured, but example):

```bash
docker build --build-arg NODE_ENV=production \
  -t team4-job-app-frontend .
```

---

## Running Docker Containers

### Basic Run

```bash
docker run -p 3000:3000 team4-job-app-frontend
```

### With Environment Variables

```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e API_BASE_URL=http://api.example.com:8080 \
  team4-job-app-frontend
```

### Interactive Mode (for debugging)

```bash
docker run -it -p 3000:3000 team4-job-app-frontend

# Or with a shell
docker run -it -p 3000:3000 --entrypoint sh team4-job-app-frontend
```

### Background Mode

```bash
docker run -d \
  --name frontend \
  -p 3000:3000 \
  team4-job-app-frontend

# Check logs
docker logs frontend

# Stop container
docker stop frontend
```

---

## Docker Compose

### File: `docker-compose.yml`

Defines services for local development:

```yaml
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - API_BASE_URL=http://backend:8080
    depends_on:
      - backend
    
  backend:
    image: team4-job-app-backend:latest
    ports:
      - "8080:8080"
```

### Common Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f frontend

# Stop services
docker-compose down

# Rebuild images
docker-compose build

# Rebuild and restart
docker-compose up --build
```

### Environment Configuration

Create a `.env` file in the root directory:

```bash
# Server Configuration
PORT=3000

# Backend API (change this to match your backend)
API_BASE_URL=http://localhost:8080

# Docker Configuration (for Azure push)
DOCKER_REGISTRY=myregistry.azurecr.io
DOCKER_IMAGE=team4-job-app-frontend
DOCKER_TAG=latest
```

---

## Azure Container Registry (ACR)

### Prerequisites

1. **Azure Subscription**: [Create free account](https://azure.microsoft.com/free/)
2. **Resource Group**: Create or use existing
3. **Container Registry**: Create new ACR instance

### Create Azure Container Registry

```bash
# Login to Azure
az login

# Set subscription
az account set --subscription "subscription-id"

# Create resource group
az group create \
  --name myResourceGroup \
  --location eastus

# Create container registry
az acr create \
  --resource-group myResourceGroup \
  --name myregistry \
  --sku Basic
```

### Configure Credentials

```bash
# Get registry login server
az acr show \
  --name myregistry \
  --query loginServer \
  --output table

# Login with Azure CLI (recommended)
az acr login --name myregistry

# Or get credentials for manual login
az acr credential show \
  --name myregistry \
  --query "[passwords[0].value]" \
  --output tsv
```

---

## Build and Push Script

### File: `scripts/docker-push-azure.sh`

Automated script for building and pushing to ACR.

### Usage

```bash
# Set environment variables
export DOCKER_REGISTRY="myregistry.azurecr.io"
export DOCKER_IMAGE="team4-job-app-frontend"
export DOCKER_TAG="latest"

# Run the script
./scripts/docker-push-azure.sh
```

### Script Features

- ✅ Checks prerequisites (Docker, Azure CLI)
- ✅ Validates registry format
- ✅ Authenticates to Azure ACR
- ✅ Builds Docker image
- ✅ Pushes to ACR
- ✅ Displays deployment instructions

### Example Output

```
✅ Prerequisites check passed
ℹ️  Checking prerequisites...
✅ Registry validation passed: myregistry.azurecr.io
✅ Successfully logged in to myregistry
✅ Docker image built successfully: myregistry.azurecr.io/team4-job-app-frontend:latest
✅ Image pushed successfully: myregistry.azurecr.io/team4-job-app-frontend:latest

════════════════════════════════════════════════════
📦 Docker Image Build & Push Complete
════════════════════════════════════════════════════

Registry:  myregistry.azurecr.io
Image:     myregistry.azurecr.io/team4-job-app-frontend:latest
Tag:       latest
```

---

## Manual Push to ACR

If you prefer to do it manually:

```bash
# 1. Login
az acr login --name myregistry

# 2. Build image with full registry path
docker build -t myregistry.azurecr.io/team4-job-app-frontend:latest .

# 3. Push to ACR
docker push myregistry.azurecr.io/team4-job-app-frontend:latest

# 4. Verify
az acr repository list --name myregistry
az acr repository show-tags --name myregistry \
  --repository team4-job-app-frontend
```

---

## Deploy to Azure Container Instances (ACI)

### Quick Deploy

```bash
az container create \
  --resource-group myResourceGroup \
  --name job-app-frontend \
  --image myregistry.azurecr.io/team4-job-app-frontend:latest \
  --cpu 1 \
  --memory 1 \
  --registry-login-server myregistry.azurecr.io \
  --registry-username <username> \
  --registry-password <password> \
  --ports 3000 \
  --environment-variables \
    PORT=3000 \
    API_BASE_URL=http://backend-service:8080 \
  --dns-name-label job-app-frontend
```

### Check Deployment Status

```bash
# Get container info
az container show \
  --resource-group myResourceGroup \
  --name job-app-frontend

# View logs
az container logs \
  --resource-group myResourceGroup \
  --name job-app-frontend

# Get public IP
az container show \
  --resource-group myResourceGroup \
  --name job-app-frontend \
  --query ipAddress.fqdn
```

---

## Deploy to Azure App Service

### Create App Service Plan

```bash
az appservice plan create \
  --name myAppServicePlan \
  --resource-group myResourceGroup \
  --sku B1 \
  --is-linux
```

### Create Web App from Container

```bash
az webapp create \
  --resource-group myResourceGroup \
  --plan myAppServicePlan \
  --name job-app-frontend \
  --deployment-container-image-name myregistry.azurecr.io/team4-job-app-frontend:latest

# Configure container registry credentials
az webapp config container set \
  --name job-app-frontend \
  --resource-group myResourceGroup \
  --docker-custom-image-name myregistry.azurecr.io/team4-job-app-frontend:latest \
  --docker-registry-server-url https://myregistry.azurecr.io \
  --docker-registry-server-user <username> \
  --docker-registry-server-password <password>

# Configure environment variables
az webapp config appsettings set \
  --resource-group myResourceGroup \
  --name job-app-frontend \
  --settings \
    PORT=3000 \
    API_BASE_URL=http://backend-service:8080 \
    WEBSITE_PORT=3000
```

---

## Debugging

### View Container Logs

```bash
# Docker local
docker logs <container-id>
docker logs -f <container-id>  # Follow logs

# Azure ACI
az container logs \
  --resource-group myResourceGroup \
  --name job-app-frontend \
  --follow

# App Service
az webapp log tail \
  --name job-app-frontend \
  --resource-group myResourceGroup
```

### Execute Commands in Container

```bash
# Interactive shell
docker exec -it <container-id> sh

# Single command
docker exec <container-id> npm list
docker exec <container-id> node -v
```

### Health Check

The container includes a health check that runs every 30 seconds:

```bash
# View health status
docker ps  # Check STATUS column

# Health check details
docker inspect <container-id> | grep -A 5 Health
```

---

## Best Practices

### Security

- ✅ Always use specific version tags (not `latest` in production)
- ✅ Use non-root user (currently: `nodejs`)
- ✅ Minimize image size (multi-stage build)
- ✅ Regularly update base images
- ✅ Scan images for vulnerabilities:

```bash
az acr scan --registry myregistry --image team4-job-app-frontend:latest
```

### Performance

- ✅ Use alpine variants for smaller images
- ✅ Layer caching: order commands from least to most frequently changed
- ✅ Use `.dockerignore` to exclude unnecessary files
- ✅ Set appropriate resource limits

### Versioning

```bash
# Tag with semantic versioning
docker build -t myregistry.azurecr.io/team4-job-app-frontend:1.0.0 .
docker build -t myregistry.azurecr.io/team4-job-app-frontend:1.0 .
docker build -t myregistry.azurecr.io/team4-job-app-frontend:latest .

# Push all tags
docker push myregistry.azurecr.io/team4-job-app-frontend:1.0.0
docker push myregistry.azurecr.io/team4-job-app-frontend:1.0
docker push myregistry.azurecr.io/team4-job-app-frontend:latest
```

---

## Troubleshooting

### Build Issues

**Error: `npm ci fails during build`**
```bash
# Solution: Clear npm cache
docker build --no-cache -t team4-job-app-frontend .
```

**Error: `Cannot find module`**
```bash
# Solution: Ensure package-lock.json is in build context
git add package-lock.json
```

### Push Issues

**Error: `denied: requesting access to the resource is denied`**
```bash
# Solution: Login to ACR again
az acr login --name myregistry
```

**Error: `Target is invalid or doesn't exist`**
```bash
# Solution: Verify registry format
# Must be: myregistry.azurecr.io/image:tag
```

### Runtime Issues

**Application won't start:**
```bash
# Check logs
docker logs <container-id>

# Verify environment variables
docker inspect <container-id> | grep -i env
```

**Port already in use:**
```bash
# Use different host port
docker run -p 8080:3000 team4-job-app-frontend
```

---

## Next Steps

1. **Set up CI/CD**: Create GitHub Actions workflow for automated builds
2. **Monitor**: Set up Azure Application Insights for monitoring
3. **Scale**: Configure auto-scaling in App Service
4. **Security**: Enable managed identities and network security

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Azure Container Registry](https://docs.microsoft.com/en-us/azure/container-registry/)
- [Azure CLI Reference](https://docs.microsoft.com/en-us/cli/azure/reference-index)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

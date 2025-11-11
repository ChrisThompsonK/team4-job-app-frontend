#!/bin/bash

# Docker Build and Push Script for Azure Container Registry
# This script builds the Docker image and pushes it to Azure Container Registry (ACR)

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REGISTRY="${DOCKER_REGISTRY:-}"
IMAGE_NAME="${DOCKER_IMAGE:-team4-job-app-frontend}"
TAG="${DOCKER_TAG:-latest}"
DOCKERFILE="${DOCKERFILE:-Dockerfile}"
BUILD_CONTEXT="${BUILD_CONTEXT:-.}"

# Functions
print_error() {
    echo -e "${RED}❌ Error: $1${NC}"
    exit 1
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
    fi
    
    # Check Azure CLI
    if ! command -v az &> /dev/null; then
        print_error "Azure CLI is not installed. Please install Azure CLI first."
    fi
    
    print_success "Prerequisites check passed"
}

# Validate registry
validate_registry() {
    if [ -z "$REGISTRY" ]; then
        print_error "DOCKER_REGISTRY is not set. Please set it in .env or as an environment variable."
    fi
    
    if ! [[ "$REGISTRY" =~ ^[a-z0-9]+\.azurecr\.io$ ]]; then
        print_error "Invalid registry format. Expected format: myregistry.azurecr.io"
    fi
    
    print_success "Registry validation passed: $REGISTRY"
}

# Login to Azure ACR
login_to_acr() {
    print_info "Logging in to Azure Container Registry..."
    
    # Extract registry name from URL
    REGISTRY_NAME="${REGISTRY%%.*}"
    
    if ! az acr login --name "$REGISTRY_NAME"; then
        print_error "Failed to login to Azure Container Registry. Please check your Azure CLI credentials."
    fi
    
    print_success "Successfully logged in to $REGISTRY_NAME"
}

# Build Docker image
build_image() {
    local full_image_name="${REGISTRY}/${IMAGE_NAME}:${TAG}"
    
    print_info "Building Docker image: $full_image_name"
    print_info "Build context: $BUILD_CONTEXT"
    print_info "Dockerfile: $DOCKERFILE"
    
    if ! docker build -f "$DOCKERFILE" -t "$full_image_name" "$BUILD_CONTEXT"; then
        print_error "Failed to build Docker image"
    fi
    
    print_success "Docker image built successfully: $full_image_name"
}

# Push image to ACR
push_image() {
    local full_image_name="${REGISTRY}/${IMAGE_NAME}:${TAG}"
    
    print_info "Pushing image to Azure Container Registry..."
    print_info "Image: $full_image_name"
    
    if ! docker push "$full_image_name"; then
        print_error "Failed to push image to Azure Container Registry"
    fi
    
    print_success "Image pushed successfully: $full_image_name"
}

# Display summary
display_summary() {
    local full_image_name="${REGISTRY}/${IMAGE_NAME}:${TAG}"
    
    echo ""
    echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}📦 Docker Image Build & Push Complete${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "Registry:  ${YELLOW}$REGISTRY${NC}"
    echo -e "Image:     ${YELLOW}$full_image_name${NC}"
    echo -e "Tag:       ${YELLOW}$TAG${NC}"
    echo ""
    echo "To pull this image:"
    echo -e "  ${YELLOW}docker pull $full_image_name${NC}"
    echo ""
    echo "To run this image:"
    echo -e "  ${YELLOW}docker run -p 3000:3000 $full_image_name${NC}"
    echo ""
    echo "To deploy to Azure Container Instances:"
    echo -e "  ${YELLOW}az container create --resource-group <rg> --name <name> --image $full_image_name --cpu 1 --memory 1 --ports 3000 --registry-login-server $REGISTRY${NC}"
    echo ""
}

# Main execution
main() {
    print_info "Starting Docker build and push process..."
    echo ""
    
    # Load environment variables from .env if it exists
    if [ -f .env ]; then
        print_info "Loading environment variables from .env"
        # shellcheck source=/dev/null
        source .env
    fi
    
    # Validate inputs
    check_prerequisites
    validate_registry
    
    # Build and push
    login_to_acr
    build_image
    push_image
    
    # Display summary
    display_summary
    
    print_success "All done!"
}

# Run main function
main "$@"

environment         = "dev"
location            = "UK South"
resource_group_name = "team4-frontend-dev-rg"
app_name            = "team4-frontend"

tags = {
  managed_by = "terraform"
  project    = "team4-frontend"
  team       = "team4"
}

container_registry_name              = "aiacademy25"
container_registry_resource_group_name = "container-registry"

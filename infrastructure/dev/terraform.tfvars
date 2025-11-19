environment         = "dev"
location            = "UK South"
resource_group_name = "team4-frontend-dev-rg"
app_name            = "team4-frontend"
keyvault_name       = "team4-job-app-key-vault"
keyvault_resource_group_name = "team4-rg"
acr_name            = "aiacademy25"
acr_resource_group_name = "container-registry"

tags = {
  managed_by = "terraform"
  project    = "team4-frontend"
  team       = "team4"
}

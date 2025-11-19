environment         = "dev"
location            = "UK South"
resource_group_name = "team4-frontend-dev-rg"
app_name            = "team4-frontend"

# Azure Container Registry
acr_login_server    = "aiacademy25-bbaue6bgenhkd0dj.azurecr.io"
acr_name            = "aiacademy25"
acr_resource_group  = "aiacademy25-rg"

# Secrets - Set via environment variable: TF_VAR_session_secret
# session_secret = "your-secret-here"

tags = {
  managed_by = "terraform"
  project    = "team4-frontend"
  team       = "team4"
  environment = "dev"
}

# Data source to reference the backend Container App from backend infrastructure
data "azurerm_container_app" "backend" {
  name                = "ca-team4-backend-dev"
  resource_group_name = "team4-backend"
}

# Data source to reference the existing shared Container App Environment
data "azurerm_container_app_environment" "frontend" {
  name                = "team4-aca-env"
  resource_group_name = "team4-rg"
}

# Data source to reference the Azure Key Vault
data "azurerm_key_vault" "job_app_vault" {
  name                = "team4-job-app-kv"
  resource_group_name = "team4-rg"
}

# Data source to reference the SESSIONSECRET from Key Vault
data "azurerm_key_vault_secret" "session_secret" {
  name         = "SESSIONSECRET"
  key_vault_id = data.azurerm_key_vault.job_app_vault.id
}

resource "azurerm_container_app" "frontend" {
  name                         = "ca-${var.app_name}-${var.environment}"
  container_app_environment_id = data.azurerm_container_app_environment.frontend.id
  resource_group_name          = "team4-frontend"
  revision_mode                = "Single"

  depends_on = [
    data.azurerm_container_app.backend
  ]

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.job_app_frontend.id]
  }

  registry {
    server   = data.azurerm_container_registry.acr.login_server
    identity = azurerm_user_assigned_identity.job_app_frontend.id
  }

  secret {
    name                = "sessionsecret"
    key_vault_secret_id = data.azurerm_key_vault_secret.session_secret.id
    identity            = azurerm_user_assigned_identity.job_app_frontend.id
  }

  template {
    container {
      name   = "frontend"
      image  = "${data.azurerm_container_registry.acr.login_server}/team4-job-app-frontend:latest"
      cpu    = "0.5"
      memory = "1Gi"

      env {
        name  = "API_BASE_URL"
        value = "https://${data.azurerm_container_app.backend.latest_revision_fqdn}"
      }

      env {
        name        = "SESSIONSECRET"
        secret_name = "sessionsecret"
      }
    }
  }

  ingress {
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = 3000
    transport                  = "auto"

    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  tags = var.tags
}

output "frontend_url" {
  value = "https://${azurerm_container_app.frontend.ingress[0].fqdn}"
}

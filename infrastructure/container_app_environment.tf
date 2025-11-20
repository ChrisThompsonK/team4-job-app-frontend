# Data source to reference the backend Container App from backend infrastructure
data "azurerm_container_app" "backend" {
  name                = "ca-team4-backend-dev"
  resource_group_name = "team4-backend"
}

resource "azurerm_container_app_environment" "frontend" {
  name                       = "cae-${var.app_name}-${var.environment}"
  location                   = azurerm_resource_group.main.location
  resource_group_name        = "team4-frontend"
  log_analytics_workspace_id = azurerm_log_analytics_workspace.frontend.id
}

resource "azurerm_log_analytics_workspace" "frontend" {
  name                = "law-${var.app_name}-${var.environment}"
  location            = azurerm_resource_group.main.location
  resource_group_name = "team4-frontend"
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_container_app" "frontend" {
  name                         = "ca-${var.app_name}-${var.environment}"
  container_app_environment_id = azurerm_container_app_environment.frontend.id
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

  template {
    container {
      name   = "frontend"
      image  = "${data.azurerm_container_registry.acr.login_server}/job-app-frontend:latest"
      cpu    = "0.5"
      memory = "1Gi"

      env {
        name  = "API_BASE_URL"
        value = "https://${data.azurerm_container_app.backend.latest_revision_fqdn}"
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

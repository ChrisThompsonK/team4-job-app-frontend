terraform {
  required_version = ">= 1.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "terraform-state-mgmt"
    storage_account_name = "aistatemgmt"
    container_name       = "terraform-tfstate-ai"
    key                  = "team4-job-app-frontend.tfstate"
  }
}

provider "azurerm" {
  features {
    key_vault {
      purge_soft_delete_on_destroy    = true
      recover_soft_deleted_key_vaults = true
    }
  }
}

# Data source for current client configuration
data "azurerm_client_config" "current" {}

# Data source for existing ACR
data "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = var.acr_resource_group
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = "${var.app_name}-${var.environment}-rg"
  location = var.location
  tags     = var.tags
}

# Log Analytics Workspace for Container App Environment
resource "azurerm_log_analytics_workspace" "main" {
  name                = "${var.app_name}-${var.environment}-law"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
  tags                = var.tags
}

# Key Vault
resource "azurerm_key_vault" "main" {
  name                       = "${var.app_name}-${var.environment}-kv"
  location                   = azurerm_resource_group.main.location
  resource_group_name        = azurerm_resource_group.main.name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  enable_rbac_authorization  = true
  purge_protection_enabled   = false
  soft_delete_retention_days = 7
  tags                       = var.tags
}

# Key Vault Secret - Session Secret
resource "azurerm_key_vault_secret" "session_secret" {
  name         = "session-secret"
  value        = var.session_secret
  key_vault_id = azurerm_key_vault.main.id

  depends_on = [
    azurerm_role_assignment.terraform_kv_admin
  ]
}

# Role Assignment: Terraform Service Principal as Key Vault Administrator
resource "azurerm_role_assignment" "terraform_kv_admin" {
  scope                = azurerm_key_vault.main.id
  role_definition_name = "Key Vault Administrator"
  principal_id         = data.azurerm_client_config.current.object_id
}

# Container App Environment
resource "azurerm_container_app_environment" "main" {
  name                       = "${var.app_name}-${var.environment}-env"
  location                   = azurerm_resource_group.main.location
  resource_group_name        = azurerm_resource_group.main.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id
  tags                       = var.tags
}

# Frontend Container App
resource "azurerm_container_app" "frontend" {
  name                         = "${var.app_name}-${var.environment}-frontend"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"
  tags                         = var.tags

  identity {
    type = "SystemAssigned"
  }

  registry {
    server   = var.acr_login_server
    identity = "system"
  }

  secret {
    name  = "session-secret"
    value = var.session_secret
  }

  template {
    container {
      name   = "frontend"
      image  = "${var.acr_login_server}/team4-job-app-frontend:latest"
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name  = "PORT"
        value = "3000"
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      env {
        name        = "SESSION_SECRET"
        secret_name = "session-secret"
      }

      env {
        name  = "API_BASE_URL"
        value = "http://localhost:8080"
      }
    }

    min_replicas = 1
    max_replicas = 3
  }

  ingress {
    external_enabled = true
    target_port      = 3000
    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  depends_on = [
    azurerm_role_assignment.frontend_acr_pull,
    azurerm_role_assignment.frontend_kv_secrets
  ]
}

# Role Assignment: Frontend Container App - ACR Pull
resource "azurerm_role_assignment" "frontend_acr_pull" {
  scope                = data.azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_container_app.frontend.identity[0].principal_id
}

# Role Assignment: Frontend Container App - Key Vault Secrets User
resource "azurerm_role_assignment" "frontend_kv_secrets" {
  scope                = azurerm_key_vault.main.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_container_app.frontend.identity[0].principal_id
}

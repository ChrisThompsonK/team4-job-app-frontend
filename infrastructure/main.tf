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
  features {}
}

# User Assigned Managed Identity
resource "azurerm_user_assigned_identity" "frontend_identity" {
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  name                = "${var.app_name}-${var.environment}-identity"

  tags = var.tags
}

# Data source for Key Vault
data "azurerm_key_vault" "kv" {
  name                = var.keyvault_name
  resource_group_name = var.keyvault_resource_group_name
}

# Data source for Container Registry
data "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = var.acr_resource_group_name
}

# Role assignment for ACR pull access
resource "azurerm_role_assignment" "acr_pull" {
  scope              = data.azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id       = azurerm_user_assigned_identity.frontend_identity.principal_id
}

# Role assignment for Key Vault secrets access
resource "azurerm_role_assignment" "keyvault_secrets" {
  scope              = data.azurerm_key_vault.kv.id
  role_definition_name = "Key Vault Secrets Officer"
  principal_id       = azurerm_user_assigned_identity.frontend_identity.principal_id
}

# Output the managed identity details for use in deployments
output "managed_identity_id" {
  value       = azurerm_user_assigned_identity.frontend_identity.id
  description = "The ID of the user assigned managed identity"
}

output "managed_identity_principal_id" {
  value       = azurerm_user_assigned_identity.frontend_identity.principal_id
  description = "The principal ID of the user assigned managed identity"
}

output "managed_identity_client_id" {
  value       = azurerm_user_assigned_identity.frontend_identity.client_id
  description = "The client ID of the user assigned managed identity"
}

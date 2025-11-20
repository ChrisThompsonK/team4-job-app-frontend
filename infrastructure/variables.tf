variable "environment" {
  description = "Environment name (dev, prod)"
  type        = string
  default     = "dev"
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "UK South"
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "app_name" {
  description = "App name for resource naming"
  type        = string
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    managed_by = "terraform"
  }
}

variable "key_vault_name" {
  description = "Name of the existing Key Vault for secrets management"
  type        = string
  default     = "team4-job-app-key-vault"
}

variable "key_vault_resource_group_name" {
  description = "Resource group name where the Key Vault is located"
  type        = string
  default     = "team4-rg"
}

variable "container_registry_name" {
  description = "Name of the existing Azure Container Registry"
  type        = string
}

variable "container_registry_resource_group_name" {
  description = "Resource group name where the Container Registry is located"
  type        = string
}

resource "azurerm_resource_group" "main" {
  name     = "${var.app_name}-${var.environment}-rg"
  location = var.location
}

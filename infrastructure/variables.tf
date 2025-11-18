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

resource "azurerm_resource_group" "main" {
  name     = "${var.app_name}-${var.environment}-rg"
  location = var.location
}

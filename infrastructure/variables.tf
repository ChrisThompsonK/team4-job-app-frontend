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

variable "acr_login_server" {
  description = "Azure Container Registry login server"
  type        = string
  default     = "aiacademy25-bbaue6bgenhkd0dj.azurecr.io"
}

variable "acr_name" {
  description = "Azure Container Registry name"
  type        = string
  default     = "aiacademy25"
}

variable "acr_resource_group" {
  description = "Resource group containing the ACR"
  type        = string
  default     = "aiacademy25-rg"
}

variable "session_secret" {
  description = "Secret for Express session encryption"
  type        = string
  sensitive   = true
}

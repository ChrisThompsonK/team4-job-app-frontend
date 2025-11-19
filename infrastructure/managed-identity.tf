# Managed Identity for the Job App Frontend
# This resource enables the application to authenticate with Azure services
# without storing credentials in configuration files

resource "azurerm_user_assigned_identity" "job_app_frontend" {
  name                = "job-app-frontend-identity"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
}

# Output the managed identity details for reference
output "managed_identity_id" {
  value       = azurerm_user_assigned_identity.job_app_frontend.id
  description = "The ID of the managed identity"
}

output "managed_identity_principal_id" {
  value       = azurerm_user_assigned_identity.job_app_frontend.principal_id
  description = "The principal ID of the managed identity (used for role assignments)"
}

output "managed_identity_client_id" {
  value       = azurerm_user_assigned_identity.job_app_frontend.client_id
  description = "The client ID of the managed identity"
}

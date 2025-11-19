# Output the frontend application URL
output "frontend_fqdn" {
  description = "Fully qualified domain name of the frontend Container App"
  value       = "https://${azurerm_container_app.frontend.latest_revision_fqdn}"
}

output "frontend_url" {
  description = "Frontend application URL"
  value       = "https://${azurerm_container_app.frontend.latest_revision_fqdn}"
}

output "key_vault_uri" {
  description = "URI of the Key Vault"
  value       = azurerm_key_vault.main.vault_uri
}

output "container_app_environment_id" {
  description = "ID of the Container App Environment"
  value       = azurerm_container_app_environment.main.id
}

output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.main.name
}

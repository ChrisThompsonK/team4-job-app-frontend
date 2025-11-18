output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.main.name
}

output "container_registry_url" {
  description = "Container Registry login server"
  value       = azurerm_container_registry.main.login_server
}

output "app_url" {
  description = "App Service URL"
  value       = azurerm_linux_web_app.app.default_hostname
}

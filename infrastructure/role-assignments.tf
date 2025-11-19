# Role Assignments for Managed Identity
# Grants the managed identity access to required Azure resources

# Data source to reference the existing Key Vault
data "azurerm_key_vault" "job_app_kv" {
  name                = var.key_vault_name
  resource_group_name = var.key_vault_resource_group_name
}

# Assign "Key Vault Secrets User" role to the managed identity
# This allows the managed identity to read secrets from the Key Vault
resource "azurerm_role_assignment" "managed_identity_kv_secrets_user" {
  scope              = data.azurerm_key_vault.job_app_kv.id
  role_definition_name = "Key Vault Secrets User"
  principal_id       = azurerm_user_assigned_identity.job_app_frontend.principal_id
}

# Assign "Key Vault Reader" role to the managed identity
# This allows the managed identity to read metadata about secrets and keys
resource "azurerm_role_assignment" "managed_identity_kv_reader" {
  scope              = data.azurerm_key_vault.job_app_kv.id
  role_definition_name = "Key Vault Reader"
  principal_id       = azurerm_user_assigned_identity.job_app_frontend.principal_id
}

# Output the role assignments for reference
output "kv_secrets_user_role_assignment_id" {
  value       = azurerm_role_assignment.managed_identity_kv_secrets_user.id
  description = "Role assignment ID for Key Vault Secrets User"
}

output "kv_reader_role_assignment_id" {
  value       = azurerm_role_assignment.managed_identity_kv_reader.id
  description = "Role assignment ID for Key Vault Reader"
}

variable "project_id" {
  description = "The GCP Project ID"
  type        = string
  default     = "launch-490115"
}

variable "region" {
  description = "The GCP Region"
  type        = string
  default     = "us-central1"
}

variable "repository_name" {
  description = "Artifact Registry Repository Name"
  type        = string
  default     = "invoice-repo"
}

output "workload_identity_provider_name" {
  value = google_iam_workload_identity_pool_provider.github_provider.name
  description = "The full name of the Workload Identity Provider to be used in GitHub Actions"
}

output "service_account_email" {
  value = google_service_account.github_cd_invoice.email
}

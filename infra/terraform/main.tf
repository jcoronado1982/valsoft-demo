provider "google" {
  project = var.project_id
  region  = var.region
}

# Artifact Registry for Docker images
resource "google_artifact_registry_repository" "invoice_repo" {
  location      = var.region
  repository_id = var.repository_name
  description   = "Docker repository for Invoice monorepo"
  format        = "DOCKER"
}

# Service Account for GitHub Actions
resource "google_service_account" "github_cd_invoice" {
  account_id   = "github-cd-invoice"
  display_name = "GitHub CD Service Account"
}

# IAM Permissions
resource "google_project_iam_member" "run_admin" {
  project = var.project_id
  role    = "roles/run.admin"
  member  = "serviceAccount:${google_service_account.github_cd_invoice.email}"
}

resource "google_project_iam_member" "artifact_registry_admin" {
  project = var.project_id
  role    = "roles/artifactregistry.repoAdmin"
  member  = "serviceAccount:${google_service_account.github_cd_invoice.email}"
}

resource "google_project_iam_member" "sa_user" {
  project = var.project_id
  role    = "roles/iam.serviceAccountUser"
  member  = "serviceAccount:${google_service_account.github_cd_invoice.email}"
}

# network.tf
# Configuración de red para GCP

resource "google_compute_network" "secure_vpc" {
  name                    = "secure-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "secure_subnet" {
  name          = "secure-subnet"
  ip_cidr_range = "10.10.0.0/24"
  region        = var.region
  network       = google_compute_network.secure_vpc.id
}


# vm_ubuntu_gateway.tf
# Definición de la VM Ubuntu Gateway

resource "google_compute_instance" "ubuntu_gateway" {
  name         = "ubuntu-gateway"
  machine_type = "e2-medium"
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = "ubuntu-2204-jammy-v20240614"
      size  = 40
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.secure_subnet.id

    # Sin IP pública → Zero Trust
  }

  metadata_startup_script = file("${path.module}/../../scripts/bootstrap_ubuntu_gateway.sh")

  tags = ["zero-trust-gateway"]
}

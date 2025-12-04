
# vm_pomerium_proxy.tf
# VM2 - Pomerium Proxy Server Configuration

resource "google_compute_instance" "pomerium_proxy" {
  name         = "pomerium-proxy-vm2"
  machine_type = "e2-medium"
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = "ubuntu-2204-jammy-v20240614"
      size  = 40
      type  = "pd-standard"
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.secure_subnet.id

    # No public IP - Zero Trust architecture
    # Access only through Netbird mesh network
  }

  # Bootstrap script for Pomerium + Netbird setup
  metadata_startup_script = file("${path.module}/../../scripts/bootstrap_vm2_pomerium.sh")

  # Service account for GCP API access if needed
  service_account {
    scopes = ["cloud-platform"]
  }

  # Tags for firewall rules
  tags = ["pomerium-proxy", "netbird-peer", "zero-trust"]

  # Allow stopping for maintenance
  allow_stopping_for_update = true

  # Labels for organization
  labels = {
    environment = "production"
    service     = "pomerium"
    managed_by  = "terraform"
    role        = "proxy"
  }
}

# Output the internal IP for reference
output "pomerium_proxy_internal_ip" {
  description = "Internal IP of Pomerium proxy VM2"
  value       = google_compute_instance.pomerium_proxy.network_interface[0].network_ip
}

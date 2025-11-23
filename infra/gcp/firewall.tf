# firewall.tf
# Configuración de reglas de firewall

resource "google_compute_firewall" "deny_all_ingress" {
  name    = "deny-all-ingress"
  network = google_compute_network.secure_vpc.name

  deny {
    protocol = "all"
  }

  priority  = 65534
  direction = "INGRESS"
}

resource "google_compute_firewall" "allow_iap_ssh" {
  name    = "allow-iap-ssh"
  network = google_compute_network.secure_vpc.name

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = ["35.235.240.0/20"]
  direction     = "INGRESS"
}

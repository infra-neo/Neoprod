resource "google_compute_firewall" "deny_all_ingress" {
  name    = "deny-all-ingress"
  network = google_compute_network.secure_vpc.name

  deny {
    protocol = "all"
  }

  priority      = 65534
  direction     = "INGRESS"
  source_ranges = ["0.0.0.0/0"]
}

resource "google_compute_firewall" "allow_iap_ssh" {
  name    = "allow-iap-ssh"
  network = google_compute_network.secure_vpc.name

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = ["35.235.240.0/20"] # Identity-Aware Proxy (IAP)
  direction     = "INGRESS"
  priority      = 1000
}

# Allow internal VPC communication for essential services
resource "google_compute_firewall" "allow_internal" {
  name    = "allow-internal-vpc"
  network = google_compute_network.secure_vpc.name

  # Allow HTTPS and HTTP for web services
  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }

  # Allow common service ports
  allow {
    protocol = "tcp"
    ports    = ["8080", "8443", "3000", "5432"]
  }

  # Allow DNS
  allow {
    protocol = "udp"
    ports    = ["53"]
  }

  # Allow ICMP for connectivity testing
  allow {
    protocol = "icmp"
  }

  source_ranges = ["10.10.0.0/24"] # Internal VPC subnet
  direction     = "INGRESS"
  priority      = 1000
}

# Allow Netbird WireGuard traffic
resource "google_compute_firewall" "allow_netbird_wireguard" {
  name        = "allow-netbird-wireguard"
  network     = google_compute_network.secure_vpc.name
  target_tags = ["netbird-peer"]

  allow {
    protocol = "udp"
    ports    = ["51820"]
  }

  # Allow from anywhere for WireGuard (encrypted tunnel)
  source_ranges = ["0.0.0.0/0"]
  direction     = "INGRESS"
  priority      = 1000
}

# Allow Netbird management traffic (only from VM1 to peers)
resource "google_compute_firewall" "allow_netbird_management" {
  name        = "allow-netbird-management"
  network     = google_compute_network.secure_vpc.name
  target_tags = ["netbird-peer"]

  allow {
    protocol = "tcp"
    ports    = ["8080", "80", "443"]
  }

  source_tags = ["zero-trust-gateway"]
  direction   = "INGRESS"
  priority    = 1000
}

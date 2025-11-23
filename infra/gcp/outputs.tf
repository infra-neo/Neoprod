# outputs.tf
# Definición de salidas de Terraform


output "ubuntu_gateway_ip" {
  value = google_compute_instance.ubuntu_gateway.network_interface[0].network_ip
}

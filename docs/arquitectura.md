# Arquitectura

Descripción de la arquitectura del proyecto.

flowchart TD
A[Cliente Final\nLaptop/PC] -->|Firezone Client| B[ZT Gateway - Ubuntu]

subgraph GCP Secure VPC
  B --> C[Traefik\nForwardAuth]
  C --> D[Authentik\nSSO+MFA]
  B --> E[Netbird Coordinator]
end

E --> F[Windows TSplus Local]

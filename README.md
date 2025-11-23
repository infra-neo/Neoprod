# Neoprod
Repositorio para Secure Access TSPlus
# Neoprod — Zero Trust Remote Access Platform  
**Firezone + Netbird + Authentik + TSplus + GCP + Terraform + GitHub Actions**

Este repositorio contiene la infraestructura, documentación y automatización de la plataforma **Neoprod**, diseñada para ofrecer acceso seguro a escritorios Windows y aplicaciones remotas usando **Zero Trust**, sin exponer puertos, con MFA, SSO, túneles cifrados y flujo operativo seguro.

---

# 📌 Objetivo

Proveer acceso remoto a un servidor Windows con **TSplus Remote Access**, protegido mediante:

- 🔐 **Zero Trust Access (Firezone ZTA Gateway)**
- 🔐 **Overlay Mesh cifrado (Netbird)**
- 🔐 **Autenticación SSO + MFA (Authentik)**
- 🔐 **Reverse Proxy seguro (Traefik + Authentik ForwardAuth)**
- 🌐 **Infraestructura privada en GCP (sin IPs públicas)**
- ⚙️ **Despliegue automatizado con Terraform desde GitHub Actions**

Todo corriendo en **una capa segura dentro de una VPC privada**, sin exponer RDP, TSplus, ni ningún servicio al internet público.

---

# 🧱 Arquitectura

## 🔐 Diagrama Zero Trust (Mermaid / GitHub compatible)

```mermaid
flowchart TD

A[Usuario Final\nLaptop / Windows] -->|Firezone Client| B[Firezone ZTA Gateway]

subgraph GCP ["GCP - Red Privada Cero Exposición"]
    B --> C[Traefik Reverse Proxy\n(Authentik ForwardAuth)]
    C --> D[Authentik\nSSO + MFA + Roles]
    C --> E[Netbird Coordinator\nOverlay Secure Mesh]
    C --> F[Windows TSplus Server\nRDP/HTML5 - Solo red interna]
end

E --> F

H[Soporte / Admin] -->|ZT Client| B

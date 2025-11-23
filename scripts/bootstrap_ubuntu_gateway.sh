#!/bin/bash
# Script de bootstrap para Ubuntu Gateway

#!/bin/bash
set -e

apt update -y
apt install -y ca-certificates curl gnupg lsb-release

# Docker
curl -fsSL https://get.docker.com | bash
systemctl enable docker
docker swarm init

# Postgres (Docker)
docker run -d \
  --name postgres \
  --restart unless-stopped \
  -e POSTGRES_PASSWORD=neoprodpass \
  -e POSTGRES_USER=neoprod \
  -e POSTGRES_DB=authentik \
  -p 5432:5432 \
  -v /opt/postgres/data:/var/lib/postgresql/data \
  postgres:15

# Traefik
docker network create traefik-net
docker run -d --name traefik \
  --restart unless-stopped \
  -p 8080:8080 \
  -p 80:80 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --network traefik-net \
  traefik:v2.10 \
  --api.insecure=true \
  --providers.docker=true

# Authentik
docker run -d --name authentik \
  --restart unless-stopped \
  --network traefik-net \
  -e AUTHENTIK_SECRET_KEY=$(openssl rand -hex 32) \
  -e AUTHENTIK_POSTGRESQL_HOST=postgres \
  -e AUTHENTIK_POSTGRESQL_USER=neoprod \
  -e AUTHENTIK_POSTGRESQL_PASSWORD=neoprodpass \
  -e AUTHENTIK_POSTGRESQL_DB=authentik \
  ghcr.io/goauthentik/server:latest

# Firezone
curl -fsSL https://github.com/firezone/firezone/releases/latest/download/install.sh | bash

# Netbird
curl -fsSL https://github.com/netbirdio/netbird/releases/latest/download/install.sh | bash

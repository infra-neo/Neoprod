#!/bin/bash
# Script para mapear puertos de contenedores Docker a localhost para pruebas

echo "🐳 Mapeando puertos de aplicaciones Docker..."
echo ""

# Detener contenedores si están corriendo sin puertos mapeados
echo "Verificando contenedores actuales..."
docker ps --format "table {{.Names}}\t{{.Ports}}" | grep test-

echo ""
echo "Deteniendo contenedores para remapear puertos..."
docker stop test-app1 test-app2 test-whoami test-filebrowser test-code-server test-grafana test-portainer test-uptime-kuma test-wekan test-drawio 2>/dev/null

echo ""
echo "Iniciando contenedores con puertos mapeados..."

# App 1 - Echo Server
docker run -d --name test-app1-mapped \
  --network pomerium-network \
  -p 8080:8080 \
  -e HTTP_PORT=8080 \
  -e LOG_WITHOUT_NEWLINE=true \
  mendhak/http-https-echo:latest

# App 2 - Nginx
docker run -d --name test-app2-mapped \
  --network pomerium-network \
  -p 8081:80 \
  nginx:alpine

# Whoami
docker run -d --name test-whoami-mapped \
  --network pomerium-network \
  -p 8082:80 \
  traefik/whoami:latest

# File Browser
docker run -d --name test-filebrowser-mapped \
  --network pomerium-network \
  -p 8083:80 \
  -v /tmp/files:/srv \
  filebrowser/filebrowser:latest

# Code Server
docker run -d --name test-code-server-mapped \
  --network pomerium-network \
  -p 8084:8080 \
  -e PASSWORD=changeme \
  -v /tmp/code-workspace:/home/coder/project \
  codercom/code-server:latest

# Grafana
docker run -d --name test-grafana-mapped \
  --network pomerium-network \
  -p 8085:3000 \
  -e GF_AUTH_DISABLE_LOGIN_FORM=true \
  -e GF_AUTH_ANONYMOUS_ENABLED=true \
  -e GF_AUTH_ANONYMOUS_ORG_ROLE=Admin \
  grafana/grafana:latest

# Portainer
docker run -d --name test-portainer-mapped \
  --network pomerium-network \
  -p 8086:9000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer-data:/data \
  portainer/portainer-ce:latest

# Uptime Kuma
docker run -d --name test-uptime-kuma-mapped \
  --network pomerium-network \
  -p 8087:3001 \
  -v uptime-kuma-data:/app/data \
  louislam/uptime-kuma:latest

# Wekan (requiere MongoDB)
docker run -d --name test-wekan-mapped \
  --network pomerium-network \
  -p 8088:8080 \
  -e MONGO_URL=mongodb://test-wekan-db:27017/wekan \
  -e ROOT_URL=http://localhost:8088 \
  wekanteam/wekan:latest

# Draw.io
docker run -d --name test-drawio-mapped \
  --network pomerium-network \
  -p 8089:8080 \
  jgraph/drawio:latest

echo ""
echo "✅ Contenedores iniciados con puertos mapeados:"
echo ""
echo "📡 Echo Server:       http://localhost:8080"
echo "🌐 Static Site:       http://localhost:8081"
echo "🔍 Whoami:            http://localhost:8082"
echo "📁 File Browser:      http://localhost:8083 (user: admin, pass: admin)"
echo "💻 VS Code:           http://localhost:8084 (password: changeme)"
echo "📊 Grafana:           http://localhost:8085"
echo "🐳 Portainer:         http://localhost:8086"
echo "📈 Uptime Kuma:       http://localhost:8087"
echo "📋 Wekan:             http://localhost:8088"
echo "✏️  Draw.io:           http://localhost:8089"
echo ""
echo "🚀 Backend API:       http://localhost:3001"
echo "🎨 Frontend:          http://localhost:3000"
echo ""
echo "Para verificar el estado:"
echo "docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'"

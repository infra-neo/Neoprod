#!/bin/bash

# Script para iniciar todas las aplicaciones de prueba
# Autor: Neogenesys
# Fecha: Diciembre 2025

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 Iniciando aplicaciones de prueba..."
echo ""

# Crear directorios necesarios
echo "📁 Creando directorios..."
mkdir -p app2 files code-workspace

# Inicializar Guacamole DB si es necesario
if [ ! -f "guacamole-initdb.sql" ]; then
    echo "🔧 Inicializando base de datos de Guacamole..."
    if command -v docker >/dev/null 2>&1; then
        docker run --rm guacamole/guacamole /opt/guacamole/bin/initdb.sh --postgresql > guacamole-initdb.sql
        echo "✓ Schema de Guacamole generado"
    else
        echo "⚠️  Docker no disponible. Descarga guacamole-initdb.sql manualmente."
    fi
fi

# Crear página HTML de ejemplo para app2 si no existe
if [ ! -f "app2/index.html" ]; then
    echo "📝 Creando página de ejemplo para App 2..."
    cat > app2/index.html << 'EOF'
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>App 2 - Neogenesys</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .container {
            text-align: center;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }
        h1 { font-size: 3rem; margin-bottom: 1rem; }
        p { font-size: 1.2rem; opacity: 0.9; }
        .badge {
            display: inline-block;
            padding: 0.5rem 1rem;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50px;
            margin-top: 1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌐 App 2 - Static Site</h1>
        <p>Aplicación de prueba con Nginx</p>
        <div class="badge">Zero Trust Protected</div>
        <p style="margin-top: 2rem; font-size: 0.9rem;">
            Grupo requerido: app2-users
        </p>
    </div>
</body>
</html>
EOF
fi

# Iniciar Docker Compose
echo ""
echo "🐳 Iniciando contenedores..."
docker-compose up -d

echo ""
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

# Verificar estado
echo ""
echo "📊 Estado de los contenedores:"
docker-compose ps

echo ""
echo "✅ ¡Aplicaciones iniciadas!"
echo ""
echo "🔗 URLs disponibles (localhost):"
echo "   • App 1 (Echo):     http://localhost:8080"
echo "   • App 2 (Static):   http://localhost:8081"
echo "   • Whoami:           http://localhost:8082"
echo "   • File Browser:     http://localhost:8083"
echo "   • Code Server:      http://localhost:8084"
echo "   • Grafana:          http://localhost:8085"
echo "   • Portainer:        http://localhost:8086"
echo "   • Uptime Kuma:      http://localhost:8087"
echo "   • Wekan:            http://localhost:8088"
echo "   • Draw.io:          http://localhost:8089"
echo ""
echo "🖥️  Acceso Remoto HTML5:"
echo "   • Guacamole:        http://localhost:8090"
echo "     User: guacadmin / Pass: guacadmin"
echo "   • Ubuntu Desktop:   http://localhost:8091"
echo "     VNC Password: neogenesys"
echo "   • Windows (Wine):   http://localhost:8092"
echo "     VNC Password: neogenesys"
echo ""
echo "💡 Para ver logs: docker-compose logs -f [servicio]"
echo "💡 Para detener: docker-compose down"
echo ""

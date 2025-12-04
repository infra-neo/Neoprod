#!/bin/bash
# Script para inicializar la base de datos de Guacamole

set -e

echo "Descargando script de inicialización de Guacamole..."

# Descargar el schema SQL oficial de Guacamole
docker run --rm guacamole/guacamole /opt/guacamole/bin/initdb.sh --postgresql > /tmp/guacamole-initdb.sql

echo "Schema de base de datos generado en /tmp/guacamole-initdb.sql"
echo "Copiando a directorio actual..."

cp /tmp/guacamole-initdb.sql ./guacamole-initdb.sql

echo "✅ Listo. Ahora puedes ejecutar docker-compose up -d"

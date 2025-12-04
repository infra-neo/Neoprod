# Guía Rápida de Configuración Pomerium + Zitadel + Netbird

Esta guía proporciona los pasos necesarios para implementar la configuración Zero Trust con Pomerium, Zitadel y Netbird.

## Pre-requisitos

- VM1 con Zitadel en https://gate.kappa4.com (ya configurado)
- VM1 con Netbird Management Server (ya configurado)
- VM2 nueva para Pomerium (será creada)
- Acceso a GCP con Terraform
- Cliente Netbird en tu laptop

## Paso 1: Desplegar VM2 con Terraform

```bash
cd infra/gcp

# Configurar variables
cp terraform.tfvars.template terraform.tfvars
nano terraform.tfvars

# Aplicar infraestructura
terraform init
terraform plan
terraform apply
```

Esto creará:
- VM2 con Pomerium
- Reglas de firewall para Netbird
- Configuración de red interna

## Paso 2: Configurar Zitadel (VM1)

### 2.1 Crear Aplicación OIDC

1. Acceder a https://gate.kappa4.com
2. Ir a **Applications** → **New**
3. Configurar:
   ```
   Nombre: Pomerium
   Tipo: Web Application
   Método de autenticación: POST
   ```

4. **Redirect URIs**:
   ```
   https://authenticate.pomerium.local/oauth2/callback
   https://dashboard.pomerium.local/oauth2/callback
   ```

5. **Post Logout URIs**:
   ```
   https://authenticate.pomerium.local/
   ```

6. **Grant Types**: Authorization Code
7. **Response Types**: Code
8. **Scopes**: openid, profile, email, groups

9. Guardar y anotar:
   - Client ID
   - Client Secret

### 2.2 Crear Grupos de Usuario

Crear los siguientes grupos en Zitadel:

```
pomerium-users     # Acceso básico al dashboard
app1-users         # Acceso a App1
app2-users         # Acceso a App2
admin              # Acceso administrativo
```

### 2.3 Asignar Usuarios a Grupos

Asignar usuarios existentes a los grupos según sus permisos.

## Paso 3: Configurar Netbird

### 3.1 Generar Setup Key

En el dashboard de Netbird (VM1):
1. Ir a **Setup Keys**
2. Crear nuevo setup key
3. Configurar:
   - Name: VM2-Pomerium
   - Type: Reusable
   - Expiration: 30 días
   - Auto Groups: pomerium-servers

4. Copiar el setup key generado

### 3.2 Conectar VM2 a Netbird

SSH a VM2:
```bash
gcloud compute ssh pomerium-proxy-vm2 --zone us-central1-a
```

Conectar a Netbird:
```bash
sudo netbird up --setup-key <SETUP_KEY_DE_VM1>
```

Verificar conexión:
```bash
netbird status
# Debe mostrar: Status: Connected

# Obtener IP de Netbird de VM2
ip addr show wt0
# Anotar la IP, ejemplo: 100.64.0.2
```

### 3.3 Configurar ACLs en Netbird

En el dashboard de Netbird, configurar políticas:
1. Permitir grupo `usuarios` → grupo `pomerium-servers` (VM2)
2. Puerto 443 (HTTPS)
3. Puerto 80 (HTTP)

## Paso 4: Configurar DNS

### Opción A: Netbird Magic DNS (Recomendado)

En Netbird dashboard:
1. Activar Magic DNS
2. Agregar entradas:
   ```
   authenticate.pomerium.local → <IP_NETBIRD_VM2>
   dashboard.pomerium.local → <IP_NETBIRD_VM2>
   *.pomerium.local → <IP_NETBIRD_VM2>
   ```

### Opción B: Hosts local (alternativa)

En tu laptop, editar `/etc/hosts` (Linux/Mac) o `C:\Windows\System32\drivers\etc\hosts` (Windows):
```
100.64.0.2  authenticate.pomerium.local
100.64.0.2  dashboard.pomerium.local
100.64.0.2  app1.pomerium.local
100.64.0.2  app2.pomerium.local
100.64.0.2  admin.pomerium.local
```

Reemplazar `100.64.0.2` con la IP real de Netbird de VM2.

## Paso 5: Configurar Pomerium en VM2

### 5.1 Copiar archivos de configuración

Desde tu máquina local:
```bash
# Copiar docker-compose.yml
gcloud compute scp configs/pomerium/docker-compose.yml \
  pomerium-proxy-vm2:/tmp/ --zone us-central1-a

# Copiar config.yaml
gcloud compute scp configs/pomerium/config.yaml \
  pomerium-proxy-vm2:/tmp/ --zone us-central1-a
```

En VM2:
```bash
sudo mv /tmp/docker-compose.yml /opt/pomerium/
sudo mv /tmp/config.yaml /opt/pomerium/config/
```

### 5.2 Configurar variables de entorno

En VM2:
```bash
sudo nano /opt/pomerium/.env
```

Actualizar con tus valores de Zitadel:
```bash
ZITADEL_CLIENT_ID=<client-id-de-zitadel>
ZITADEL_CLIENT_SECRET=<client-secret-de-zitadel>

# Los siguientes ya fueron generados por el script bootstrap
# POMERIUM_SIGNING_KEY=...
# POMERIUM_COOKIE_SECRET=...
# POMERIUM_SHARED_SECRET=...
```

Guardar y cerrar.

### 5.3 Iniciar Pomerium

```bash
sudo systemctl start pomerium
```

Verificar:
```bash
docker ps
# Debe mostrar contenedor pomerium corriendo

# Ver logs
sudo /opt/pomerium/logs.sh
```

## Paso 6: Configurar Cliente (Tu Laptop)

### 6.1 Instalar Netbird

**Linux:**
```bash
curl -fsSL https://pkgs.netbird.io/install.sh | sh
```

**macOS:**
```bash
brew install netbirdio/tap/netbird
```

**Windows:**
Descargar instalador desde https://netbird.io/downloads

### 6.2 Conectar a Netbird

Obtener setup key para usuarios desde dashboard de Netbird (VM1).

```bash
netbird up --setup-key <SETUP_KEY_USUARIOS>
```

Verificar conexión:
```bash
netbird status
# Debe mostrar: Status: Connected

# Verificar conectividad con VM2
ping 100.64.0.2
# (reemplazar con IP real de VM2)
```

## Paso 7: Probar Acceso

### 7.1 Acceder al Dashboard

1. Abrir navegador
2. Ir a: `https://dashboard.pomerium.local`
3. Serás redirigido a Zitadel login
4. Ingresar email y password
5. Completar MFA
6. Serás redirigido al dashboard de Pomerium
7. Verás las aplicaciones a las que tienes acceso (según tus grupos)

### 7.2 Verificar Logs

En VM2:
```bash
sudo /opt/pomerium/logs.sh
```

Debes ver:
- Conexión OIDC exitosa
- Token validation successful
- Policy evaluation logs

## Paso 8: Agregar Aplicaciones

### 8.1 Editar configuración

En VM2:
```bash
sudo nano /opt/pomerium/config/config.yaml
```

Agregar nueva ruta:
```yaml
routes:
  - from: https://miapp.pomerium.local
    to: http://backend-miapp.internal:8080
    pass_identity_headers: true
    set_request_headers:
      X-Pomerium-Claim-Email: "${pomerium.email}"
      X-Pomerium-Claim-Groups: "${pomerium.groups}"
    policy:
      - allow:
          groups:
            is: miapp-users
    show_in_routes_portal: true
```

### 8.2 Reiniciar Pomerium

```bash
sudo /opt/pomerium/restart.sh
```

### 8.3 Actualizar DNS

Agregar entrada DNS para `miapp.pomerium.local` → `<IP_VM2>`

### 8.4 Probar acceso

Navegar a `https://miapp.pomerium.local` desde tu navegador.

## Troubleshooting

### No puedo acceder al dashboard

1. **Verificar Netbird**:
   ```bash
   netbird status
   ping 100.64.0.2
   ```

2. **Verificar DNS**:
   ```bash
   nslookup dashboard.pomerium.local
   # o
   ping dashboard.pomerium.local
   ```

3. **Verificar Pomerium**:
   ```bash
   # En VM2
   docker ps
   sudo /opt/pomerium/logs.sh
   ```

### Error de autenticación

1. Verificar configuración de Zitadel:
   - Redirect URIs correctas
   - Client ID y Secret correctos en .env

2. Ver logs de Pomerium:
   ```bash
   sudo /opt/pomerium/logs.sh | grep -i oidc
   ```

### "Access Denied" al acceder a app

1. Verificar que el usuario esté en el grupo requerido en Zitadel
2. Ver logs de evaluación de política:
   ```bash
   sudo /opt/pomerium/logs.sh | grep -i policy
   ```

3. Verificar configuración de política en config.yaml

### Certificado SSL inválido

Si usas certificados auto-firmados, el navegador mostrará advertencia de seguridad.

**Para testing**, puedes:
- Aceptar riesgo en navegador
- Instalar certificado en store del sistema

**Para producción**:
- Usar Let's Encrypt
- Usar CA interna de la organización

## Siguiente Pasos

1. **Configurar aplicaciones backend**: Conectar tus apps a la red Netbird
2. **Agregar más rutas**: Configurar acceso a todas tus aplicaciones
3. **Refinar políticas**: Ajustar permisos por grupo/rol
4. **Configurar certificados**: Usar certificados válidos para producción
5. **Monitoreo**: Configurar logs y métricas
6. **Backup**: Backup de configuración y secrets

## Recursos

- [Documentación completa](../docs/pomerium-zitadel-integration.md)
- [Configuración de Pomerium](../configs/pomerium/README.md)
- [Pomerium Docs](https://www.pomerium.com/docs/)
- [Zitadel Docs](https://zitadel.com/docs/)
- [Netbird Docs](https://netbird.io/docs/)

## Soporte

Para problemas o preguntas, revisar los logs y documentación completa en `/docs/pomerium-zitadel-integration.md`.

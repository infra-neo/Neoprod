# 🖥️ Acceso Remoto HTML5 - Guacamole + Escritorios Remotos

## 📋 Descripción

Sistema completo de acceso remoto basado en web usando Apache Guacamole, Ubuntu Desktop y Wine Desktop.

---

## 🚀 Componentes

### 1. Apache Guacamole (Puerto 8090)
Gateway de acceso remoto HTML5 que permite conectar a:
- Servidores RDP (Windows)
- Servidores VNC (Linux)
- Servidores SSH
- Kubernetes

**Características:**
- ✅ Acceso desde navegador (sin cliente)
- ✅ Copiar/pegar entre máquinas
- ✅ Transferencia de archivos
- ✅ Grabación de sesiones
- ✅ Multi-usuario con permisos

### 2. Ubuntu Desktop (Puerto 8091)
Escritorio Linux completo accesible desde navegador.

**Características:**
- ✅ LXDE Desktop Environment
- ✅ noVNC integrado
- ✅ Resolución ajustable
- ✅ Persistencia de datos

### 3. Wine Desktop (Puerto 8092)
Entorno Linux con Wine para ejecutar aplicaciones Windows.

**Características:**
- ✅ Wine preinstalado
- ✅ Soporte para apps Windows
- ✅ noVNC integrado
- ✅ Branding Neogenesys

---

## 🔧 Instalación

### Inicializar Guacamole

```bash
cd /workspaces/Neoprod/configs/test-apps

# Generar schema de base de datos
chmod +x init-guacamole.sh
./init-guacamole.sh
```

### Iniciar todos los servicios

```bash
./start-apps.sh
```

O manualmente:

```bash
docker-compose up -d
```

---

## 🔐 Credenciales por Defecto

### Guacamole
- **URL**: http://localhost:8090
- **Usuario**: `guacadmin`
- **Password**: `guacadmin`

⚠️ **IMPORTANTE**: Cambiar credenciales en producción

### Ubuntu Desktop
- **URL**: http://localhost:8091
- **VNC Password**: `neogenesys`

### Wine Desktop
- **URL**: http://localhost:8092
- **VNC Password**: `neogenesys`

---

## 📖 Uso de Guacamole

### Primera configuración

1. Acceder a http://localhost:8090
2. Login con `guacadmin` / `guacadmin`
3. Ir a **Settings** → **Connections**
4. Click en **New Connection**

### Agregar conexión RDP (Windows)

```yaml
Name: Windows Server
Protocol: RDP
Hostname: IP_DEL_SERVIDOR
Port: 3389
Username: administrator
Password: ********
Security mode: Any
Ignore server certificate: Checked
```

### Agregar conexión VNC (Linux)

```yaml
Name: Linux Desktop
Protocol: VNC
Hostname: ubuntu-desktop
Port: 5900
Password: neogenesys
```

### Agregar conexión SSH

```yaml
Name: SSH Server
Protocol: SSH
Hostname: IP_DEL_SERVIDOR
Port: 22
Username: usuario
Password: ********
# O usar clave privada
Private key: (pegar contenido de id_rsa)
```

---

## 🎨 Personalización con Branding Neogenesys

### Ubuntu Desktop

Los archivos de branding están en:
```
configs/test-apps/wine-desktop/branding/
├── logo.png
├── logo.svg
├── wallpaper.jpg
└── theme.conf
```

Para aplicar:

```bash
cd configs/test-apps
docker-compose build wine-desktop
docker-compose up -d wine-desktop
```

### Personalizar Guacamole

Crear tema personalizado:

```bash
# Crear directorio de extensiones
mkdir -p guacamole-extensions

# Descargar tema personalizado
wget https://github.com/your-org/guacamole-theme/releases/download/v1.0/neogenesys-theme.jar \
  -O guacamole-extensions/neogenesys-theme.jar
```

Actualizar docker-compose.yml:

```yaml
guacamole:
  volumes:
    - ./guacamole-extensions:/opt/guacamole/extensions:ro
```

---

## 🔌 Integración con Pomerium

### Configurar ruta en Pomerium

Editar `configs/pomerium/config.yaml`:

```yaml
routes:
  - from: https://remote.pomerium.local
    to: http://guacamole:8080
    pass_identity_headers: true
    policy:
      - allow:
          groups:
            or:
              - remote-access
              - admin
    set_request_headers:
      X-Forwarded-User: "${pomerium.email}"
      X-Forwarded-Groups: "${pomerium.groups}"
```

### Autenticación SSO con Guacamole

Instalar extensión OIDC para Guacamole:

```bash
# Descargar extensión
wget https://apache.org/dyn/closer.lua/guacamole/1.5.0/binary/guacamole-auth-sso-1.5.0.tar.gz

# Extraer y copiar
tar -xzf guacamole-auth-sso-1.5.0.tar.gz
cp guacamole-auth-sso-1.5.0/openid/*.jar guacamole-extensions/
```

Configurar en docker-compose.yml:

```yaml
guacamole:
  environment:
    OPENID_AUTHORIZATION_ENDPOINT: https://gate.kappa4.com/oauth/v2/authorize
    OPENID_JWKS_ENDPOINT: https://gate.kappa4.com/.well-known/jwks.json
    OPENID_ISSUER: https://gate.kappa4.com
    OPENID_CLIENT_ID: tu_client_id
    OPENID_REDIRECT_URI: https://remote.pomerium.local
```

---

## 🌐 Acceso desde Dashboard

El dashboard ya incluye tarjetas para acceso remoto:

- **Grupo requerido**: `remote-access` o `admin`
- **Ubicación**: `/dashboard` (sección "Acceso Remoto")

```typescript
{(user.groups.includes('remote-access') || user.groups.includes('admin')) && (
  <Card onClick={() => window.open('http://localhost:8090', '_blank')}>
    <h3>Guacamole Remote</h3>
    <p>Gateway de acceso remoto HTML5</p>
  </Card>
)}
```

---

## 📊 Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                   User Browser                       │
└────────────────────┬────────────────────────────────┘
                     │
                     │ HTTPS
                     │
┌────────────────────▼────────────────────────────────┐
│                  Pomerium Proxy                      │
│          (Zero Trust Authentication)                 │
└────────────────────┬────────────────────────────────┘
                     │
       ┌─────────────┼─────────────┐
       │             │             │
       │             │             │
┌──────▼──────┐ ┌───▼────┐ ┌─────▼──────┐
│  Guacamole  │ │ Ubuntu │ │    Wine    │
│   Gateway   │ │Desktop │ │  Desktop   │
│   :8090     │ │ :8091  │ │   :8092    │
└──────┬──────┘ └────────┘ └────────────┘
       │
       │
       │ RDP/VNC/SSH
       │
┌──────▼──────────────────────────────────┐
│  Backend Servers                        │
│  • Windows Servers (RDP)                │
│  • Linux Servers (VNC/SSH)              │
│  • Kubernetes (SSH)                     │
└─────────────────────────────────────────┘
```

---

## 🔒 Seguridad

### Recomendaciones

1. **Cambiar contraseñas por defecto**
   ```sql
   -- En Guacamole DB
   UPDATE guacamole_user 
   SET password_hash = SHA2('nueva_password', 256) 
   WHERE username = 'guacadmin';
   ```

2. **Usar certificados SSL**
   - Configurar Pomerium con Let's Encrypt
   - O usar certificados propios

3. **Restringir acceso por IP** (en Pomerium)
   ```yaml
   policy:
     - allow:
         and:
           - groups:
               or: [remote-access, admin]
           - cidr: 10.0.0.0/8
   ```

4. **Habilitar MFA**
   - Configurar en Zitadel
   - Forzar para grupo `remote-access`

5. **Auditoría**
   - Habilitar grabación de sesiones en Guacamole
   - Logs centralizados en Loki/Grafana

---

## 🐛 Troubleshooting

### Guacamole no inicia

```bash
# Ver logs
docker-compose logs guacamole

# Verificar base de datos
docker-compose logs guacamole-db

# Reiniciar
docker-compose restart guacamole
```

### No puedo conectar a un servidor RDP

1. Verificar firewall del servidor destino
2. Verificar que RDP esté habilitado
3. Verificar credenciales
4. Revisar logs: `docker-compose logs guacd`

### Ubuntu Desktop pantalla negra

```bash
# Reiniciar contenedor
docker-compose restart ubuntu-desktop

# Verificar logs
docker-compose logs ubuntu-desktop

# Limpiar cache del navegador
```

### Wine no ejecuta aplicaciones Windows

```bash
# Entrar al contenedor
docker exec -it wine-desktop bash

# Configurar Wine
winetricks

# Instalar dependencias necesarias
winetricks dotnet48 vcrun2019
```

---

## 📈 Monitoreo

### Métricas en Grafana

Dashboard disponible en: http://localhost:8085

Métricas incluidas:
- Sesiones activas de Guacamole
- Uso de CPU/RAM de escritorios
- Latencia de conexiones
- Transferencia de datos

### Alertas

Configurar alertas para:
- Alto uso de recursos
- Fallos de conexión
- Sesiones inactivas prolongadas

---

## 🚀 Próximos Pasos

### Mejoras Futuras

- [ ] LDAP/AD integration para Guacamole
- [ ] Recording de sesiones automático
- [ ] Dashboard de sesiones activas
- [ ] Rotación automática de contraseñas
- [ ] Integración con Vault para secrets
- [ ] Soporte para conexiones RDP con RemoteApp
- [ ] Acceso a Kubernetes via kubectl web

### Producción

Para pasar a producción:

1. Configurar alta disponibilidad
2. Usar base de datos externa (PostgreSQL cluster)
3. Implementar backup automático
4. Configurar CDN para assets
5. Optimizar imágenes Docker
6. Implementar rate limiting
7. Configurar logs centralizados

---

## 📞 Soporte

- **Documentación**: `docs/`
- **Issues**: GitHub Issues
- **Email**: support@neogenesys.com

---

**© 2025 Neogenesys - Zero Trust Remote Access Platform**

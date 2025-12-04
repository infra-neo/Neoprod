# 🎨 Acceso Remoto HTML5 + Cliente VPN Personalizado

## ✅ Implementación Completa

Se ha agregado acceso remoto HTML5 y sistema de branding para clientes VPN personalizados.

---

## 🖥️ Acceso Remoto HTML5

### Servicios Agregados

#### 1. **Apache Guacamole** (Puerto 8090)
Gateway HTML5 para acceso remoto a:
- Servidores RDP (Windows)
- Servidores VNC (Linux)
- Servidores SSH
- Kubernetes

**Características:**
- ✅ Sin cliente, solo navegador
- ✅ Copiar/pegar entre máquinas
- ✅ Transferencia de archivos
- ✅ Grabación de sesiones
- ✅ SSO con Zitadel (configuración disponible)

**Credenciales:**
- User: `guacadmin`
- Password: `guacadmin`

#### 2. **Ubuntu Desktop** (Puerto 8091)
Escritorio Linux completo en navegador con noVNC.

**Características:**
- ✅ LXDE Desktop
- ✅ Resolución 1920x1080
- ✅ Persistencia de datos
- ✅ VNC integrado

**Credenciales:**
- VNC Password: `neogenesys`

#### 3. **Wine Desktop** (Puerto 8092)
Escritorio Linux con Wine para ejecutar apps Windows.

**Características:**
- ✅ Wine preinstalado
- ✅ Branding Neogenesys aplicable
- ✅ noVNC integrado
- ✅ Soporte apps Windows

**Credenciales:**
- VNC Password: `neogenesys`

---

## 🎨 Cliente VPN Personalizado

### Sistema de Branding Netbird

Se ha creado un sistema completo para generar clientes VPN personalizados con el branding de Neogenesys.

### Estructura de Archivos

```
/workspaces/Neoprod/
├── branding/
│   └── netbird/
│       ├── README.md          # Guía de assets
│       ├── company.json       # Configuración de empresa
│       ├── logo.png           # Logo principal
│       ├── logo.svg           # Logo vectorial
│       ├── icon.ico           # Icono Windows
│       └── screenshots/       # Capturas de pantalla
│
├── scripts/
│   └── build-netbird-custom.sh  # Script de build automatizado
│
├── configs/test-apps/
│   ├── docker-compose.yml     # Actualizado con Guacamole + Desktops
│   ├── start-apps.sh          # Script de inicio actualizado
│   ├── init-guacamole.sh      # Inicialización de Guacamole
│   └── wine-desktop/
│       ├── Dockerfile         # Imagen personalizada
│       └── branding/          # Assets de branding
│
└── docs/
    ├── REMOTE_DESKTOP_GUIDE.md     # Guía completa de acceso remoto
    └── NETBIRD_BRANDING_GUIDE.md   # Guía de personalización VPN
```

---

## 🚀 Inicio Rápido

### 1. Iniciar Servicios de Acceso Remoto

```bash
cd /workspaces/Neoprod/configs/test-apps

# Inicializar Guacamole (solo primera vez)
chmod +x init-guacamole.sh
./init-guacamole.sh

# Iniciar todos los servicios
chmod +x start-apps.sh
./start-apps.sh
```

### 2. Construir Cliente VPN Personalizado

```bash
cd /workspaces/Neoprod/scripts

# Dar permisos
chmod +x build-netbird-custom.sh

# Ejecutar
./build-netbird-custom.sh
```

**Menú interactivo:**
1. Build completo (Windows + Linux + macOS)
2. Solo Windows
3. Solo Linux
4. Solo macOS
5. Aplicar branding únicamente

---

## 📦 URLs de Acceso

### Aplicaciones Docker

| Servicio | Puerto | URL | Grupo |
|----------|--------|-----|-------|
| Echo Server | 8080 | http://localhost:8080 | app1-users |
| Static Site | 8081 | http://localhost:8081 | app2-users |
| Whoami | 8082 | http://localhost:8082 | pomerium-users |
| File Browser | 8083 | http://localhost:8083 | admin |
| Code Server | 8084 | http://localhost:8084 | developers |
| Grafana | 8085 | http://localhost:8085 | monitoring |
| Portainer | 8086 | http://localhost:8086 | admin |
| Uptime Kuma | 8087 | http://localhost:8087 | monitoring |
| Wekan | 8088 | http://localhost:8088 | project-managers |
| Draw.io | 8089 | http://localhost:8089 | pomerium-users |

### Acceso Remoto HTML5

| Servicio | Puerto | URL | Credenciales |
|----------|--------|-----|--------------|
| **Guacamole** | 8090 | http://localhost:8090 | guacadmin / guacadmin |
| **Ubuntu Desktop** | 8091 | http://localhost:8091 | VNC: neogenesys |
| **Wine Desktop** | 8092 | http://localhost:8092 | VNC: neogenesys |

---

## 🎯 Dashboard Actualizado

El dashboard ahora incluye sección de **Acceso Remoto** para usuarios con grupo `remote-access` o `admin`.

### Nuevas Tarjetas

```typescript
// Tarjetas con borde destacado
<Card className="border-2 border-blue-200">
  <h3>🖥️ Guacamole Remote</h3>
  <p>Gateway de acceso remoto HTML5</p>
  <Button onClick={() => window.open('http://localhost:8090')}>
    Acceder
  </Button>
  <p className="text-xs">User: guacadmin / Pass: guacadmin</p>
</Card>
```

Incluidas para:
- Guacamole
- Ubuntu Desktop
- Wine Desktop

---

## 🎨 Personalización de Branding

### Assets Neogenesys

Coloca tus assets en `/workspaces/Neoprod/branding/netbird/`:

```
branding/netbird/
├── logo.png           # 512x512px
├── logo.svg           # Vectorial
├── logo-white.png     # Para fondos oscuros
├── icon.ico           # Windows
├── icon.icns          # macOS
└── company.json       # Configuración
```

### Configuración (`company.json`)

```json
{
  "company": {
    "name": "Neogenesys",
    "displayName": "Neogenesys Remote Access",
    "website": "https://neogenesys.com",
    "support": "support@neogenesys.com"
  },
  "branding": {
    "appName": "Neogenesys Connect",
    "windowTitle": "Neogenesys VPN",
    "colors": {
      "primary": "#667eea",
      "secondary": "#764ba2"
    }
  }
}
```

---

## 🔧 Características del Build Script

### `build-netbird-custom.sh`

**Funciones:**
- ✅ Clona Netbird oficial
- ✅ Aplica parches de branding
- ✅ Reemplaza strings en código
- ✅ Copia assets personalizados
- ✅ Compila para Windows/Linux/macOS
- ✅ Crea instaladores (.exe, .deb, .dmg)
- ✅ Genera documentación

**Cambios Aplicados:**
- Nombres de aplicación
- URLs de soporte
- Colores de UI
- Iconos y logos
- Directorios de configuración
- Nombres de servicios

---

## 📝 Archivos Generados

### Build del Cliente VPN

Después de ejecutar el script, en `scripts/build/`:

**Windows:**
- `neogenesys-connect-windows-amd64.exe` - Cliente GUI
- `neogenesys-cli-windows-amd64.exe` - Cliente CLI
- `installer.nsi` - Script NSIS
- `neogenesys-connect-installer.exe` - Instalador (después de compilar NSIS)

**Linux:**
- `neogenesys-connect-linux-amd64` - Binario
- `neogenesys-cli-linux-amd64` - CLI
- `neogenesys-connect_1.0.0_amd64.deb` - Paquete Debian
- `neogenesys-connect-1.0.0-1.x86_64.rpm` - Paquete RPM (opcional)

**macOS:**
- `neogenesys-connect-macos-amd64` - Intel
- `neogenesys-connect-macos-arm64` - Apple Silicon
- `NeogenesysConnect.app` - App bundle
- `NeogenesysConnect.dmg` - Instalador (después de crear)

**Documentación:**
- `README.md` - Guía de instalación y uso

---

## 🐳 Docker Compose Actualizado

### Nuevos Servicios

```yaml
services:
  # Guacamole stack
  guacamole-db:
    image: postgres:15
    ports: []
    
  guacd:
    image: guacamole/guacd
    
  guacamole:
    image: guacamole/guacamole
    ports: ["8090:8080"]
    
  # Desktops
  ubuntu-desktop:
    image: dorowu/ubuntu-desktop-lxde-vnc
    ports: ["8091:80", "5900:5900"]
    
  wine-desktop:
    build: ./wine-desktop
    ports: ["8092:6080"]
```

### Volúmenes

```yaml
volumes:
  guacamole-db-data:
  ubuntu-desktop-home:
  wine-desktop-home:
```

---

## 🔌 Integración con Pomerium

### Rutas Configurables

Agregar a `configs/pomerium/config.yaml`:

```yaml
routes:
  # Guacamole
  - from: https://remote.pomerium.local
    to: http://guacamole:8080
    policy:
      - allow:
          groups:
            or: [remote-access, admin]
    
  # Ubuntu Desktop
  - from: https://desktop.pomerium.local
    to: http://ubuntu-desktop:80
    policy:
      - allow:
          groups:
            or: [remote-access, admin]
    
  # Wine Desktop
  - from: https://windows.pomerium.local
    to: http://wine-desktop:6080
    policy:
      - allow:
          groups:
            or: [remote-access, admin]
```

---

## 📚 Documentación Completa

### Guías Disponibles

1. **`docs/REMOTE_DESKTOP_GUIDE.md`**
   - Configuración de Guacamole
   - Agregar conexiones RDP/VNC/SSH
   - Integración con Pomerium
   - SSO con Zitadel
   - Troubleshooting

2. **`docs/NETBIRD_BRANDING_GUIDE.md`**
   - Proceso completo de build
   - Personalización de assets
   - Crear instaladores
   - Distribución
   - Auto-updates
   - Firma de código

---

## 🎯 Casos de Uso

### 1. Acceso a Servidor Windows

```
Usuario → Dashboard → Guacamole → RDP → Windows Server
```

1. Login en dashboard
2. Click "Guacamole Remote"
3. En Guacamole, seleccionar conexión RDP
4. Acceso directo desde navegador

### 2. Desarrollo Remoto

```
Usuario → Dashboard → Ubuntu Desktop → Code/Terminal
```

1. Click "Ubuntu Desktop"
2. Escritorio Linux completo en navegador
3. Instalar herramientas necesarias
4. Desarrollo con persistencia

### 3. Apps Windows en Linux

```
Usuario → Dashboard → Wine Desktop → Wine → App.exe
```

1. Click "Windows Desktop"
2. Ejecutar `wine app.exe`
3. Apps Windows en entorno Linux

---

## 🔒 Seguridad

### Recomendaciones

1. **Cambiar contraseñas por defecto**
   ```bash
   # Guacamole
   docker exec -it guacamole-postgres psql -U guacamole_user -d guacamole_db
   UPDATE guacamole_user SET password_hash=... WHERE username='guacadmin';
   ```

2. **Usar solo con Pomerium**
   - No exponer puertos directamente
   - Acceso solo via Pomerium
   - Forzar MFA en Zitadel

3. **Limitar grupos**
   ```yaml
   policy:
     - allow:
         and:
           - groups: [remote-access]
           - cidr: 10.0.0.0/8  # Solo red interna
   ```

4. **Habilitar grabación de sesiones** en Guacamole

---

## 🚀 Distribución del Cliente VPN

### One-Liner Windows

```powershell
irm https://get.neogenesys.com/install.ps1 | iex
```

### One-Liner Linux/macOS

```bash
curl -fsSL https://get.neogenesys.com/install.sh | bash
```

### GitHub Releases

```bash
gh release create v1.0.0 \
  --title "Neogenesys Connect v1.0.0" \
  build/*.exe build/*.deb build/*.dmg
```

---

## 📊 Resumen de Implementación

### ✅ Completado

- [x] Apache Guacamole con PostgreSQL
- [x] Ubuntu Desktop con noVNC
- [x] Wine Desktop personalizado
- [x] Docker Compose actualizado
- [x] Script de inicialización
- [x] Dashboard con nuevas tarjetas
- [x] Sistema de branding para Netbird
- [x] Script de build automatizado
- [x] Documentación completa
- [x] Integración con Pomerium
- [x] Guías de uso y troubleshooting

### 📦 Archivos Creados/Actualizados

1. `configs/test-apps/docker-compose.yml` - Servicios remotos
2. `configs/test-apps/init-guacamole.sh` - Init Guacamole
3. `configs/test-apps/start-apps.sh` - Actualizado con nuevas apps
4. `configs/test-apps/wine-desktop/Dockerfile` - Desktop personalizado
5. `branding/netbird/company.json` - Config de branding
6. `scripts/build-netbird-custom.sh` - Build automatizado
7. `frontend/src/app/dashboard/page.tsx` - Tarjetas de acceso remoto
8. `docs/REMOTE_DESKTOP_GUIDE.md` - Guía completa
9. `docs/NETBIRD_BRANDING_GUIDE.md` - Guía de personalización

---

## 🎉 Resultado Final

**13 aplicaciones** en total:
- 10 apps originales
- 3 servicios de acceso remoto HTML5

**Cliente VPN personalizado:**
- Branding completo de Neogenesys
- Builds para Windows, Linux, macOS
- Instaladores automatizados
- Sistema de distribución

**Todo listo para:**
- ✅ Desarrollo local
- ✅ Testing completo
- ✅ Despliegue en producción
- ✅ Distribución de clientes

---

**© 2025 Neogenesys - Zero Trust Remote Access Platform**

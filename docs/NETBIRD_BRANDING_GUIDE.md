# 🎨 Cliente Netbird Personalizado con Branding Neogenesys

## 📋 Descripción

Guía completa para crear clientes VPN de Netbird personalizados con el branding de Neogenesys para Windows, Linux y macOS.

---

## 🚀 Quick Start

```bash
cd /workspaces/Neoprod/scripts
chmod +x build-netbird-custom.sh
./build-netbird-custom.sh
```

Selecciona la opción deseada del menú interactivo.

---

## 🎨 Personalización de Branding

### Assets Requeridos

Coloca los siguientes archivos en `/workspaces/Neoprod/branding/netbird/`:

#### Logos e Iconos

```
branding/netbird/
├── logo.png           # 512x512px, PNG con transparencia
├── logo.svg           # Logo vectorial
├── logo-white.png     # Logo blanco para fondos oscuros
├── icon.ico           # Windows icon (256x256px)
├── icon.icns          # macOS icon
├── icon-16.png        # 16x16px
├── icon-32.png        # 32x32px
├── icon-64.png        # 64x64px
├── icon-128.png       # 128x128px
└── icon-256.png       # 256x256px
```

#### Capturas de Pantalla

```
branding/netbird/screenshots/
├── main-window.png
├── settings.png
└── connected.png
```

#### Instaladores

```
branding/netbird/installer/
├── background.jpg     # Fondo instalador Windows (493x312px)
├── banner.bmp         # Banner instalador Windows (493x58px)
└── license.rtf        # Licencia de usuario final
```

### Configuración

Edita `branding/netbird/company.json`:

```json
{
  "company": {
    "name": "Neogenesys",
    "displayName": "Neogenesys Remote Access",
    "shortName": "Neogenesys",
    "description": "Zero Trust Remote Access Platform",
    "website": "https://neogenesys.com",
    "support": "support@neogenesys.com",
    "documentation": "https://docs.neogenesys.com"
  },
  "branding": {
    "appName": "Neogenesys Connect",
    "windowTitle": "Neogenesys VPN",
    "trayTooltip": "Neogenesys - Zero Trust Access",
    "colors": {
      "primary": "#667eea",
      "secondary": "#764ba2",
      "accent": "#4c51bf",
      "background": "#1a202c",
      "text": "#ffffff"
    }
  },
  "version": {
    "major": 1,
    "minor": 0,
    "patch": 0,
    "build": "neogenesys-001"
  }
}
```

---

## 🔨 Proceso de Build

### Dependencias Necesarias

#### Ubuntu/Debian

```bash
# Herramientas de build
sudo apt-get update
sudo apt-get install -y \
    git \
    golang-1.21 \
    gcc \
    g++ \
    make \
    pkg-config \
    libgtk-3-dev \
    libappindicator3-dev \
    libwebkit2gtk-4.0-dev \
    nsis \
    dpkg-dev \
    rpm

# Node.js para UI
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Windows (WSL o nativo)

```powershell
# Chocolatey
choco install golang nsis git

# O descarga manual:
# Go: https://go.dev/dl/
# NSIS: https://nsis.sourceforge.io/
# Git: https://git-scm.com/
```

#### macOS

```bash
# Homebrew
brew install go node git

# Xcode command line tools
xcode-select --install
```

### Build Paso a Paso

#### 1. Preparar Entorno

```bash
cd /workspaces/Neoprod/scripts
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin
```

#### 2. Clonar y Patchear Netbird

El script automáticamente:
1. Clona el repositorio oficial de Netbird
2. Aplica parches de branding
3. Reemplaza assets
4. Modifica strings en el código

```bash
./build-netbird-custom.sh
# Opción 5: Aplicar branding únicamente
```

#### 3. Compilar para Plataforma Específica

**Windows:**
```bash
./build-netbird-custom.sh
# Opción 2: Solo Windows
```

Output:
- `build/neogenesys-connect-windows-amd64.exe` - GUI client
- `build/neogenesys-cli-windows-amd64.exe` - CLI client
- `build/installer.nsi` - NSIS script

**Linux:**
```bash
./build-netbird-custom.sh
# Opción 3: Solo Linux
```

Output:
- `build/neogenesys-connect-linux-amd64` - GUI client
- `build/neogenesys-cli-linux-amd64` - CLI client
- `build/neogenesys-connect_1.0.0_amd64.deb` - Debian package
- `build/neogenesys-connect-1.0.0-1.x86_64.rpm` - RPM package

**macOS:**
```bash
./build-netbird-custom.sh
# Opción 4: Solo macOS
```

Output:
- `build/neogenesys-connect-macos-amd64` - Intel binary
- `build/neogenesys-connect-macos-arm64` - Apple Silicon binary
- `build/NeogenesysConnect.app` - Application bundle
- `build/NeogenesysConnect.dmg` - Disk image installer

---

## 📦 Crear Instaladores

### Windows - NSIS

```bash
# Después del build
cd scripts/build
makensis installer.nsi

# Output: neogenesys-connect-installer.exe
```

Personalizar `installer.nsi`:

```nsis
!define PRODUCT_NAME "Neogenesys Connect"
!define PRODUCT_VERSION "1.0.0"
!define PRODUCT_PUBLISHER "Neogenesys"
!define PRODUCT_WEB_SITE "https://neogenesys.com"

# Personalizar instalador
!define MUI_ICON "..\..\branding\netbird\icon.ico"
!define MUI_WELCOMEFINISHPAGE_BITMAP "..\..\branding\netbird\installer\background.bmp"
```

### Linux - .deb Package

Automático con el script. Para personalizar:

```bash
# Estructura
neogenesys-connect-deb/
├── DEBIAN/
│   ├── control
│   ├── postinst
│   └── prerm
├── usr/
│   ├── bin/
│   │   ├── neogenesys-connect
│   │   └── neogenesys-cli
│   └── share/
│       ├── applications/
│       │   └── neogenesys-connect.desktop
│       ├── pixmaps/
│       │   └── neogenesys-logo.png
│       └── doc/
│           └── neogenesys-connect/
│               ├── README.md
│               └── copyright
```

Build manual:

```bash
dpkg-deb --build neogenesys-connect-deb neogenesys-connect_1.0.0_amd64.deb
```

### macOS - DMG

```bash
# Crear app bundle
cd scripts/build

# Crear estructura
mkdir -p NeogenesysConnect.app/Contents/{MacOS,Resources}

# Info.plist
cat > NeogenesysConnect.app/Contents/Info.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>neogenesys-connect</string>
    <key>CFBundleIconFile</key>
    <string>icon.icns</string>
    <key>CFBundleIdentifier</key>
    <string>com.neogenesys.connect</string>
    <key>CFBundleName</key>
    <string>Neogenesys Connect</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.15</string>
</dict>
</plist>
EOF

# Copiar binario y resources
cp neogenesys-connect-macos-arm64 NeogenesysConnect.app/Contents/MacOS/neogenesys-connect
cp ../../branding/netbird/icon.icns NeogenesysConnect.app/Contents/Resources/

# Crear DMG
hdiutil create -volname "Neogenesys Connect" \
    -srcfolder NeogenesysConnect.app \
    -ov -format UDZO \
    NeogenesysConnect.dmg
```

---

## 🎯 Cambios de Branding Aplicados

### Código Fuente

El script automáticamente modifica:

```go
// client/ui/main.go
const (
    AppName = "Neogenesys Connect"      // antes: "Netbird"
    WindowTitle = "Neogenesys VPN"      // antes: "Netbird VPN"
    TrayTooltip = "Neogenesys Connect"  // antes: "Netbird"
)

// URLs
const (
    BaseURL = "https://neogenesys.com"  // antes: "https://netbird.io"
    DocsURL = "https://docs.neogenesys.com"
    SupportURL = "https://support.neogenesys.com"
)

// Colors (para UI)
var (
    PrimaryColor = "#667eea"   // Neogenesys purple
    AccentColor = "#764ba2"    // Neogenesys gradient
)
```

### Assets Reemplazados

- `client/ui/assets/logo.png` → Logo de Neogenesys
- `client/ui/assets/icon.*` → Iconos personalizados
- `client/ui/assets/tray-*.png` → Iconos de bandeja del sistema
- Strings en archivos de recursos

### Configuración

- Directorio de config: `~/.config/neogenesys-connect/`
- Service name: `neogenesys-connect`
- Log files: `/var/log/neogenesys-connect/`

---

## 📱 Distribución

### Hosting de Instaladores

#### GitHub Releases

```bash
# Crear release
gh release create v1.0.0 \
    --title "Neogenesys Connect v1.0.0" \
    --notes "Primera versión con branding Neogenesys" \
    build/neogenesys-connect-installer.exe \
    build/neogenesys-connect_1.0.0_amd64.deb \
    build/NeogenesysConnect.dmg
```

#### CDN o Web Server

```bash
# Estructura de directorios
downloads/
├── windows/
│   ├── latest/
│   │   └── neogenesys-connect-installer.exe
│   └── 1.0.0/
│       └── neogenesys-connect-installer.exe
├── linux/
│   ├── deb/
│   │   └── neogenesys-connect_1.0.0_amd64.deb
│   └── rpm/
│       └── neogenesys-connect-1.0.0-1.x86_64.rpm
└── macos/
    └── NeogenesysConnect.dmg
```

### PowerShell One-Liner (Windows)

Actualizar `scripts/install-neogenesys-client.ps1`:

```powershell
$DownloadURL = "https://downloads.neogenesys.com/windows/latest/neogenesys-connect-installer.exe"
$InstallerPath = "$env:TEMP\neogenesys-connect-installer.exe"

Write-Host "Descargando Neogenesys Connect..." -ForegroundColor Cyan
Invoke-WebRequest -Uri $DownloadURL -OutFile $InstallerPath

Write-Host "Instalando..." -ForegroundColor Cyan
Start-Process -FilePath $InstallerPath -Args "/S" -Wait

Write-Host "✓ Instalación completada" -ForegroundColor Green
```

Uso:

```powershell
irm https://get.neogenesys.com/install.ps1 | iex
```

### Bash One-Liner (Linux/macOS)

```bash
curl -fsSL https://get.neogenesys.com/install.sh | bash
```

Contenido de `install.sh`:

```bash
#!/bin/bash

set -e

OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
    Linux*)
        if [ -f /etc/debian_version ]; then
            wget https://downloads.neogenesys.com/linux/deb/neogenesys-connect_1.0.0_amd64.deb
            sudo dpkg -i neogenesys-connect_1.0.0_amd64.deb
        elif [ -f /etc/redhat-release ]; then
            wget https://downloads.neogenesys.com/linux/rpm/neogenesys-connect-1.0.0-1.x86_64.rpm
            sudo rpm -i neogenesys-connect-1.0.0-1.x86_64.rpm
        fi
        ;;
    Darwin*)
        wget https://downloads.neogenesys.com/macos/NeogenesysConnect.dmg
        hdiutil attach NeogenesysConnect.dmg
        cp -R "/Volumes/Neogenesys Connect/NeogenesysConnect.app" /Applications/
        hdiutil detach "/Volumes/Neogenesys Connect"
        ;;
esac

echo "✓ Neogenesys Connect instalado correctamente"
```

---

## 🔄 Auto-Update

### Configurar Update Server

```go
// client/internal/update/config.go
const (
    UpdateURL = "https://updates.neogenesys.com/api/v1/check"
    UpdateChannel = "stable" // o "beta", "alpha"
)

type UpdateResponse struct {
    Version string `json:"version"`
    URL string `json:"url"`
    Checksum string `json:"sha256"`
    Notes string `json:"release_notes"`
}
```

### API de Updates

```bash
# Endpoint
GET https://updates.neogenesys.com/api/v1/check
Query params:
  - version=1.0.0
  - os=windows|linux|darwin
  - arch=amd64|arm64
  - channel=stable|beta

Response:
{
  "version": "1.1.0",
  "url": "https://downloads.neogenesys.com/windows/1.1.0/installer.exe",
  "sha256": "abc123...",
  "release_notes": "- Fix bug X\n- Add feature Y",
  "required": false
}
```

---

## 🧪 Testing

### Verificar Build

```bash
# Windows
./neogenesys-connect-windows-amd64.exe --version
./neogenesys-connect-windows-amd64.exe --help

# Linux
./neogenesys-connect-linux-amd64 --version
./neogenesys-connect-linux-amd64 status

# macOS
./neogenesys-connect-macos-arm64 --version
```

### Testing de Instaladores

**Windows:**
```powershell
# Instalar
.\neogenesys-connect-installer.exe /S

# Verificar
Get-Service neogenesys-connect
& "C:\Program Files\Neogenesys\Connect\neogenesys-cli.exe" status
```

**Linux:**
```bash
# Instalar
sudo dpkg -i neogenesys-connect_1.0.0_amd64.deb

# Verificar
systemctl status neogenesys-connect
neogenesys-cli status
```

**macOS:**
```bash
# Instalar
open NeogenesysConnect.dmg
# Arrastrar a Applications

# Verificar
/Applications/NeogenesysConnect.app/Contents/MacOS/neogenesys-connect --version
```

---

## 📊 Métricas y Analytics

### Tracking de Instalaciones

Agregar telemetría anónima:

```go
// client/internal/telemetry/telemetry.go
func TrackInstall() {
    data := map[string]string{
        "version": version.Current,
        "os": runtime.GOOS,
        "arch": runtime.GOARCH,
    }
    
    http.Post("https://telemetry.neogenesys.com/api/v1/install", "application/json", marshal(data))
}
```

### Dashboard de Distribución

Métricas a trackear:
- Total de instalaciones
- Instalaciones por OS/versión
- Versiones activas
- Tasa de actualización
- Regiones geográficas

---

## 🔒 Firma de Código

### Windows - Authenticode

```powershell
# Obtener certificado de firma de código
# Firmar ejecutable
signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com /v neogenesys-connect-installer.exe

# Verificar
signtool verify /pa /v neogenesys-connect-installer.exe
```

### macOS - Codesign

```bash
# Firmar aplicación
codesign --sign "Developer ID Application: Neogenesys" \
    --deep \
    --force \
    --options runtime \
    --timestamp \
    NeogenesysConnect.app

# Notarizar
xcrun notarytool submit NeogenesysConnect.dmg \
    --apple-id developer@neogenesys.com \
    --team-id TEAMID \
    --password app-specific-password

# Verificar
codesign --verify --deep --strict --verbose=2 NeogenesysConnect.app
```

### Linux - GPG

```bash
# Firmar paquete
gpg --detach-sign --armor neogenesys-connect_1.0.0_amd64.deb

# Verificar
gpg --verify neogenesys-connect_1.0.0_amd64.deb.asc neogenesys-connect_1.0.0_amd64.deb
```

---

## 📚 Recursos Adicionales

- [Netbird Documentation](https://netbird.io/docs/)
- [Go Cross Compilation](https://go.dev/doc/install/cross)
- [NSIS Documentation](https://nsis.sourceforge.io/Docs/)
- [Debian Package Guide](https://www.debian.org/doc/manuals/maint-guide/)
- [macOS App Bundle](https://developer.apple.com/library/archive/documentation/CoreFoundation/Conceptual/CFBundles/BundleTypes/BundleTypes.html)

---

## 📞 Soporte

- **Email**: support@neogenesys.com
- **Docs**: https://docs.neogenesys.com
- **GitHub**: https://github.com/neogenesys

---

**© 2025 Neogenesys - Zero Trust VPN Solution**

#!/bin/bash

# Script para crear cliente Netbird personalizado con branding Neogenesys
# Autor: Neogenesys
# Fecha: Diciembre 2025

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BRANDING_DIR="$SCRIPT_DIR/../../branding/netbird"
BUILD_DIR="$SCRIPT_DIR/build"
NETBIRD_VERSION="v0.28.0"

echo "🎨 Neogenesys Netbird Client Builder"
echo "===================================="
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar dependencias
check_dependencies() {
    echo "📦 Verificando dependencias..."
    
    local missing_deps=()
    
    command -v git >/dev/null 2>&1 || missing_deps+=("git")
    command -v go >/dev/null 2>&1 || missing_deps+=("golang")
    command -v npm >/dev/null 2>&1 || missing_deps+=("nodejs/npm")
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        echo -e "${RED}❌ Faltan dependencias: ${missing_deps[*]}${NC}"
        echo "Instala las dependencias necesarias y vuelve a ejecutar el script."
        exit 1
    fi
    
    echo -e "${GREEN}✓ Todas las dependencias instaladas${NC}"
}

# Clonar Netbird
clone_netbird() {
    echo ""
    echo "📥 Clonando Netbird $NETBIRD_VERSION..."
    
    if [ -d "$BUILD_DIR/netbird" ]; then
        echo "Directorio netbird ya existe. Eliminando..."
        rm -rf "$BUILD_DIR/netbird"
    fi
    
    mkdir -p "$BUILD_DIR"
    cd "$BUILD_DIR"
    
    git clone --depth 1 --branch "$NETBIRD_VERSION" https://github.com/netbirdio/netbird.git
    cd netbird
    
    echo -e "${GREEN}✓ Netbird clonado${NC}"
}

# Aplicar branding
apply_branding() {
    echo ""
    echo "🎨 Aplicando branding Neogenesys..."
    
    local netbird_dir="$BUILD_DIR/netbird"
    
    # Leer configuración
    if [ ! -f "$BRANDING_DIR/company.json" ]; then
        echo -e "${RED}❌ No se encontró company.json${NC}"
        exit 1
    fi
    
    # Reemplazar nombre de aplicación en código
    echo "  → Actualizando nombres de aplicación..."
    
    find "$netbird_dir/client/ui" -type f -name "*.go" -exec sed -i 's/Netbird/Neogenesys Connect/g' {} \;
    find "$netbird_dir/client/ui" -type f -name "*.go" -exec sed -i 's/netbird/neogenesys/g' {} \;
    
    # Reemplazar URLs
    echo "  → Actualizando URLs..."
    find "$netbird_dir" -type f -name "*.go" -exec sed -i 's|netbird.io|neogenesys.com|g' {} \;
    
    # Copiar assets
    echo "  → Copiando assets..."
    
    if [ -f "$BRANDING_DIR/logo.png" ]; then
        cp "$BRANDING_DIR/logo.png" "$netbird_dir/client/ui/assets/logo.png"
    fi
    
    if [ -f "$BRANDING_DIR/icon.ico" ]; then
        cp "$BRANDING_DIR/icon.ico" "$netbird_dir/client/ui/assets/icon.ico"
    fi
    
    # Actualizar información en archivos de configuración
    echo "  → Actualizando configuración..."
    
    # Crear archivo de versión personalizada
    cat > "$netbird_dir/version.go" << 'EOF'
package main

const (
    version = "1.0.0-neogenesys"
    buildInfo = "Neogenesys Custom Build"
)
EOF
    
    echo -e "${GREEN}✓ Branding aplicado${NC}"
}

# Build para Windows
build_windows() {
    echo ""
    echo "🪟 Compilando para Windows..."
    
    cd "$BUILD_DIR/netbird"
    
    export GOOS=windows
    export GOARCH=amd64
    export CGO_ENABLED=1
    
    echo "  → Compilando cliente GUI..."
    go build -ldflags="-s -w -H windowsgui" -o "$BUILD_DIR/neogenesys-connect-windows-amd64.exe" ./client/cmd
    
    echo "  → Compilando cliente CLI..."
    go build -ldflags="-s -w" -o "$BUILD_DIR/neogenesys-cli-windows-amd64.exe" ./client/cmd/cli
    
    echo -e "${GREEN}✓ Build Windows completado${NC}"
}

# Build para Linux
build_linux() {
    echo ""
    echo "🐧 Compilando para Linux..."
    
    cd "$BUILD_DIR/netbird"
    
    export GOOS=linux
    export GOARCH=amd64
    export CGO_ENABLED=1
    
    echo "  → Compilando cliente GUI..."
    go build -ldflags="-s -w" -o "$BUILD_DIR/neogenesys-connect-linux-amd64" ./client/cmd
    
    echo "  → Compilando cliente CLI..."
    go build -ldflags="-s -w" -o "$BUILD_DIR/neogenesys-cli-linux-amd64" ./client/cmd/cli
    
    chmod +x "$BUILD_DIR/neogenesys-connect-linux-amd64"
    chmod +x "$BUILD_DIR/neogenesys-cli-linux-amd64"
    
    echo -e "${GREEN}✓ Build Linux completado${NC}"
}

# Build para macOS
build_macos() {
    echo ""
    echo "🍎 Compilando para macOS..."
    
    cd "$BUILD_DIR/netbird"
    
    export GOOS=darwin
    export GOARCH=amd64
    export CGO_ENABLED=1
    
    echo "  → Compilando cliente GUI (Intel)..."
    go build -ldflags="-s -w" -o "$BUILD_DIR/neogenesys-connect-macos-amd64" ./client/cmd
    
    # Apple Silicon
    export GOARCH=arm64
    echo "  → Compilando cliente GUI (Apple Silicon)..."
    go build -ldflags="-s -w" -o "$BUILD_DIR/neogenesys-connect-macos-arm64" ./client/cmd
    
    echo -e "${GREEN}✓ Build macOS completado${NC}"
}

# Crear instaladores
create_installers() {
    echo ""
    echo "📦 Creando instaladores..."
    
    # Windows - NSIS script
    create_windows_installer
    
    # Linux - .deb package
    create_linux_package
    
    echo -e "${GREEN}✓ Instaladores creados${NC}"
}

create_windows_installer() {
    echo "  → Creando instalador Windows (NSIS)..."
    
    cat > "$BUILD_DIR/installer.nsi" << 'NSIS_EOF'
!define PRODUCT_NAME "Neogenesys Connect"
!define PRODUCT_VERSION "1.0.0"
!define PRODUCT_PUBLISHER "Neogenesys"
!define PRODUCT_WEB_SITE "https://neogenesys.com"

!include "MUI2.nsh"

Name "${PRODUCT_NAME}"
OutFile "neogenesys-connect-installer.exe"
InstallDir "$PROGRAMFILES64\Neogenesys\Connect"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "LICENSE"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_LANGUAGE "English"

Section "MainSection" SEC01
  SetOutPath "$INSTDIR"
  File "neogenesys-connect-windows-amd64.exe"
  File "neogenesys-cli-windows-amd64.exe"
  
  CreateDirectory "$SMPROGRAMS\Neogenesys"
  CreateShortCut "$SMPROGRAMS\Neogenesys\Neogenesys Connect.lnk" "$INSTDIR\neogenesys-connect-windows-amd64.exe"
  CreateShortCut "$DESKTOP\Neogenesys Connect.lnk" "$INSTDIR\neogenesys-connect-windows-amd64.exe"
  
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayName" "${PRODUCT_NAME}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "UninstallString" "$INSTDIR\uninstall.exe"
  
  WriteUninstaller "$INSTDIR\uninstall.exe"
SectionEnd

Section "Uninstall"
  Delete "$INSTDIR\neogenesys-connect-windows-amd64.exe"
  Delete "$INSTDIR\neogenesys-cli-windows-amd64.exe"
  Delete "$INSTDIR\uninstall.exe"
  Delete "$SMPROGRAMS\Neogenesys\Neogenesys Connect.lnk"
  Delete "$DESKTOP\Neogenesys Connect.lnk"
  RMDir "$SMPROGRAMS\Neogenesys"
  RMDir "$INSTDIR"
  
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
SectionEnd
NSIS_EOF
    
    echo -e "${YELLOW}ℹ  Para compilar el instalador, ejecuta: makensis installer.nsi${NC}"
}

create_linux_package() {
    echo "  → Creando paquete .deb para Linux..."
    
    local deb_dir="$BUILD_DIR/neogenesys-connect-deb"
    mkdir -p "$deb_dir/DEBIAN"
    mkdir -p "$deb_dir/usr/bin"
    mkdir -p "$deb_dir/usr/share/applications"
    mkdir -p "$deb_dir/usr/share/pixmaps"
    
    # Control file
    cat > "$deb_dir/DEBIAN/control" << 'DEB_EOF'
Package: neogenesys-connect
Version: 1.0.0
Section: net
Priority: optional
Architecture: amd64
Maintainer: Neogenesys <support@neogenesys.com>
Description: Neogenesys Zero Trust VPN Client
 Enterprise-grade Zero Trust VPN solution for secure remote access.
DEB_EOF
    
    # Copiar binarios
    cp "$BUILD_DIR/neogenesys-connect-linux-amd64" "$deb_dir/usr/bin/neogenesys-connect"
    cp "$BUILD_DIR/neogenesys-cli-linux-amd64" "$deb_dir/usr/bin/neogenesys-cli"
    
    # Desktop entry
    cat > "$deb_dir/usr/share/applications/neogenesys-connect.desktop" << 'DESKTOP_EOF'
[Desktop Entry]
Name=Neogenesys Connect
Comment=Zero Trust VPN Client
Exec=/usr/bin/neogenesys-connect
Icon=neogenesys-connect
Terminal=false
Type=Application
Categories=Network;
DESKTOP_EOF
    
    # Build .deb
    dpkg-deb --build "$deb_dir" "$BUILD_DIR/neogenesys-connect_1.0.0_amd64.deb"
    
    echo -e "${GREEN}✓ Paquete .deb creado${NC}"
}

# Generar documentación
generate_docs() {
    echo ""
    echo "📝 Generando documentación..."
    
    cat > "$BUILD_DIR/README.md" << 'DOC_EOF'
# Neogenesys Connect - Cliente VPN

Cliente VPN Zero Trust basado en Netbird, personalizado para Neogenesys.

## 🚀 Instalación

### Windows
1. Descarga `neogenesys-connect-installer.exe`
2. Ejecuta el instalador
3. Sigue las instrucciones en pantalla

### Linux (Debian/Ubuntu)
```bash
sudo dpkg -i neogenesys-connect_1.0.0_amd64.deb
```

### macOS
```bash
# Intel
chmod +x neogenesys-connect-macos-amd64
sudo mv neogenesys-connect-macos-amd64 /usr/local/bin/neogenesys-connect

# Apple Silicon
chmod +x neogenesys-connect-macos-arm64
sudo mv neogenesys-connect-macos-arm64 /usr/local/bin/neogenesys-connect
```

## 📖 Uso

### Primera conexión
```bash
neogenesys-connect up --setup-key YOUR_SETUP_KEY
```

### Ver estado
```bash
neogenesys-connect status
```

### Desconectar
```bash
neogenesys-connect down
```

## 🔧 Configuración

La configuración se guarda en:
- Windows: `%APPDATA%\Neogenesys\Connect`
- Linux: `~/.config/neogenesys-connect`
- macOS: `~/Library/Application Support/Neogenesys Connect`

## 📞 Soporte

- Web: https://neogenesys.com
- Email: support@neogenesys.com
- Docs: https://docs.neogenesys.com

## 📄 Licencia

Propietario - © 2025 Neogenesys. Todos los derechos reservados.
DOC_EOF
    
    echo -e "${GREEN}✓ Documentación generada${NC}"
}

# Resumen
show_summary() {
    echo ""
    echo "======================================"
    echo "✅ Build Completado"
    echo "======================================"
    echo ""
    echo "📦 Archivos generados en: $BUILD_DIR"
    echo ""
    echo "Windows:"
    echo "  - neogenesys-connect-windows-amd64.exe"
    echo "  - neogenesys-cli-windows-amd64.exe"
    echo "  - installer.nsi (compilar con NSIS)"
    echo ""
    echo "Linux:"
    echo "  - neogenesys-connect-linux-amd64"
    echo "  - neogenesys-cli-linux-amd64"
    echo "  - neogenesys-connect_1.0.0_amd64.deb"
    echo ""
    echo "macOS:"
    echo "  - neogenesys-connect-macos-amd64"
    echo "  - neogenesys-connect-macos-arm64"
    echo ""
    echo "📝 Documentación: $BUILD_DIR/README.md"
    echo ""
    echo "🎉 ¡Listo para distribuir!"
}

# Menú principal
main() {
    echo "Selecciona una opción:"
    echo "1) Build completo (Windows + Linux + macOS)"
    echo "2) Solo Windows"
    echo "3) Solo Linux"
    echo "4) Solo macOS"
    echo "5) Aplicar branding únicamente"
    echo "6) Salir"
    echo ""
    read -p "Opción: " option
    
    case $option in
        1)
            check_dependencies
            clone_netbird
            apply_branding
            build_windows
            build_linux
            build_macos
            create_installers
            generate_docs
            show_summary
            ;;
        2)
            check_dependencies
            clone_netbird
            apply_branding
            build_windows
            create_windows_installer
            generate_docs
            echo -e "${GREEN}✓ Build Windows completado${NC}"
            ;;
        3)
            check_dependencies
            clone_netbird
            apply_branding
            build_linux
            create_linux_package
            generate_docs
            echo -e "${GREEN}✓ Build Linux completado${NC}"
            ;;
        4)
            check_dependencies
            clone_netbird
            apply_branding
            build_macos
            generate_docs
            echo -e "${GREEN}✓ Build macOS completado${NC}"
            ;;
        5)
            clone_netbird
            apply_branding
            echo -e "${GREEN}✓ Branding aplicado${NC}"
            ;;
        6)
            echo "Saliendo..."
            exit 0
            ;;
        *)
            echo -e "${RED}Opción inválida${NC}"
            exit 1
            ;;
    esac
}

# Ejecutar
main

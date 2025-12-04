# Neogenesys Branding Assets

Este directorio contiene los assets de branding para personalizar los clientes de Netbird.

## 🎨 Assets Requeridos

### Logo
- `logo.png` - Logo principal (512x512px, PNG con transparencia)
- `logo.svg` - Logo vectorial
- `logo-white.png` - Logo en blanco para fondos oscuros
- `icon.ico` - Icono para Windows (256x256px)
- `icon.icns` - Icono para macOS

### Fondos
- `background.jpg` - Fondo para instalador de Windows
- `banner.bmp` - Banner para instalador de Windows (493x58px)

### Información
- `company.json` - Información de la empresa

## 📋 Configuración

Edita `company.json` con tu información:

```json
{
  "name": "Neogenesys",
  "displayName": "Neogenesys Remote Access",
  "description": "Zero Trust VPN Client",
  "website": "https://neogenesys.com",
  "support": "support@neogenesys.com",
  "version": "1.0.0",
  "colors": {
    "primary": "#667eea",
    "secondary": "#764ba2",
    "accent": "#4c51bf"
  }
}
```

## 🔧 Uso

Los scripts de build automáticamente tomarán estos assets para generar los clientes personalizados.

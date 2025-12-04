# Guía de Integración Completa - Aplicaciones Docker

## 🎯 Descripción General

Esta guía describe cómo todas las aplicaciones Docker están integradas con el frontend y backend de Neogenesys para pruebas completas del flujo de autenticación, admin console y configuraciones de perfil.

## 🏗️ Arquitectura de Integración

```
Frontend (Next.js:3000)
    ↓
Backend API (Express:3001)
    ↓
Docker Applications (Puerto 8080-8089)
    ↓
Pomerium Network
```

## 📦 Aplicaciones Docker Integradas

### 1. **Echo Server** (test-app1)
- **Puerto**: 8080
- **URL**: http://localhost:8080
- **Propósito**: Servidor HTTP echo para testing
- **Grupos requeridos**: `app1-users`, `admin`
- **Categoría**: Testing

### 2. **Static Site** (test-app2)
- **Puerto**: 8081
- **URL**: http://localhost:8081
- **Propósito**: Sitio web estático con Nginx
- **Grupos requeridos**: `app2-users`, `admin`
- **Categoría**: Web Apps

### 3. **Identity Checker** (test-whoami)
- **Puerto**: 8082
- **URL**: http://localhost:8082
- **Propósito**: Verificación de identidad y headers
- **Grupos requeridos**: `pomerium-users`, `admin`
- **Categoría**: Testing

### 4. **File Browser** (test-filebrowser)
- **Puerto**: 8083
- **URL**: http://localhost:8083
- **Propósito**: Gestor de archivos web
- **Grupos requeridos**: `admin`
- **Categoría**: Tools
- **Credenciales**: user: `admin` / pass: `admin`

### 5. **VS Code** (test-code-server)
- **Puerto**: 8084
- **URL**: http://localhost:8084
- **Propósito**: Editor de código web
- **Grupos requeridos**: `developers`, `admin`
- **Categoría**: Development
- **Password**: `changeme`

### 6. **Grafana** (test-grafana)
- **Puerto**: 8085
- **URL**: http://localhost:8085
- **Propósito**: Dashboards y métricas
- **Grupos requeridos**: `monitoring`, `admin`
- **Categoría**: Monitoring
- **Configuración**: Auth anónimo habilitado

### 7. **Portainer** (test-portainer)
- **Puerto**: 8086
- **URL**: http://localhost:8086
- **Propósito**: Gestión de contenedores Docker
- **Grupos requeridos**: `admin`
- **Categoría**: Infrastructure

### 8. **Uptime Kuma** (test-uptime-kuma)
- **Puerto**: 8087
- **URL**: http://localhost:8087
- **Propósito**: Monitoreo de uptime
- **Grupos requeridos**: `monitoring`, `admin`
- **Categoría**: Monitoring

### 9. **Wekan** (test-wekan)
- **Puerto**: 8088
- **URL**: http://localhost:8088
- **Propósito**: Tablero Kanban para gestión de proyectos
- **Grupos requeridos**: `project-managers`, `admin`
- **Categoría**: Collaboration
- **Dependencia**: MongoDB (test-wekan-db)

### 10. **Draw.io** (test-drawio)
- **Puerto**: 8089
- **URL**: http://localhost:8089
- **Propósito**: Editor de diagramas
- **Grupos requeridos**: `pomerium-users`, `admin`
- **Categoría**: Tools

## 🚀 Inicio Rápido

### Opción 1: Script Automático (Recomendado)

```bash
# Mapear todos los puertos y levantar contenedores
./scripts/map-docker-ports.sh
```

### Opción 2: Usando Docker Compose

```bash
cd /workspaces/Neoprod/configs/test-apps
docker-compose up -d

# Luego mapear puertos manualmente o modificar docker-compose.yml
```

### Opción 3: Manual

```bash
# Ver contenedores actuales
docker ps -a | grep test-

# Iniciar contenedores individuales
docker start test-app1 test-app2 # etc...
```

## 🖥️ Frontend - Páginas Integradas

### 1. **Dashboard** (`/dashboard`)
- Muestra todas las aplicaciones según los grupos del usuario
- Navegación a Admin Console y Perfil
- Información del usuario autenticado

### 2. **Admin Console** (`/admin`)
- Vista completa de todas las aplicaciones Docker
- Estadísticas de sistema
- Gestión de aplicaciones por categoría
- Acceso directo a cada aplicación
- **Acceso**: Solo usuarios con grupo `admin`

### 3. **Perfil de Usuario** (`/profile`)
- Información personal del usuario
- Grupos y permisos
- Configuración de preferencias:
  - Notificaciones
  - Modo oscuro
  - Idioma
  - Autenticación de dos factores
- Historial de seguridad

## 🔌 Backend API - Endpoints

### Aplicaciones
```
GET /api/v1/applications
GET /api/v1/applications/:id
```

### Admin (requiere grupo `admin`)
```
GET /api/v1/admin/users
GET /api/v1/admin/network/status
POST /api/v1/admin/groups
GET /api/v1/admin/logs
```

### Auth
```
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET /api/v1/auth/me
```

## 👤 Usuario de Prueba Mock

El sistema está configurado con autenticación mock para desarrollo:

```javascript
{
  email: "dev@neogenesys.local",
  name: "Developer User",
  groups: [
    "pomerium-users",
    "app1-users",
    "app2-users",
    "admin",
    "developers",
    "monitoring",
    "project-managers"
  ],
  authMethod: "mock"
}
```

Este usuario tiene acceso a **todas** las aplicaciones.

## 🔐 Flujo de Autenticación

### Modo Mock (Desarrollo)
1. Usuario visita `/` (landing page)
2. Click en "Login" carga usuario mock desde `localStorage`
3. Redirección a `/dashboard`
4. Dashboard muestra apps según grupos

### Modo Producción (Zitadel OIDC)
1. Usuario visita `/`
2. Redirección a Zitadel para login
3. Callback con tokens OIDC
4. Backend valida token
5. Redirección a `/dashboard`

## 🎨 Configuración de Grupos y Permisos

### Grupos Disponibles

| Grupo | Descripción | Aplicaciones |
|-------|-------------|--------------|
| `admin` | Administradores | Todas + Admin Console + File Browser + Portainer |
| `pomerium-users` | Usuarios básicos | Whoami, Draw.io |
| `app1-users` | Usuarios App 1 | Echo Server |
| `app2-users` | Usuarios App 2 | Static Site |
| `developers` | Desarrolladores | VS Code |
| `monitoring` | Monitoreo | Grafana, Uptime Kuma |
| `project-managers` | Gestores de Proyecto | Wekan |

## 🧪 Casos de Prueba

### Test 1: Usuario Admin
```javascript
// Debe ver todas las aplicaciones
// Acceso a /admin
// Acceso a /profile
// Puede gestionar todas las apps
```

### Test 2: Usuario Developer
```javascript
// Ve: VS Code, Whoami, Draw.io, Perfil
// No acceso a /admin
// Acceso a /profile
```

### Test 3: Usuario Monitoring
```javascript
// Ve: Grafana, Uptime Kuma, Whoami, Draw.io, Perfil
// No acceso a /admin
```

## 📊 Monitoreo y Debugging

### Ver estado de contenedores
```bash
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
```

### Logs de aplicaciones
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev

# Contenedor específico
docker logs test-app1 -f
```

### Red Docker
```bash
docker network inspect pomerium-network
```

## 🔧 Troubleshooting

### Problema: Aplicación no accesible
```bash
# Verificar que el contenedor está corriendo
docker ps | grep test-appname

# Verificar puertos mapeados
docker port test-appname

# Reiniciar contenedor
docker restart test-appname
```

### Problema: Frontend no muestra aplicaciones
1. Verificar autenticación en `/dashboard`
2. Revisar grupos del usuario en `localStorage`
3. Verificar backend está corriendo en puerto 3001

### Problema: Backend no conecta a Docker
1. Verificar red `pomerium-network` existe
2. Verificar variables de entorno en `.env`
3. Reiniciar backend

## 📝 Configuración de Variables de Entorno

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_MOCK_AUTH=true
NEXT_PUBLIC_MOCK_USER_EMAIL=dev@neogenesys.local
NEXT_PUBLIC_MOCK_USER_NAME=Developer User
NEXT_PUBLIC_MOCK_USER_GROUPS=pomerium-users,app1-users,app2-users,admin,developers,monitoring,project-managers
```

### Backend (.env)
```env
PORT=3001
NODE_ENV=development
# ... resto de configuración
```

## 🎯 Próximos Pasos

1. **Integrar Pomerium**: Configurar rutas y políticas reales
2. **Conectar Zitadel**: Implementar OIDC real
3. **Añadir persistencia**: Guardar configuraciones en Supabase
4. **Implementar SSO**: Single Sign-On entre aplicaciones
5. **Agregar telemetría**: Métricas y logs centralizados

## 📚 Referencias

- [Docker Compose File](../configs/test-apps/docker-compose.yml)
- [Backend API Routes](../backend/src/api/)
- [Frontend Components](../frontend/src/app/)
- [Credentials](./CREDENTIALS.md)

## ✅ Checklist de Integración

- [x] Contenedores Docker levantados
- [x] Puertos mapeados correctamente
- [x] Backend corriendo en puerto 3001
- [x] Frontend corriendo en puerto 3000
- [x] Dashboard muestra todas las apps
- [x] Admin Console funcional
- [x] Perfil de usuario completo
- [x] Autenticación mock funcionando
- [ ] Integración con Pomerium
- [ ] Integración con Zitadel OIDC
- [ ] Persistencia en Supabase

---

**Última actualización**: 2025-12-04
**Versión**: 1.0.0

# Credenciales y Acceso - Neoprod

## ⚠️ Información Importante

**NO HAY USUARIOS DE PRUEBA PRE-CONFIGURADOS**

Este sistema usa autenticación real contra Zitadel. Debes configurar los usuarios manualmente.

---

## 🔐 Configuración de Acceso

### Pre-requisitos Obligatorios

1. **Netbird VPN activo**
   ```bash
   netbird status
   # Debe mostrar: Status: Connected
   ```

2. **Acceso a Zitadel**: `https://gate.kappa4.com`

---

## 📝 Crear Usuario en Zitadel

### Paso 1: Acceder a Zitadel Admin

1. Ir a: `https://gate.kappa4.com`
2. Iniciar sesión con cuenta de administrador de Zitadel
3. Ir a **Users** → **Create New User**

### Paso 2: Crear Usuario

```
Email: tu-email@ejemplo.com
First Name: Tu Nombre
Last Name: Tu Apellido
Password: [establecer password segura]
```

### Paso 3: Asignar a Grupos

El usuario debe estar en al menos estos grupos:

- `pomerium-users` - Acceso básico al dashboard
- `app1-users` - Acceso a App1 (opcional)
- `app2-users` - Acceso a App2 (opcional)
- `admin` - Acceso administrativo (opcional)

### Paso 4: Configurar MFA (Opcional)

1. Ir a perfil del usuario
2. Activar TOTP (Google Authenticator, Authy, etc.)
3. Escanear código QR con app de autenticación

---

## 🚀 Hacer Login en la Plataforma

### Método 1: SSO con Zitadel (Recomendado)

1. Abrir: `http://localhost:3000`
2. Click en **"Sign in with SSO"**
3. Serás redirigido a Zitadel
4. Ingresar email y password del usuario creado
5. Completar MFA si está habilitado
6. Serás redirigido de vuelta al dashboard

### Método 2: Login Directo (Requiere configuración adicional)

Actualmente no está implementado. Usa SSO.

### Método 3: WebAuthn

⚠️ **NO IMPLEMENTADO AÚN** - El código tiene solo un placeholder.

---

## 🧪 Modo Desarrollo (Sin Zitadel)

Si necesitas desarrollar sin conexión a Zitadel, puedes usar el modo mock:

### ✅ Modo Mock ACTIVADO

El archivo `.env.local` ya incluye:

```bash
NEXT_PUBLIC_MOCK_AUTH=true
NEXT_PUBLIC_MOCK_USER_EMAIL=dev@neogenesys.local
NEXT_PUBLIC_MOCK_USER_NAME=Developer User
NEXT_PUBLIC_MOCK_USER_GROUPS=pomerium-users,app1-users,app2-users,admin
```

### 🔐 Credenciales de Prueba

**Email**: `dev@neogenesys.local`  
**Password**: `dev123`

### 📝 Cómo usar:

1. Abre `http://localhost:3000`
2. Verás un banner verde indicando "MODO DESARROLLO"
3. Ingresa las credenciales:
   - Email: `dev@neogenesys.local`
   - Password: `dev123`
4. O simplemente usa el botón "Sign in with SSO"
5. Serás redirigido al dashboard automáticamente

### 🎯 Características del Modo Mock:

- ✅ Login con password funcional
- ✅ SSO simulado (todos los proveedores)
- ✅ WebAuthn simulado
- ✅ Asignación de grupos automática
- ✅ Dashboard con aplicaciones según grupos
- ✅ No requiere Netbird VPN
- ✅ No requiere conexión a Zitadel

### 🔄 Cambiar entre Mock y Producción:

**Modo Desarrollo (Mock)**:
```bash
NEXT_PUBLIC_MOCK_AUTH=true
```

**Modo Producción (Zitadel Real)**:
```bash
NEXT_PUBLIC_MOCK_AUTH=false
# o simplemente eliminar la línea
```

**NOTA**: ✅ Esta funcionalidad YA está implementada en el código.

### Opción B: Backend Local con Supabase

El backend puede usar Supabase local para desarrollo:

```bash
cd backend
npm run dev
```

---

## 🔧 Troubleshooting

### Error: "Cannot connect to Zitadel"

**Causa**: No estás conectado a Netbird VPN

**Solución**:
```bash
netbird status
# Si no está conectado:
netbird up --setup-key <TU_SETUP_KEY>
```

### Error: "Invalid credentials"

**Causa**: Usuario no existe en Zitadel o password incorrecta

**Solución**: 
1. Verificar que el usuario existe en Zitadel
2. Resetear password si es necesario
3. Verificar que Netbird está conectado

### Error: "Access Denied"

**Causa**: Usuario no está en el grupo `pomerium-users`

**Solución**:
1. Ir a Zitadel admin
2. Agregar usuario al grupo `pomerium-users`
3. Volver a intentar login

### WebAuthn no funciona

**Causa**: No está implementado todavía

**Solución**: Usar SSO method por ahora

---

## 📋 Checklist de Verificación

Antes de intentar login, verificar:

- [ ] Netbird VPN conectado (`netbird status`)
- [ ] Usuario creado en Zitadel (`https://gate.kappa4.com`)
- [ ] Usuario en grupo `pomerium-users`
- [ ] Frontend corriendo (`http://localhost:3000`)
- [ ] Backend corriendo (`http://localhost:3001`)
- [ ] Variables de entorno configuradas

---

## 🔗 URLs Importantes

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Zitadel**: https://gate.kappa4.com
- **Netbird Dashboard**: https://gate.kappa4.com (puerto de Netbird)

---

## 👨‍💼 Usuarios Administrativos

Para crear el primer usuario administrador:

1. Acceder directamente a Zitadel: `https://gate.kappa4.com`
2. Usar credenciales de instalación de Zitadel (consultar con DevOps)
3. Crear usuario con rol de admin
4. Asignar a grupo `admin` y `pomerium-users`

---

## 📞 Soporte

Si tienes problemas:

1. Revisar logs del backend: `cd backend && npm run dev`
2. Revisar logs del frontend: `cd frontend && npm run dev`
3. Revisar documentación: `docs/setup-guide.md`
4. Verificar Netbird: `netbird status`

---

**Última actualización**: Diciembre 2025

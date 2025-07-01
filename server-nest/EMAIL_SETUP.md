# 📧 Sistema de Emails - LifeHub

Este documento explica cómo configurar y usar el sistema de emails de LifeHub.

## 🚀 Flujos de Email Implementados

### ✅ Flujos Funcionales

1. **Registro de usuario** → Correo de bienvenida + Verificación de email
2. **Verificación de email** → Token de verificación (24h de expiración)
3. **Reenvío de verificación** → Nuevo token de verificación
4. **Recuperación de contraseña** → Token de reset (1h de expiración)
5. **Confirmación de reset** → Actualización de contraseña
6. **Activación de 2FA** → Código de 6 dígitos (10min de expiración)
7. **Verificación de 2FA** → Habilitación de autenticación de dos factores
8. **Actualización de plan** → Confirmación de cambio de plan

## ⚙️ Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la carpeta `server-nest/` con las siguientes variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/habitkit

# JWT
JWT_SECRET=tu_secreto_jwt_super_seguro_aqui

# Email Configuration
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_de_aplicacion
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Environment
NODE_ENV=development
PORT=3001
```

### 2. Configuración de Gmail

Para usar Gmail como proveedor de email:

1. **Habilita la verificación en 2 pasos** en tu cuenta de Google
2. **Genera una contraseña de aplicación**:
   - Ve a Configuración de Google Account
   - Seguridad → Verificación en 2 pasos
   - Contraseñas de aplicación → Generar nueva
3. **Usa esa contraseña** en `EMAIL_PASS`

### 3. Otros Proveedores

#### SendGrid
```env
SENDGRID_API_KEY=tu_api_key_de_sendgrid
```

#### Mailgun
```env
MAILGUN_API_KEY=tu_api_key_de_mailgun
MAILGUN_DOMAIN=tu_dominio.mailgun.org
```

#### AWS SES
```env
AWS_SES_ACCESS_KEY_ID=tu_access_key
AWS_SES_SECRET_ACCESS_KEY=tu_secret_key
AWS_SES_REGION=us-east-1
```

## 🧪 Pruebas

### 1. Probar el Sistema de Emails

```bash
cd server-nest
node test-email.js
```

Este script enviará un email de prueba a tu dirección configurada.

### 2. Probar Flujos Completos

#### Registro y Verificación
1. Registra un nuevo usuario en `/register`
2. Revisa tu email para el correo de bienvenida
3. Haz clic en el enlace de verificación
4. Verifica que el usuario aparezca como verificado

#### Reset de Contraseña
1. Ve a `/reset-password`
2. Ingresa tu email
3. Revisa tu email para el enlace de reset
4. Haz clic en el enlace y establece una nueva contraseña

#### 2FA
1. Ve a `/account` → Seguridad
2. Haz clic en "Configurar 2FA"
3. Revisa tu email para el código
4. Ingresa el código para habilitar 2FA

## 📋 Endpoints de Email

### Auth Endpoints

```typescript
// Registro (envía emails automáticamente)
POST /api/auth/register
{
  "name": "Usuario",
  "email": "usuario@email.com",
  "password": "password123"
}

// Verificación de email
POST /api/auth/verify-email
{
  "token": "token_de_verificacion"
}

// Reenvío de verificación
POST /api/auth/resend-verification
{
  "email": "usuario@email.com"
}

// Reset de contraseña
POST /api/auth/reset-password
{
  "email": "usuario@email.com"
}

// Confirmar reset de contraseña
POST /api/auth/confirm-password-reset
{
  "token": "token_de_reset",
  "newPassword": "nueva_password123"
}

// Habilitar 2FA
POST /api/auth/enable-2fa
Authorization: Bearer <token>

// Verificar 2FA
POST /api/auth/verify-2fa
Authorization: Bearer <token>
{
  "code": "123456"
}
```

## 🎨 Templates de Email

### Templates Disponibles

1. **Welcome Email** - Correo de bienvenida con información de la plataforma
2. **Verification Email** - Verificación de cuenta con enlace de 24h
3. **Password Reset Email** - Reset de contraseña con enlace de 1h
4. **Two Factor Email** - Código 2FA de 6 dígitos válido por 10min
5. **Plan Update Email** - Confirmación de actualización de plan

### Personalización

Los templates están en `src/email/email.service.ts` y pueden ser personalizados:

- **Colores**: Cambia los gradientes en los headers
- **Logo**: Agrega tu logo en los templates
- **Contenido**: Modifica el texto y estructura
- **Estilos**: Ajusta CSS inline para compatibilidad

## 🔒 Seguridad

### Tokens y Expiración

- **Verificación de email**: 24 horas
- **Reset de contraseña**: 1 hora
- **Código 2FA**: 10 minutos
- **JWT tokens**: 7 días

### Validaciones

- Emails únicos en la base de datos
- Verificación de email requerida para login
- Tokens únicos y seguros (crypto.randomBytes)
- Limpieza automática de tokens expirados

## 🚀 Producción

### Configuración Recomendada

1. **Usa un proveedor de email profesional**:
   - SendGrid (recomendado)
   - Mailgun
   - AWS SES

2. **Configuración de dominio**:
   - SPF records
   - DKIM
   - DMARC

3. **Monitoreo**:
   - Logs de envío
   - Métricas de entrega
   - Alertas de errores

### Variables de Producción

```env
NODE_ENV=production
FRONTEND_URL=https://tu-dominio.com
EMAIL_USER=noreply@tu-dominio.com
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
```

## 🐛 Troubleshooting

### Errores Comunes

#### Error de Autenticación (EAUTH)
```
❌ Error: Invalid login
```
**Solución**: Verifica EMAIL_USER y EMAIL_PASS. Para Gmail, usa contraseña de aplicación.

#### Error de Conexión (ECONNECTION)
```
❌ Error: Connection timeout
```
**Solución**: Verifica SMTP_HOST, SMTP_PORT y conexión a internet.

#### Emails no llegan
**Solución**:
1. Revisa carpeta de spam
2. Verifica configuración SMTP
3. Usa un proveedor de email profesional

### Logs

Los logs de email se muestran en la consola del servidor:
```
[EmailService] Email sent: <messageId>
[EmailService] Failed to send email: <error>
```

## 📞 Soporte

Si tienes problemas con el sistema de emails:

1. Ejecuta `node test-email.js` para diagnosticar
2. Revisa los logs del servidor
3. Verifica la configuración de variables de entorno
4. Contacta al equipo de desarrollo

---

**¡El sistema de emails está listo para producción! 🎉** 
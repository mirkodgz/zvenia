# 📧 Template de Email de Migración - ZVENIA

## 🎯 Objetivo
Comunicar a los 1,500 usuarios migrados que deben resetear su contraseña para acceder a la nueva plataforma.

---

## 📝 Template de Email (HTML)

### Asunto (Subject):
```
Welcome to the New ZVENIA Platform - Reset Your Password
```

### Cuerpo del Email:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ZVENIA</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #202124; max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #0d241b; font-size: 28px; margin-bottom: 10px;">Welcome to the New ZVENIA</h1>
        <p style="color: #00c44b; font-size: 16px; font-weight: 600;">Only Expert Knowledge</p>
    </div>

    <!-- Main Content -->
    <div style="background-color: #f3f3f3; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #0d241b; font-size: 20px; margin-top: 0;">We've Upgraded Your Platform</h2>
        
        <p style="font-size: 15px; color: #202124;">
            Dear [FIRST_NAME],
        </p>
        
        <p style="font-size: 15px; color: #202124;">
            We're excited to announce that ZVENIA has been upgraded to a new, more powerful platform! 
            This upgrade brings you:
        </p>
        
        <ul style="font-size: 15px; color: #202124; padding-left: 20px;">
            <li>Faster performance and better user experience</li>
            <li>Enhanced security and privacy features</li>
            <li>New tools and features for the mining community</li>
            <li>Improved content discovery and networking</li>
        </ul>
        
        <p style="font-size: 15px; color: #202124; margin-top: 20px;">
            <strong>To access your account, you'll need to reset your password.</strong> 
            This is a one-time security measure to ensure your account is fully protected on our new platform.
        </p>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 30px 0;">
        <a href="[RESET_PASSWORD_LINK]" 
           style="display: inline-block; background-color: #00c44b; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
            Reset Your Password
        </a>
    </div>

    <!-- Alternative Link -->
    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; margin-bottom: 20px;">
        <p style="font-size: 13px; color: #666; margin: 0;">
            If the button doesn't work, copy and paste this link into your browser:
        </p>
        <p style="font-size: 13px; color: #00c44b; word-break: break-all; margin: 5px 0 0 0;">
            [RESET_PASSWORD_LINK]
        </p>
    </div>

    <!-- Help Section -->
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #0d241b; font-size: 16px; margin-top: 0;">Need Help?</h3>
        <p style="font-size: 14px; color: #202124; margin-bottom: 10px;">
            If you have any questions or need assistance, please don't hesitate to contact us:
        </p>
        <p style="font-size: 14px; color: #202124; margin: 0;">
            📧 <a href="mailto:contact@zvenia.com" style="color: #00c44b; text-decoration: none;">contact@zvenia.com</a>
        </p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
        <p style="font-size: 12px; color: #666; margin: 5px 0;">
            ZVENIA © 2026 All Rights Reserved.
        </p>
        <p style="font-size: 12px; color: #666; margin: 5px 0;">
            This is an automated email. Please do not reply to this message.
        </p>
    </div>

</body>
</html>
```

---

## 📋 Versión Texto Plano (Plain Text)

```
Welcome to the New ZVENIA Platform

Dear [FIRST_NAME],

We're excited to announce that ZVENIA has been upgraded to a new, more powerful platform!

This upgrade brings you:
- Faster performance and better user experience
- Enhanced security and privacy features
- New tools and features for the mining community
- Improved content discovery and networking

To access your account, you'll need to reset your password. This is a one-time security measure to ensure your account is fully protected on our new platform.

Reset Your Password:
[RESET_PASSWORD_LINK]

If the link doesn't work, copy and paste it into your browser.

Need Help?
If you have any questions or need assistance, please contact us at contact@zvenia.com

Best regards,
The ZVENIA Team

---
ZVENIA © 2026 All Rights Reserved.
This is an automated email. Please do not reply to this message.
```

---

## 🎨 Características del Template

✅ **Tono profesional pero amigable** (similar a LinkedIn)
✅ **Explicación clara** del por qué necesitan resetear
✅ **CTA prominente** (botón verde)
✅ **Link alternativo** por si el botón no funciona
✅ **Información de contacto** para soporte
✅ **Branding consistente** (colores ZVENIA)

---

## 📊 Estrategia de Envío

### Opción 1: Envío Masivo (Recomendado)
- **Herramienta:** Resend, SendGrid, o Mailgun
- **Timing:** Enviar 1-2 semanas ANTES del lanzamiento
- **Segmentación:** Todos los usuarios migrados
- **Follow-up:** Recordatorio a los que no han reseteado después de 1 semana

### Opción 2: Envío Progresivo
- **Día 1:** 500 usuarios (test)
- **Día 2:** 500 usuarios
- **Día 3:** 500 usuarios
- **Ventaja:** Evita sobrecarga del sistema de reset

### Opción 3: Envío al Intentar Login
- **Trigger:** Cuando usuario intenta login y falla
- **Ventaja:** Solo envía a usuarios activos
- **Desventaja:** Usuarios no saben que deben resetear hasta que intentan

---

## 🔧 Implementación Técnica

### Variables a Reemplazar:
- `[FIRST_NAME]` → Nombre del usuario
- `[RESET_PASSWORD_LINK]` → Link único de reset generado por Supabase

### Link de Reset:
```
https://zvenia.com/reset-password?token=[TOKEN]
```

O mejor aún, usar el link directo de Supabase que expira en 1 hora.

---

## 💡 Recomendación Final

**Estrategia Híbrida:**

1. **Email Proactivo** (1 semana antes):
   - Enviar a TODOS los usuarios
   - Explicar la migración
   - Proporcionar link de reset

2. **Mensaje de Error Mejorado** (en login):
   - Si intentan login y falla
   - Mostrar mensaje claro: "Your password needs to be reset due to our platform upgrade"
   - Link directo a "Reset Password"

3. **Banner en el sitio** (opcional):
   - Banner en homepage para usuarios no logueados
   - "We've upgraded! Reset your password to continue"

---

¿Quieres que implemente alguna de estas opciones?


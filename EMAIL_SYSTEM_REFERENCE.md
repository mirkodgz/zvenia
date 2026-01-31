# 📧 Documentación del Sistema de Emails - ZVENIA

> **Documento de Referencia**  
> *Última actualización: 31 de enero de 2026*

Este documento describe toda la infraestructura, configuración y comportamiento del sistema de correos electrónicos de la plataforma ZVENIA.

---

## 1. Infraestructura y Configuración

Utilizamos **Resend** para correos personalizados y transaccionales, mientras que **Supabase Auth** gestiona los correos estándar de autenticación.

### **Variables de Configuración**
Estas se encuentran en tu archivo `.env`:
*   `RESEND_API_KEY`: Clave API para conectar con Resend.
*   `VERIFIED_EMAIL`: La dirección de envío (ej. `mirko@dgzconsulting.com` o `contact@zvenia.com`). Si no se define, usa `onboarding@resend.dev` (Modo Prueba).
*   `PUBLIC_SUPABASE_URL`: Enlace a tu proyecto de Supabase.
*   `SUPABASE_SERVICE_ROLE_KEY`: Permite acciones administrativas (como generar enlaces de reset manualmente).

### **¿Quién envía y cómo?**
1.  **Emails Estándar de Autenticación** (Registro, Olvidé Contraseña):  
    *   **Remitente:** **Supabase** (SMTP interno o configurado).
    *   **Activador:** Métodos nativos de Supabase (`signUp`, `resetPasswordForEmail`).
    *   **Plantilla:** Se gestionan en el **Dashboard de Supabase**.
2.  **Emails de Migración / Personalizados**:  
    *   **Remitente:** **Resend** (vía API).
    *   **Activador:** Rutas de API personalizadas (ej. `send-migration-email.ts`).
    *   **Plantilla:** Código HTML incrustado en el proyecto.

---

## 2. Lista de Emails y Plantillas

| Tipo de Email | Activador | Proveedor | Ubicación de Plantilla | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **Bienvenida / Confirmación** | Usuario se registra | Supabase | Dashboard Supabase > Auth > Templates | ✅ Activo |
| **Reset Password (Estándar)** | Formulario "Olvidé mi clave" | Supabase | Dashboard Supabase > Auth > Templates | ✅ Activo |
| **Reset Password Migración** | Activador manual o **Login fallido** | Resend | `src/pages/api/auth/send-migration-email.ts` | 🛠 Híbrido |
| **Magic Link** | Login (si está activo) | Supabase | Dashboard Supabase | ⏸ Pasivo |

---

## 3. Comportamientos del Sistema

### **A. Usuario crea una cuenta (Registro)**
*   **Acción:** El usuario completa el formulario en `/signup`.
*   **Resultado:** 
    1.  La API llama a `supabase.auth.signUp`.
    2.  El usuario es redirigido a `/verify-email`.
    3.  **Supabase** envía el mensaje "Confirma tu Email".
    4.  El usuario debe hacer clic en el enlace para activar la cuenta.

### **B. El usuario inicia sesión (Login)**
*   **Escenario Normal:**
    *   **Acción:** El usuario entra en `/login`.
    *   **Resultado:** Login exitoso. **NO se envía email.**

*   **Escenario de Migración (Lógica Crítica):**
    *   **Acción:** Un usuario migrado intenta entrar y falla ("Invalid login credentials").
    *   **Comprobación:** El código verifica si el email existe en la tabla `profiles`.
    *   **Resultado:** Si el usuario existe pero el login falló (aún no ha reseteado su clave):
        *   El sistema **llama AUTOMÁTICAMENTE** a `/api/auth/send-migration-email`.
        *   **Resend** envía el email de "Bienvenido a la nueva ZVENIA - Restablece tu clave".
        *   El usuario ve un mensaje: *"¡Nos hemos mudado! Necesitas resetear tu clave..."*

### **C. Acción de Migración Admin (Manual)**
*   **Acción:** El administrador lanza el script de migración.
*   **Resultado:**
    1.  El sistema genera un enlace de recuperación.
    2.  **Resend** envía el email personalizado con el nombre del usuario.

### **D. Acciones de Admin en Dashboard**
*   **Acción:** Crear usuario, borrar o marcar como "Popular".
*   **Resultado:**
    *   **Borrar/Popular:** **NO se envía email.**
    *   **Crear Usuario (Admin):** Se crea con `email_confirm: true` (autoconfirmado). **NO se envía email.**

---

## 4. Sistema Centralizado de Diseño

Hemos implementado un sistema para que todos los correos tengan la misma imagen profesional (Header verde oscuro, Footer legal).

### **Emails desde el Código (Resend)**
Usan la utilidad `wrapEmailLayout` en `src/lib/email.ts`.

### **Plantillas de Supabase (Actualización Manual)**
Para que coincidan, copia estos bloques en [Supabase Email Templates](https://supabase.com/dashboard/project/_/auth/templates):

**Header HTML (Pegar al inicio):**
```html
<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; font-family: sans-serif;">
  <div style="padding: 40px 20px; text-align: center; background-color: #0d241b;">
    <h1 style="color: #ffffff; font-size: 28px; font-weight: bold; letter-spacing: 2px; margin: 0; text-transform: uppercase;">ZVENIA</h1>
    <div style="color: #00c44b; font-size: 14px; font-weight: 600; margin-top: 5px; letter-spacing: 1px;">SOLO CONOCIMIENTO EXPERTO</div>
  </div>
  <div style="padding: 40px 30px; line-height: 1.6; color: #202124;">
```

**Footer HTML (Pegar al final):**
```html
  </div>
  <div style="padding: 30px 20px; text-align: center; background-color: #f8f9fa; border-top: 1px solid #eeeeee;">
    <p style="font-size: 12px; color: #666666; margin: 5px 0;"><strong>ZVENIA © 2026</strong></p>
    <p style="font-size: 11px; color: #999999; margin-top: 15px;">Este es un mensaje automático. Por favor, no respondas directamente a este correo.</p>
  </div>
</div>
```

---

## 5. Solución de Problemas

*   **"No recibo correos"**:
    *   Revisa `RESEND_API_KEY` en tu entorno (Vercel/Local).
    *   Mira la carpeta de SPAM (especialmente si usas `onboarding@resend.dev`).
    *   Verifica que tu dominio esté validado en el Dashboard de Resend.
*   **"Los enlaces no funcionan"**:
    *   Revisa `emailRedirectTo` en `signup.ts`.
    *   Comprueba la variable `origin` en `send-migration-email.ts`.

---
*Generado por Agente Antigravity - Mantén este archivo como referencia.*

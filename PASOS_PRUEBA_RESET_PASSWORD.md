# 🧪 Pasos para Probar Reset de Password - Desde Cero

## ✅ Flujo Completo de Prueba

### Paso 1: Intentar Login (Con Contraseña Antigua)
1. Ve a `http://localhost:4321/login`
2. Ingresa:
   - Email: `g.zvenia@gmail.com`
   - Password: Tu contraseña antigua (la que recuerdas)
3. Click en "Log In"

**Resultado esperado:**
- ❌ Error de login
- ✅ Mensaje azul: "We've migrated to a new platform! Your password needs to be reset. We've sent you an email with instructions to reset your password."
- 📧 Email enviado automáticamente

---

### Paso 2: Revisar Email
1. Revisa tu bandeja de entrada de `mirko@dgzconsulting.com` (o `g.zvenia@gmail.com` si tienes dominio verificado)
2. Busca el email con asunto: "Welcome to the New ZVENIA Platform - Reset Your Password"
3. Abre el email

**Resultado esperado:**
- ✅ Email con diseño profesional
- ✅ Botón verde "Reset Your Password"
- ✅ Link alternativo si el botón no funciona

---

### Paso 3: Hacer Click en "Reset Your Password"
1. Haz click en el botón verde "Reset Your Password" del email
2. O copia el link alternativo y pégalo en el navegador

**Resultado esperado:**
- ✅ Redirige a `http://localhost:4321/reset-password#access_token=...`
- ✅ La página detecta el token automáticamente
- ✅ El hash se limpia de la URL (solo queda `/reset-password`)

---

### Paso 4: Establecer Nueva Contraseña
1. En la página `/reset-password`, ingresa:
   - New Password: Tu nueva contraseña (mínimo 6 caracteres)
   - Confirm Password: La misma contraseña
2. Click en "Update Password"

**Resultado esperado:**
- ✅ Mensaje verde: "Password updated successfully! Redirecting to your profile..."
- ✅ Redirige automáticamente a `/dashboard/profile` después de 2 segundos

---

### Paso 5: Verificar en User Area
1. Serás redirigido a `/dashboard/profile`
2. Verás tu perfil de usuario
3. Ya estás logueado, no necesitas volver a iniciar sesión

**Resultado esperado:**
- ✅ Página de perfil cargada
- ✅ Información del usuario visible
- ✅ Header muestra tu nombre y avatar

---

### Paso 6: Probar Login con Nueva Contraseña (Opcional)
1. Haz "Sign Out" desde el header
2. Ve a `/login`
3. Ingresa:
   - Email: `g.zvenia@gmail.com`
   - Password: Tu nueva contraseña
4. Click en "Log In"

**Resultado esperado:**
- ✅ Login exitoso
- ✅ Redirige a la homepage o a tu área de usuario

---

## 🔧 Si Algo Falla

### Error: "sessionEstablished is not defined"
- ✅ **Ya corregido** - Recarga la página

### Error: "Invalid or expired reset link"
- El token expiró (válido por 1 hora)
- Solución: Intenta login de nuevo para recibir un nuevo email

### Error: "You must be logged in to reset your password"
- El token no se procesó correctamente
- Solución: Recarga la página o intenta login de nuevo

### No llega el email
- Revisa spam
- Verifica que Resend esté configurado correctamente
- El email puede tardar hasta 5 minutos

---

## 📝 Notas Importantes

1. **El token expira en 1 hora** - Si pasó mucho tiempo, necesitas un nuevo email
2. **El email llega a `mirko@dgzconsulting.com`** (tu email verificado) hasta que verifiques el dominio
3. **El link de reset es para `g.zvenia@gmail.com`** - Funciona correctamente aunque el email llegue a otro destinatario
4. **Después de resetear, ya estás logueado** - No necesitas volver a iniciar sesión

---

¿Listo para probar desde cero?


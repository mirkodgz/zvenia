# 🧪 Test Email - Roberto123@gmail.com

## 🎯 Objetivo

Probar la experiencia completa del usuario:
1. Recibir el email de migración
2. Ver cómo se ve el email
3. Hacer click en el botón de reset
4. Ver si redirige correctamente a `/reset-password`
5. Establecer nueva contraseña
6. Iniciar sesión con la nueva contraseña

---

## 🚀 Ejecutar Test

```bash
npm run test-email
```

Esto enviará un email **REAL** a `Roberto123@gmail.com`.

---

## 📋 Lo que pasará:

1. **Script busca** el usuario `Roberto123@gmail.com` en Supabase
2. **Genera** un link único de reset de password
3. **Envía** el email usando Resend
4. **Muestra** el link en consola

---

## 📧 Después del envío:

1. **Revisa tu bandeja de entrada** (y spam) de `Roberto123@gmail.com`
2. **Abre el email** - Verás el diseño completo
3. **Haz click** en el botón verde "Reset Your Password"
4. **Serás redirigido** a `http://localhost:4321/reset-password?token=...`
5. **Establece** tu nueva contraseña
6. **Inicia sesión** con tu nueva contraseña en `/login`

---

## ✅ Verificar que funciona:

- [ ] Email llegó a la bandeja de entrada
- [ ] El diseño del email se ve bien
- [ ] El botón "Reset Your Password" funciona
- [ ] Redirige a `/reset-password`
- [ ] Puedo establecer nueva contraseña
- [ ] Puedo iniciar sesión con la nueva contraseña

---

## 🔧 Si el usuario no existe:

El script te dirá:
```
❌ Usuario Roberto123@gmail.com no encontrado en Supabase
```

**Solución:** Verifica que el email sea correcto o crea el usuario primero.

---

¿Listo para probar? Ejecuta: `npm run test-email`


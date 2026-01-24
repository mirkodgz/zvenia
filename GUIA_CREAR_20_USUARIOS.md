# 📋 Guía: Crear los 20 Usuarios Pendientes

## 🎯 Opciones Disponibles

### Opción 1: Crear Uno por Uno (Recomendado para Revisar)

**Script:** `scripts/create_single_user.ts`

**Uso:**
```bash
npx tsx scripts/create_single_user.ts email@example.com
```

**Ventajas:**
- ✅ Puedes revisar cada usuario antes de crearlo
- ✅ Ver errores específicos por usuario
- ✅ Más control

**Ejemplo:**
```bash
npx tsx scripts/create_single_user.ts 2112845388@qq.com
```

---

### Opción 2: Crear Todos Automáticamente

**Script:** `scripts/create_all_pending_users.ts`

**Uso:**
```bash
npx tsx scripts/create_all_pending_users.ts
```

**Ventajas:**
- ✅ Crea los 20 usuarios de una vez
- ✅ Más rápido
- ✅ Muestra resumen al final

**⚠️ Nota:** Si algún usuario falla, el script continúa con los demás.

---

## 🔐 Sobre las Passwords

### ✅ Recomendación: NO Generar Passwords

**Razón:**
- Estás en migración final
- Todos los usuarios necesitarán resetear password
- Es más seguro

**Proceso:**
1. Script crea usuario en `auth.users` (sin password o password temporal)
2. Usuario intenta hacer login
3. Usuario usa "Forgot Password"
4. Supabase envía email automáticamente
5. Usuario crea nueva contraseña

**✅ No necesitas:**
- ❌ Generar passwords manualmente
- ❌ Enviar emails con passwords
- ❌ Gestionar passwords temporales

---

## 📧 Notificación (Opcional)

Si quieres notificar a los usuarios, puedes enviar un email genérico:

**Template:**
```
Hola,

Tu cuenta ha sido migrada a la nueva plataforma ZVENIA.

Para acceder:
1. Ve a: https://zvenia.com/login
2. Click en "Forgot Password"
3. Ingresa tu email: [su-email]
4. Sigue las instrucciones para crear una nueva contraseña

Si tienes problemas, contáctanos.

Saludos,
Equipo ZVENIA
```

---

## ✅ Checklist

- [ ] Decidir método (uno por uno vs todos)
- [ ] Ejecutar script(s)
- [ ] Verificar usuarios creados
- [ ] (Opcional) Enviar email de notificación
- [ ] Probar login con algunos usuarios

---

## 🎯 Mi Recomendación

**Para tu caso (migración final):**

1. ✅ **Usar Opción 2** (crear todos automáticamente)
2. ✅ **NO generar passwords** - dejar que usen "Forgot Password"
3. ✅ **Verificar** que se crearon correctamente
4. ✅ (Opcional) Enviar email genérico informando la migración

**¿Quieres que ejecute el script para crear los 20 usuarios ahora?**

---

**Última actualización:** 22/01/2026


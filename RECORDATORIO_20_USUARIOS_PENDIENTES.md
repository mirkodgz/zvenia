# 📋 Recordatorio: 20 Usuarios Pendientes de Crear

## 📊 Situación

- **Total usuarios procesados:** 1,553
- **Usuarios actualizados:** 1,533 ✅
- **Usuarios nuevos pendientes:** 20 ❌

---

## 📝 Lista de 20 Usuarios Pendientes

1. `2112845388@qq.com`
2. `aaboelazayem@aga.gold`
3. `bosworthnak1804@gmail.com`
4. `elhadjousmanesam@gmail.com`
5. `elizabethmthimunye5@gmail.com`
6. `esperencesarl@gmail.com`
7. `estrellapomastilver@gmail.com`
8. `falekehakim@gmail.com`
9. `iganu76@gmail.com`
10. `jotamonteci@gmail.com`
11. `kananijosue869@gmail.com`
12. `kepasnenga30@gmail.com`
13. `lilianchinyandura610@gmail.com`
14. `mengdan@daoyuntech.com`
15. `mmh9932@gmail.com`
16. `niutao185571863@gmail.com`
17. `peter.sampson@jescomcapital.com`
18. `ronnieuta@gmail.com`
19. `team@dgzconsulting.com`
20. `www.michaelchami20@gmail.com`

---

## 🤔 ¿Qué Hacer con Estos Usuarios?

### Opción 1: Agregarlos Manualmente (Recomendado)

**Ventajas:**
- ✅ Control total sobre el proceso
- ✅ Puedes verificar cada usuario antes de crearlo
- ✅ Puedes revisar si realmente son usuarios nuevos o duplicados

**Proceso:**
1. Verificar en WordPress si estos usuarios realmente existen
2. Si existen, crear manualmente en Supabase Dashboard
3. O usar el script de creación individual

**Cuándo usar:**
- Si quieres revisar cada usuario antes de crearlo
- Si sospechas que algunos pueden ser duplicados
- Si prefieres tener control total

---

### Opción 2: Generar Passwords y Enviar Emails (Automático)

**Ventajas:**
- ✅ Proceso automático
- ✅ Los usuarios reciben su password por email
- ✅ Más rápido

**Desventajas:**
- ⚠️ Necesitas configurar envío de emails
- ⚠️ Los usuarios pueden no recibir el email (spam, etc.)
- ⚠️ Menos control

**Cuándo usar:**
- Si tienes sistema de emails configurado
- Si quieres automatizar todo
- Si confías en que los emails llegarán

---

### Opción 3: Forzar Reset de Password (Recomendado para Migración)

**Ventajas:**
- ✅ Más seguro (no envías passwords por email)
- ✅ Los usuarios usan "Forgot Password" cuando quieran
- ✅ No necesitas generar passwords

**Proceso:**
1. Crear usuarios en Supabase (sin password o password temporal)
2. Los usuarios usan "Forgot Password" cuando intenten hacer login
3. Reciben email de reset automáticamente desde Supabase

**Cuándo usar:**
- ✅ **RECOMENDADO para migración final**
- Si estás en fase final de migración
- Si quieres que todos los usuarios reseteen su password

---

## 🎯 Recomendación Final

### Para Migración Final: **Opción 3 (Forzar Reset)**

**Razón:**
- Estás en fase final de migración de WordPress a Astro
- Todos los usuarios necesitarán resetear password de todas formas
- Es más seguro y consistente

**Proceso Recomendado:**

1. **Crear usuarios manualmente** (uno por uno o en batch)
   - Usar Supabase Dashboard → Authentication → Users → Add User
   - O usar script automatizado

2. **NO generar password**
   - Dejar que el usuario use "Forgot Password"
   - Supabase enviará email automáticamente

3. **Crear perfil en `profiles`**
   - Con todos los datos del CSV
   - Usar el script de creación individual

---

## 🔧 Script para Crear Usuarios Individuales

He creado un script que puedes usar para crear estos usuarios uno por uno:

**Archivo:** `scripts/create_single_user.ts`

**Uso:**
```bash
npx tsx scripts/create_single_user.ts email@example.com
```

---

## 📧 Notificación a Usuarios (Opcional)

Si decides notificar a los usuarios, puedes enviar un email genérico:

**Template sugerido:**
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

- [ ] Revisar lista de 20 usuarios
- [ ] Verificar en WordPress si realmente son usuarios nuevos
- [ ] Decidir método de creación (manual vs automático)
- [ ] Crear usuarios en Supabase
- [ ] Crear perfiles en `profiles` con datos del CSV
- [ ] (Opcional) Enviar email de notificación
- [ ] Verificar que los usuarios pueden hacer login

---

## 🎯 Conclusión

**Para tu caso (migración final):**

1. ✅ **Crear usuarios manualmente** en Supabase Dashboard
2. ✅ **NO generar passwords** - dejar que usen "Forgot Password"
3. ✅ **Crear perfiles** con datos del CSV (puedo crear un script para esto)
4. ✅ (Opcional) Enviar email genérico informando la migración

**¿Quieres que cree un script para crear estos 20 usuarios automáticamente?**

---

**Última actualización:** 22/01/2026


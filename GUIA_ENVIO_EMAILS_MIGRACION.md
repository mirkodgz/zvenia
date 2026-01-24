# 📧 Guía: Envío de Emails de Migración - ZVENIA

## 📅 Fechas Importantes
- **Envío de emails:** 20 de febrero, 2026
- **Lanzamiento de ZVENIA v3:** 29 de febrero, 2026

---

## 🚀 Paso 1: Configurar Resend

### 1.1 Crear cuenta en Resend
1. Ve a https://resend.com
2. Crea una cuenta (gratis hasta 3,000 emails/mes)
3. Verifica tu dominio `zvenia.com` (o usa el dominio por defecto de Resend)

### 1.2 Obtener API Key
1. Ve a https://resend.com/api-keys
2. Crea una nueva API Key
3. Copia la key (solo se muestra una vez)

### 1.3 Configurar en `.env`
Agrega esta línea a tu archivo `.env`:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

### 1.4 Verificar dominio (Opcional pero recomendado)
Para usar `noreply@zvenia.com` en lugar de `noreply@resend.dev`:
1. Ve a https://resend.com/domains
2. Agrega tu dominio `zvenia.com`
3. Configura los registros DNS que te proporciona Resend
4. Espera a que se verifique (puede tardar hasta 24 horas)

---

## 🧪 Paso 2: Prueba con 10 Usuarios

### 2.1 Modo Test
```bash
# Configurar modo test en .env
TEST_MODE=true
DRY_RUN=false

# Ejecutar script
npm run tsx scripts/send_migration_emails_resend.ts
```

Esto enviará emails reales a solo 10 usuarios para probar.

### 2.2 Verificar
- ✅ Revisa tu bandeja de entrada (y spam)
- ✅ Verifica que el link de reset funciona
- ✅ Revisa el diseño del email
- ✅ Verifica que el texto es correcto

### 2.3 Ajustar si es necesario
Si necesitas cambiar algo en el template, edita:
- `scripts/send_migration_emails_resend.ts` → Función `getEmailTemplate()`

---

## 📊 Paso 3: Envío Masivo (20 de febrero)

### 3.1 Preparación
```bash
# Asegúrate de tener en .env:
RESEND_API_KEY=tu_api_key_aqui
TEST_MODE=false  # Procesar TODOS los usuarios
DRY_RUN=false    # Enviar emails reales
```

### 3.2 Ejecutar envío masivo
```bash
npm run tsx scripts/send_migration_emails_resend.ts
```

### 3.3 Monitorear progreso
El script mostrará:
- ✅ Emails enviados exitosamente
- ❌ Errores (si los hay)
- 📊 Resumen final

### 3.4 Rate Limits de Resend
- **Plan gratuito:** 100 emails/segundo
- **Plan Pro:** 1,000 emails/segundo

Para 1,500 usuarios:
- **Tiempo estimado:** ~15 segundos (plan gratuito)
- **Tiempo estimado:** ~2 segundos (plan Pro)

---

## 📈 Paso 4: Seguimiento (Después del envío)

### 4.1 Monitorear en Resend Dashboard
1. Ve a https://resend.com/emails
2. Revisa:
   - Tasa de entrega
   - Tasa de apertura (si tienes tracking)
   - Emails rebotados

### 4.2 Enviar Recordatorio (Opcional)
1 semana después (27 de febrero), enviar recordatorio a usuarios que no han reseteado:
```bash
# Crear script de recordatorio (similar pero con mensaje diferente)
npm run tsx scripts/send_reminder_emails.ts
```

---

## ⚠️ Consideraciones Importantes

### Seguridad
- ✅ **NO** compartas tu `RESEND_API_KEY` públicamente
- ✅ Usa variables de entorno (`.env`)
- ✅ Agrega `.env` a `.gitignore`

### Deliverability
- ✅ Verifica tu dominio en Resend
- ✅ Usa un email profesional (`noreply@zvenia.com`)
- ✅ Evita palabras spam en el asunto
- ✅ Incluye link de unsubscribe (opcional pero recomendado)

### Testing
- ✅ **SIEMPRE** prueba con `TEST_MODE=true` primero
- ✅ Verifica que los links funcionan
- ✅ Revisa el diseño en diferentes clientes de email

---

## 🔧 Troubleshooting

### Error: "Invalid API Key"
- Verifica que `RESEND_API_KEY` está en `.env`
- Verifica que la key es correcta
- Regenera la key si es necesario

### Error: "Domain not verified"
- Usa el dominio por defecto de Resend: `noreply@resend.dev`
- O verifica tu dominio en Resend Dashboard

### Emails van a spam
- Verifica tu dominio en Resend
- Revisa el contenido del email (evita palabras spam)
- Considera usar un servicio de warm-up de emails

### Rate limit exceeded
- Reduce el delay entre emails
- O actualiza a plan Pro de Resend

---

## 📝 Checklist Final (20 de febrero)

- [ ] Resend configurado y API key en `.env`
- [ ] Dominio verificado (o usar `resend.dev`)
- [ ] Prueba con 10 usuarios exitosa
- [ ] Template de email revisado y aprobado
- [ ] Fecha de lanzamiento correcta en el email (29 de febrero)
- [ ] `TEST_MODE=false` y `DRY_RUN=false`
- [ ] Backup de base de datos hecho
- [ ] Listo para enviar a 1,500 usuarios

---

## 🎯 Resultado Esperado

Después del envío:
- ✅ 1,500 usuarios reciben email
- ✅ Link de reset único para cada uno
- ✅ Usuarios pueden resetear su contraseña
- ✅ Listos para el lanzamiento del 29 de febrero

---

¿Listo para configurar Resend y hacer la prueba?


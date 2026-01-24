# ✅ Resend en Localhost - Guía Rápida

## 🎯 Respuesta Rápida

**SÍ, Resend funciona perfectamente en localhost.** No necesitas configuración especial.

---

## 🧪 Modos de Prueba

### Opción 1: DRY RUN (Recomendado para empezar)
**No envía emails reales**, solo genera los links y muestra qué se enviaría:

```env
# En tu .env:
TEST_MODE=true
DRY_RUN=true
```

```bash
npm run send-migration-emails
```

**Resultado:** Verás en consola:
- ✅ Links generados
- ✅ Templates creados
- ✅ Lista de usuarios que recibirían el email
- ⚠️ Pero NO se envían emails reales

---

### Opción 2: Prueba Real (10 usuarios)
**Envía emails REALES** a 10 usuarios:

```env
# En tu .env:
TEST_MODE=true
DRY_RUN=false
```

```bash
npm run send-migration_emails
```

**Resultado:** 
- ✅ 10 usuarios recibirán emails reales
- ✅ Puedes verificar en tu bandeja de entrada
- ✅ Los links de reset funcionan

---

## 📋 Lo que hace el script

1. **Conecta a Supabase** → Obtiene lista de usuarios
2. **Genera links únicos** → Un link de reset por usuario
3. **Crea templates** → HTML personalizado con `first_name`
4. **Envía emails** (si `DRY_RUN=false`) → Usa Resend API

---

## 🎯 Recomendación para Ahora

Como aún falta tiempo para el 20 de febrero, te recomiendo:

### Paso 1: DRY RUN (Ahora)
```env
TEST_MODE=true
DRY_RUN=true
```

Esto te permite:
- ✅ Ver cómo funciona el script
- ✅ Verificar que los links se generan correctamente
- ✅ Revisar los templates
- ✅ **Sin enviar emails reales**

### Paso 2: Prueba Real (Cuando estés listo)
```env
TEST_MODE=true
DRY_RUN=false
```

Esto enviará emails reales a 10 usuarios para verificar que todo funciona.

### Paso 3: Envío Masivo (20 de febrero)
```env
TEST_MODE=false
DRY_RUN=false
```

Esto enviará a todos los usuarios.

---

## 💡 Ventajas de Resend en Localhost

✅ **No necesitas servidor** - Funciona desde tu PC
✅ **Emails reales** - Los usuarios reciben emails de verdad
✅ **Fácil de probar** - Solo cambias variables en `.env`
✅ **Dashboard de Resend** - Puedes ver todos los emails enviados en https://resend.com/emails

---

## 🔍 Verificar Emails Enviados

Después de enviar, puedes ver:
- **Dashboard de Resend:** https://resend.com/emails
- Verás: estado de entrega, rebotes, aperturas (si tienes tracking)

---

## ⚠️ Importante

- **DRY_RUN=true** → No envía emails, solo simula
- **DRY_RUN=false** → Envía emails REALES
- **TEST_MODE=true** → Solo 10 usuarios
- **TEST_MODE=false** → TODOS los usuarios

---

¿Quieres hacer un DRY RUN ahora para ver cómo funciona sin enviar emails?


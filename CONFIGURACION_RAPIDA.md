# ⚡ Configuración Rápida - Resend

## ✅ Tu API Key
```
re_Mc3HYFwY_6kc6yjZ5t8oWa41VTWBNaiGw
```

## 📝 Agregar a .env

Abre tu archivo `.env` y agrega esta línea:

```env
RESEND_API_KEY=re_Mc3HYFwY_6kc6yjZ5t8oWa41VTWBNaiGw
```

## 🧪 Prueba Inmediata (10 usuarios)

```bash
# 1. Agrega a .env:
TEST_MODE=true
DRY_RUN=false

# 2. Ejecuta:
npm run send-migration-emails
```

Esto enviará emails **reales** a 10 usuarios para verificar que todo funciona.

## 📅 Envío Masivo (20 de febrero)

```bash
# 1. Cambia en .env:
TEST_MODE=false
DRY_RUN=false

# 2. Ejecuta:
npm run send-migration-emails
```

## 📧 Dominio del Email

Por ahora usa `onboarding@resend.dev` (funciona perfectamente).

Si quieres `noreply@zvenia.com`:
1. Ve a https://resend.com/domains
2. Agrega `zvenia.com`
3. Configura DNS
4. Espera verificación

---

**¿Listo para hacer la prueba ahora?**


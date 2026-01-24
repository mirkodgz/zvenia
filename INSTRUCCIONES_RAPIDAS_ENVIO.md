# 🚀 Instrucciones Rápidas - Envío de Emails

## ✅ Tu API Key de Resend
```
re_Mc3HYFwY_6kc6yjZ5t8oWa41VTWBNaiGw
```

## 📝 Paso 1: Agregar a .env

Abre tu archivo `.env` y agrega:

```env
RESEND_API_KEY=re_Mc3HYFwY_6kc6yjZ5t8oWa41VTWBNaiGw
```

## 🧪 Paso 2: Prueba con 10 Usuarios (AHORA)

```bash
# En tu .env, agrega también:
TEST_MODE=true
DRY_RUN=false

# Ejecutar:
npm run send-migration-emails
```

Esto enviará emails reales a solo 10 usuarios para verificar que todo funciona.

## 📅 Paso 3: Envío Masivo (20 de febrero)

```bash
# En tu .env, cambia a:
TEST_MODE=false
DRY_RUN=false

# Ejecutar:
npm run send-migration-emails
```

## ⚠️ IMPORTANTE

- **NO** subas tu `.env` a git (ya está en `.gitignore`)
- La API key es **secreta** - no la compartas públicamente
- Prueba primero con `TEST_MODE=true` antes del envío masivo

## 📧 Dominio del Email

Por ahora el script usa `noreply@resend.dev` (funciona perfectamente).

Si quieres usar `noreply@zvenia.com`:
1. Ve a https://resend.com/domains
2. Agrega tu dominio `zvenia.com`
3. Configura los registros DNS
4. Espera verificación (hasta 24 horas)

---

¿Listo para hacer la prueba ahora?


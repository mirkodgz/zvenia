# 📧 Estrategia de Comunicación - Migración de Usuarios

## 🎯 Situación
- **1,500 usuarios** migrados desde WordPress a Supabase
- Las contraseñas **NO se migraron** (no es posible técnicamente)
- Los usuarios necesitan **resetear su contraseña** para acceder

---

## 📊 Estrategia Recomendada (Estilo LinkedIn)

### **Opción 1: Email Proactivo (RECOMENDADO)** ⭐

**Timing:** Enviar 1-2 semanas ANTES del lanzamiento público

**Ventajas:**
- ✅ Los usuarios saben qué esperar
- ✅ Reduces frustración ("¿Por qué no funciona mi password?")
- ✅ Profesional y transparente
- ✅ Similar a cómo LinkedIn comunica cambios importantes

**Desventajas:**
- ⚠️ Requiere servicio de email (Resend, SendGrid, etc.)
- ⚠️ Algunos emails pueden ir a spam

---

### **Opción 2: Mensaje de Error Mejorado + Email Automático**

**Timing:** Cuando usuario intenta login y falla

**Ventajas:**
- ✅ Solo envía a usuarios activos
- ✅ No requiere envío masivo previo
- ✅ Menos costoso

**Desventajas:**
- ⚠️ Usuarios no saben hasta que intentan login
- ⚠️ Puede generar frustración inicial

---

### **Opción 3: Híbrida (MEJOR)** ⭐⭐⭐

**Combinar ambas:**

1. **Email Proactivo** (1 semana antes):
   - Enviar a TODOS los usuarios
   - Explicar la migración
   - Proporcionar link de reset

2. **Mensaje de Error Mejorado** (en login):
   - Si intentan login y falla
   - Mostrar mensaje claro con link a reset
   - Enviar email automático si no lo recibieron

3. **Banner en Homepage** (opcional):
   - Banner para usuarios no logueados
   - "We've upgraded! Reset your password to continue"

---

## 📝 Template de Email (Ya Creado)

He creado `TEMPLATE_EMAIL_MIGRACION.md` con:
- ✅ Template HTML profesional
- ✅ Versión texto plano
- ✅ Tono similar a LinkedIn
- ✅ CTA claro (botón verde)
- ✅ Información de contacto

---

## 🔧 Implementación Técnica

### 1. Servicio de Email (Elegir uno):

#### **Resend** (Recomendado - Moderno y fácil)
```bash
npm install resend
```

#### **SendGrid** (Popular, robusto)
```bash
npm install @sendgrid/mail
```

#### **Mailgun** (Alternativa)
```bash
npm install mailgun.js
```

### 2. Script de Envío Masivo

He creado `scripts/send_migration_emails.ts` que:
- ✅ Obtiene todos los usuarios
- ✅ Genera links de reset únicos
- ✅ Crea templates personalizados
- ⚠️ **FALTA:** Integrar servicio de email real

### 3. Mejoras en Login

Ya implementado:
- ✅ Mensaje de error mejorado
- ✅ Link directo a "Forgot Password"
- ✅ Explicación clara para usuarios migrados

---

## 📋 Checklist de Implementación

### Fase 1: Preparación (Ahora)
- [x] Template de email creado
- [x] Script de generación de links creado
- [x] Mensaje de error mejorado en login
- [ ] Elegir servicio de email (Resend/SendGrid/Mailgun)
- [ ] Configurar API keys en `.env`

### Fase 2: Prueba (Esta semana)
- [ ] Enviar email de prueba a 10 usuarios
- [ ] Verificar que los links funcionan
- [ ] Ajustar template si es necesario
- [ ] Verificar que no va a spam

### Fase 3: Envío Masivo (1 semana antes del lanzamiento)
- [ ] Enviar a todos los usuarios
- [ ] Monitorear tasa de apertura
- [ ] Enviar recordatorio a los que no han reseteado (1 semana después)

---

## 💡 Recomendación Final

**Usar Estrategia Híbrida:**

1. **Email Proactivo** (1 semana antes):
   ```
   Asunto: "Welcome to the New ZVENIA Platform - Reset Your Password"
   ```
   - Enviar a TODOS los usuarios
   - Explicar la migración
   - Proporcionar link de reset

2. **Mensaje de Error Mejorado** (ya implementado):
   - Si intentan login y falla
   - Mostrar: "Invalid login credentials. If you were migrated from WordPress, please reset your password using 'Forgot Password?' below."

3. **Email Automático al Fallar Login** (opcional):
   - Si el usuario intenta login y falla
   - Enviar email automático con link de reset
   - Solo si no recibieron el email proactivo

---

## 📊 Métricas a Monitorear

- **Tasa de apertura** del email
- **Tasa de click** en el botón de reset
- **Usuarios que resetean** exitosamente
- **Usuarios que contactan soporte** (reducir esto es el objetivo)

---

## 🚀 Próximos Pasos

1. **Elegir servicio de email** (Recomiendo Resend - es moderno y fácil)
2. **Integrar en el script** `send_migration_emails.ts`
3. **Hacer prueba con 10 usuarios**
4. **Ajustar template** si es necesario
5. **Enviar masivo** 1 semana antes del lanzamiento

---

¿Quieres que integre Resend o SendGrid en el script ahora?


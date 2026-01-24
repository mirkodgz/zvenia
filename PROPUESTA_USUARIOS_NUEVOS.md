# 📋 Manejo de Usuarios Nuevos en la Migración

## 📊 Situación Actual

- **Supabase:** ~1,500 usuarios
- **WordPress:** ~1,650 usuarios
- **Usuarios nuevos:** ~150 usuarios que NO están en Supabase

---

## 🎯 Estrategia: Dos Tipos de Operaciones

### 1️⃣ Usuarios Existentes (UPDATE)
- **Cantidad:** ~1,500
- **Acción:** Actualizar solo campos vacíos
- **Matching:** Por email normalizado
- **Preservar:** Datos que ya existen en Supabase

### 2️⃣ Usuarios Nuevos (INSERT)
- **Cantidad:** ~150
- **Acción:** Crear usuario completo
- **Proceso:**
  1. Crear en `auth.users` (autenticación)
  2. Crear en `profiles` (datos del perfil)
  3. Generar `profile_slug` automáticamente
  4. Asignar rol desde WordPress o `Basic` por defecto

---

## 🔄 Proceso de Creación de Usuarios Nuevos

### Paso 1: Crear en `auth.users`
```typescript
// Generar password temporal seguro
const tempPassword = generateSecurePassword();

// Crear usuario en auth
const { data: authUser, error } = await supabase.auth.admin.createUser({
  email: wpUser.user_email,
  password: tempPassword,
  email_confirm: true, // Auto-confirmar email
  user_metadata: {
    source: 'wordpress_migration',
    migrated_at: new Date().toISOString()
  }
});
```

### Paso 2: Crear en `profiles`
```typescript
// Crear perfil con todos los datos
const { error } = await supabase
  .from('profiles')
  .insert({
    id: authUser.user.id,
    email: wpUser.user_email,
    full_name: wpUser.display_name,
    first_name: wpUser.first_name,
    last_name: wpUser.last_name,
    role: wpUser.role || 'Basic',
    // ... todos los demás campos
    profile_slug: generateSlugFromEmail(wpUser.user_email),
    // ... metadata completo
  });
```

### Paso 3: Manejo de Password
**Opciones:**
1. **Password temporal:** Generar password seguro y guardarlo en CSV
2. **Reset password:** Usuario debe resetear password al primer login
3. **Sin password:** Usuario solo puede usar OAuth (Google, etc.)

**Recomendación:** Opción 2 (Reset password) - Más seguro

---

## 📝 CSV Final: Estructura

### Columnas Adicionales:
- `action` → "UPDATE" o "INSERT"
- `is_new_user` → true/false
- `temp_password` → Solo para usuarios nuevos (si aplica)
- `needs_password_reset` → true para usuarios nuevos

### Ejemplo de CSV:
```csv
action,email,full_name,company,nationality,...
UPDATE,user1@example.com,John Doe,ZVENIA,Peru,...
INSERT,newuser@example.com,Jane Smith,New Company,Chile,...
UPDATE,user2@example.com,Bob Johnson,Company X,USA,...
```

---

## ⚠️ Consideraciones Importantes

### 1. Emails Duplicados
- Verificar que no haya emails duplicados en WordPress CSV
- Si hay duplicados, usar el más reciente o el que tenga más datos

### 2. Validación de Datos
- Verificar que el email sea válido
- Verificar que los campos requeridos estén presentes
- Validar formatos de arrays serializados

### 3. Rollback
- Guardar backup de `profiles` antes de ejecutar
- Tener script de rollback por si algo falla

### 4. Notificaciones
- Opcional: Enviar email a usuarios nuevos informándoles de la migración
- Incluir instrucciones para resetear password

---

## 🔐 Seguridad

### Password para TODOS los Usuarios (Migración Final)
**Decisión:** Forzar reset de password para TODOS
- ✅ Todos los usuarios (existentes y nuevos) deben resetear password
- ✅ No generar passwords temporales
- ✅ Usuario debe usar "Forgot Password" al primer login
- ✅ Más seguro y evita problemas de seguridad
- ✅ Consistente con migración de WordPress a Astro

**Razón:** Estamos en fase final de migración, todos los usuarios necesitan adaptarse al nuevo sistema de autenticación.

---

## 📊 Estadísticas del Script

El script mostrará:
- Total usuarios en Supabase: 1,500
- Total usuarios en WordPress: 1,650
- Usuarios a actualizar: ~1,500
- Usuarios nuevos a crear: ~150
- Usuarios sin match: X (si hay emails inválidos)
- Campos actualizados por campo: X

---

## ✅ Confirmación

**¿Procedo con esta estrategia?**
- ✅ Crear usuarios nuevos que no existen en Supabase
- ✅ Actualizar usuarios existentes (solo campos vacíos)
- ✅ Generar CSV con ambos tipos de operaciones
- ✅ Script separado para UPDATE e INSERT


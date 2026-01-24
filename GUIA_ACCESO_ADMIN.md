# 🔐 Guía de Acceso al Dashboard Admin - ZVENIA

## 📍 URLs Importantes

### Página de Login Admin
```
http://localhost:4321/admin/login
```

### Dashboard Principal
```
http://localhost:4321/admin
```

### Gestión de Posts
```
http://localhost:4321/admin/posts
```

### Gestión de Usuarios (Solo Administrator)
```
http://localhost:4321/admin/users
```

---

## 👤 Sistema de Usuarios y Roles

### Roles Disponibles (de menor a mayor poder)

1. **Basic** - Usuario básico (sin acceso admin)
2. **Expert** - Puede crear podcasts
3. **Ads** - Puede crear servicios
4. **Events** - Puede crear eventos
5. **CountryManager** - ✅ **Tiene acceso al admin** (puede gestionar contenido)
6. **Administrator** - ✅ **Acceso total al admin** (puede gestionar usuarios y settings)

### Roles con Acceso al Admin
Solo estos roles pueden acceder a `/admin/*`:
- ✅ **CountryManager**
- ✅ **Administrator**

---

## 🔒 Cómo Funciona el Middleware

El middleware (`src/middleware/index.ts`) protege todas las rutas `/admin/*`:

### Flujo de Autenticación:

1. **Usuario intenta acceder a `/admin/posts`**
   - Middleware intercepta la petición
   - Verifica si la ruta empieza con `/admin`

2. **Si NO está autenticado:**
   - Redirige a `/admin/login`

3. **Si está autenticado:**
   - Obtiene el perfil del usuario desde `profiles` table
   - Verifica el rol del usuario

4. **Verificación de Rol:**
   - Si el rol es `Basic`, `Expert`, `Ads`, o `Events` → Redirige a `/` con error
   - Si el rol es `CountryManager` o `Administrator` → Permite acceso

5. **Rutas Especiales (solo Administrator):**
   - `/admin/users` - Solo Administrator
   - `/admin/settings` - Solo Administrator
   - Si un `CountryManager` intenta acceder → Redirige a `/admin` con error

6. **Si todo está bien:**
   - Guarda información del usuario en `Astro.locals.user` y `Astro.locals.profile`
   - Permite continuar a la página

---

## 🚀 Cómo Crear un Usuario Admin

### Opción 1: Crear usuario desde Supabase Dashboard

1. Ve a tu proyecto en Supabase Dashboard
2. Authentication → Users → Add User
3. Crea el usuario con email y password
4. Ve a Table Editor → `profiles` table
5. Busca el usuario recién creado (mismo `id` que en auth.users)
6. Edita el registro y cambia `role` a `Administrator` o `CountryManager`

### Opción 2: Usar un script (recomendado)

Puedes crear un script temporal para crear un admin:

```javascript
// scripts/create_admin.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createAdmin() {
  const email = 'admin@zvenia.com';
  const password = 'tu_password_seguro';
  
  // 1. Crear usuario en auth
  const { data: { user }, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    console.error('Error creando usuario:', authError);
    return;
  }

  // 2. Actualizar perfil con rol de admin
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ role: 'Administrator' })
    .eq('id', user.id);

  if (profileError) {
    console.error('Error actualizando perfil:', profileError);
  } else {
    console.log('✅ Admin creado exitosamente!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  }
}

createAdmin();
```

### Opción 3: Usar un usuario existente

Si ya tienes un usuario en la base de datos:

1. Ve a Supabase Dashboard → Table Editor → `profiles`
2. Busca tu usuario por email
3. Cambia el campo `role` a `Administrator` o `CountryManager`
4. Guarda los cambios

---

## 🔍 Cómo Saber si Estás Logueado

### Método 1: Verificar en el navegador
1. Abre las DevTools (F12)
2. Ve a Application/Storage → Cookies
3. Busca cookies que empiecen con `sb-` (Supabase)
4. Si existen, estás autenticado

### Método 2: Intentar acceder a una ruta admin
- Si estás logueado y tienes rol admin → Verás el dashboard
- Si no estás logueado → Te redirige a `/admin/login`
- Si estás logueado pero no tienes rol admin → Te redirige a `/` con error

### Método 3: Ver en el código
El middleware guarda la información en `Astro.locals`:
- `Astro.locals.user` - Información del usuario de auth
- `Astro.locals.profile` - Información del perfil (incluye `role`)

---

## 📝 Ejemplo de Uso

### 1. Crear un usuario admin manualmente:

```sql
-- En Supabase SQL Editor
-- Primero crea el usuario en auth (desde Dashboard o API)
-- Luego actualiza el perfil:

UPDATE profiles 
SET role = 'Administrator' 
WHERE email = 'tu-email@ejemplo.com';
```

### 2. Verificar tu rol actual:

Puedes crear una página de prueba temporal:

```astro
---
// src/pages/admin/test.astro
const profile = Astro.locals.profile;
---

<div>
  <h1>Tu Información</h1>
  <p>Email: {profile?.email}</p>
  <p>Rol: {profile?.role}</p>
  <p>Nombre: {profile?.full_name}</p>
</div>
```

---

## ⚠️ Troubleshooting

### "No tienes permisos de administrador"
- Verifica que tu usuario tenga rol `Administrator` o `CountryManager` en la tabla `profiles`
- El rol debe estar exactamente escrito así (case-sensitive)

### "Error fetching user profile"
- El usuario existe en `auth.users` pero no en `profiles`
- Verifica que el trigger de Supabase esté creando el perfil automáticamente
- O crea el perfil manualmente en la tabla `profiles`

### Redirige a login constantemente
- Verifica que las cookies estén siendo guardadas
- Revisa la consola del navegador por errores
- Verifica que `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY` estén correctos en `.env`

---

## 🎯 Resumen Rápido

1. **URL de Login:** `http://localhost:4321/admin/login`
2. **Roles con acceso:** `CountryManager` y `Administrator`
3. **Para crear admin:** Actualiza `role` en tabla `profiles` a `Administrator`
4. **Middleware protege:** Todas las rutas `/admin/*` excepto `/admin/login`

---

**Última actualización:** 22/01/2026


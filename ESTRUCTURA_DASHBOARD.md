# 📊 Estructura del Dashboard - ZVENIA

## 🎯 Resumen General

El sistema tiene **DOS áreas principales** de dashboard:

1. **`/dashboard`** - Área de usuario (todos los usuarios autenticados)
2. **`/admin`** - Área de administración (solo Administrators)

---

## 📁 ÁREA 1: `/dashboard` - Dashboard de Usuario

### 🎯 Propósito
Área personal para que los usuarios gestionen su propio contenido y perfil.

### 👥 Acceso
- ✅ **Todos los usuarios autenticados** pueden acceder
- ❌ No requiere rol especial

### 📂 Estructura de Archivos
```
src/pages/dashboard/
├── profile.astro              # Ver perfil privado
├── profile/
│   └── edit.astro            # Editar perfil
├── create.astro               # Crear contenido (modal)
├── posts/
│   └── edit/
│       └── [id].astro        # Editar post propio
├── events/
│   └── edit/
│       └── [id].astro        # Editar evento propio
├── podcasts/
│   └── edit/
│       └── [id].astro       # Editar podcast propio
└── services/
    └── edit/
        └── [id].astro        # Editar servicio propio
```

### 🔗 URLs Disponibles

#### Perfil de Usuario
```
/dashboard/profile              # Ver perfil privado (antes /dashboard/user-area)
/dashboard/profile/edit         # Editar perfil
```

#### Crear Contenido
```
/dashboard/create               # Página para crear contenido (Posts, Events, Podcasts, Services)
```

#### Editar Contenido Propio
```
/dashboard/posts/edit/[id]      # Editar post propio
/dashboard/events/edit/[id]     # Editar evento propio
/dashboard/podcasts/edit/[id]   # Editar podcast propio
/dashboard/services/edit/[id]   # Editar servicio propio
```

### 🔐 Permisos por Rol

| Rol | Ver Perfil | Editar Perfil | Crear Contenido | Editar Propio |
|-----|-----------|---------------|-----------------|---------------|
| **Basic** | ✅ | ✅ | ✅ Posts | ✅ |
| **Expert** | ✅ | ✅ | ✅ Posts, Podcasts | ✅ |
| **Ads** | ✅ | ✅ | ✅ Posts, Services | ✅ |
| **Events** | ✅ | ✅ | ✅ Posts, Events | ✅ |
| **CountryManager** | ✅ | ✅ | ✅ Posts, Events, Podcasts, Services | ✅ |
| **Administrator** | ✅ | ✅ | ✅ Posts, Events, Podcasts, Services | ✅ |

### 🎨 Layout
- Usa `SocialLayout` con `LeftSidebar` (25 temas de minería)
- Sin sidebar derecho en estas páginas
- Header global visible

---

## 📁 ÁREA 2: `/admin` - Dashboard de Administración

### 🎯 Propósito
Área administrativa para gestionar todo el contenido y usuarios del sistema.

### 👥 Acceso
- ✅ **Solo Administrators** pueden acceder
- ❌ Otros roles (incluido CountryManager) son redirigidos a `/`

### 📂 Estructura de Archivos
```
src/pages/admin/
├── index.astro                # Dashboard principal (estadísticas)
├── login.astro                # Login admin
├── posts/
│   ├── index.astro            # Lista todos los posts
│   ├── create.astro           # Crear post (admin)
│   └── edit/
│       └── [id].astro         # Editar cualquier post
├── events/
│   └── (pendiente)
├── podcasts/
│   └── (pendiente)
├── services/
│   └── (pendiente)
├── topics/
│   └── (pendiente)
├── media/
│   └── (pendiente)
├── users.astro                # Gestión de usuarios (solo Administrator)
└── settings/
    └── (pendiente)
```

### 🔗 URLs Disponibles

#### Autenticación
```
/admin/login                    # Login del admin
```

#### Dashboard Principal
```
/admin                         # Dashboard con estadísticas
```

#### Gestión de Contenido
```
/admin/posts                    # Lista todos los posts
/admin/posts/create            # Crear nuevo post
/admin/posts/edit/[id]         # Editar cualquier post
/admin/events                  # Lista todos los eventos (pendiente)
/admin/podcasts                # Lista todos los podcasts (pendiente)
/admin/services                 # Lista todos los servicios (pendiente)
```

#### Gestión del Sistema
```
/admin/topics                  # Gestión de topics/módulos (pendiente)
/admin/media                   # Gestión de media (pendiente)
/admin/users                   # Gestión de usuarios (solo Administrator)
/admin/settings                # Configuración del sistema (solo Administrator)
```

### 🔐 Permisos por Rol

| Rol | Acceso Admin | Ver Posts | Crear/Editar Posts | Ver Usuarios | Settings |
|-----|-------------|----------|-------------------|--------------|----------|
| **Basic** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Expert** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Ads** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Events** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **CountryManager** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Administrator** | ✅ | ✅ | ✅ | ✅ | ✅ |

### 🎨 Layout
- Usa `AdminLayout` con sidebar izquierdo
- Header global visible (mismo que el sitio público)
- Sidebar con navegación:
  - Dashboard
  - Posts
  - Events
  - Podcasts
  - Services
  - Topics
  - Media
  - Users (solo Administrator)
  - Settings (solo Administrator)

---

## 🔄 Flujo de Navegación

### Para Usuarios Regulares

```
Login → /dashboard/profile → Editar perfil o crear contenido
```

### Para Administrators

```
Login → /admin → Gestionar contenido y usuarios
```

---

## 🛡️ Protección de Rutas

### Middleware (`src/middleware.ts`)

#### Rutas `/admin/*`
- ✅ Verifica autenticación
- ✅ Verifica rol `Administrator`
- ✅ Redirige a `/admin/login` si no está autenticado
- ✅ Redirige a `/` si no es Administrator

#### Rutas Especiales (solo Administrator)
- `/admin/users` - Solo Administrator
- `/admin/settings` - Solo Administrator

### Rutas `/dashboard/*`
- ✅ Verifica autenticación (implícito)
- ✅ No requiere rol especial
- ✅ Cualquier usuario autenticado puede acceder

---

## 📝 Diferencias Clave

| Característica | `/dashboard` | `/admin` |
|---------------|--------------|----------|
| **Acceso** | Todos los usuarios | Solo Administrators |
| **Propósito** | Gestionar contenido propio | Gestionar todo el sistema |
| **Layout** | SocialLayout + LeftSidebar | AdminLayout + Sidebar Admin |
| **Editar Posts** | Solo propios | Todos los posts |
| **Ver Usuarios** | ❌ | ✅ (solo Administrator) |

---

## 🔗 Enlaces desde el Header

El `HeaderUserDropdown` incluye:

### Para Todos los Usuarios
- **User Area** → `/dashboard/profile`
- **Your Profile** → `/dashboard/profile/edit`
- **Settings** → (pendiente)

### Solo para Administrators
- **Admin** → `/admin`

---

## 📊 Resumen de URLs Completas

### Dashboard Usuario (`/dashboard`)
```
/dashboard/profile
/dashboard/profile/edit
/dashboard/create
/dashboard/posts/edit/[id]
/dashboard/events/edit/[id]
/dashboard/podcasts/edit/[id]
/dashboard/services/edit/[id]
```

### Dashboard Admin (`/admin`)
```
/admin
/admin/login
/admin/posts
/admin/posts/create
/admin/posts/edit/[id]
/admin/events
/admin/podcasts
/admin/services
/admin/topics
/admin/media
/admin/users          (solo Administrator)
/admin/settings       (solo Administrator)
```

---

## 🎯 Convenciones de Nomenclatura

### Archivos
- **Páginas**: `[nombre].astro` o `[slug].astro` para dinámicas
- **Componentes**: PascalCase (ej: `PostForm.tsx`)
- **Formularios**: `[Tipo]Form.tsx` (ej: `PostForm.tsx`, `EventForm.tsx`)

### Rutas
- **Usuario**: `/dashboard/[recurso]/[acción]`
- **Admin**: `/admin/[recurso]/[acción]`

---

## ✅ Estado Actual

### Completado ✅
- ✅ `/dashboard/profile` - Ver perfil privado
- ✅ `/dashboard/profile/edit` - Editar perfil
- ✅ `/dashboard/create` - Crear contenido
- ✅ `/dashboard/posts/edit/[id]` - Editar post
- ✅ `/dashboard/events/edit/[id]` - Editar evento
- ✅ `/dashboard/podcasts/edit/[id]` - Editar podcast
- ✅ `/dashboard/services/edit/[id]` - Editar servicio
- ✅ `/admin` - Dashboard principal
- ✅ `/admin/login` - Login admin
- ✅ `/admin/posts` - Lista posts
- ✅ `/admin/posts/create` - Crear post
- ✅ `/admin/posts/edit/[id]` - Editar post
- ✅ `/admin/users` - Gestión usuarios

### Pendiente ⏳
- ⏳ `/admin/events` - Lista eventos
- ⏳ `/admin/podcasts` - Lista podcasts
- ⏳ `/admin/services` - Lista servicios
- ⏳ `/admin/topics` - Gestión topics
- ⏳ `/admin/media` - Gestión media
- ⏳ `/admin/settings` - Configuración
- ⏳ `/dashboard/settings` - Configuración usuario

---

## 🔍 Archivos Clave

### Middleware
- `src/middleware.ts` - Protección de rutas `/admin/*`

### Layouts
- `src/layouts/SocialLayout.astro` - Layout para `/dashboard/*`
- `src/layouts/AdminLayout.astro` - Layout para `/admin/*`

### Roles y Permisos
- `src/lib/admin/roles.ts` - Definición de roles y funciones de verificación

### Componentes
- `src/components/HeaderUserDropdown.tsx` - Menú dropdown del header
- `src/components/dashboard/forms/*` - Formularios de usuario
- `src/components/admin/forms/*` - Formularios de admin
- `src/components/admin/tables/*` - Tablas de datos (TanStack Table)

---

## 💡 Notas Importantes

1. **Separación de Concerns**: 
   - `/dashboard` = Contenido propio del usuario
   - `/admin` = Gestión de todo el sistema

2. **Consistencia de URLs**:
   - Todas las rutas de edición siguen el patrón `/dashboard/[tipo]/edit/[id]`
   - Las rutas admin siguen el patrón `/admin/[recurso]/[acción]`

3. **Left Sidebar**:
   - Siempre visible en `/dashboard/*` (25 temas de minería)
   - No visible en `/admin/*` (usa sidebar admin propio)

4. **Header Global**:
   - Mismo header en ambas áreas
   - Dropdown muestra opciones según el rol del usuario


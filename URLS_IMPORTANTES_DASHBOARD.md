# 🔗 URLs Importantes - Dashboard y Perfil

## 👤 Perfil de Usuario

### Ver Mi Perfil
- **URL:** `/dashboard/profile`
- **Descripción:** Tu área de usuario privada (User Area)
- **Incluye:** Información personal, contacto, profesional, idiomas, expertise

### Editar Mi Perfil
- **URL:** `/dashboard/profile/edit`
- **Descripción:** Formulario para editar tu información
- **Incluye:** 
  - Información básica (nombre, apellido, headline)
  - Información de contacto (teléfono, nacionalidad, ubicación)
  - Información profesional (profesión, empresa, posición, LinkedIn)
  - Idioma y expertise (idiomas, áreas de expertise)
  - Foto de perfil (subida a Cloudinary)

---

## 📝 Crear Contenido

### Crear Nuevo Contenido
- **URL:** `/dashboard/create`
- **Descripción:** Página para crear posts, events, podcasts, services
- **Incluye:** Selector de tipo de contenido

### Crear Post (Admin)
- **URL:** `/admin/posts/create`
- **Descripción:** Formulario completo para crear posts
- **Requisito:** Rol `Administrator`
- **Incluye:** Editor de texto enriquecido, imágenes, topics, etc.

---

## 📋 Editar Contenido Existente

### Editar Post
- **URL:** `/dashboard/posts/edit/[id]`
- **Ejemplo:** `/dashboard/posts/edit/123`
- **Requisito:** Ser el autor o tener permisos de admin

### Editar Event
- **URL:** `/dashboard/events/edit/[id]`
- **Ejemplo:** `/dashboard/events/edit/456`

### Editar Podcast
- **URL:** `/dashboard/podcasts/edit/[id]`
- **Ejemplo:** `/dashboard/podcasts/edit/789`

### Editar Service
- **URL:** `/dashboard/services/edit/[id]`
- **Ejemplo:** `/dashboard/services/edit/101`

---

## 🔐 Autenticación

### Login
- **URL:** `/login`
- **Descripción:** Iniciar sesión

### Sign Out
- **URL:** `/api/auth/signout`
- **Descripción:** Cerrar sesión (redirige a homepage)

### Forgot Password
- **URL:** `/forgot-password`
- **Descripción:** Solicitar reset de contraseña

### Reset Password
- **URL:** `/reset-password`
- **Descripción:** Establecer nueva contraseña (con token del email)

---

## 🎯 Flujo de Prueba Recomendado

### 1. Ver Perfil
```
/dashboard/profile
```
- Verifica que tu información se muestra correctamente
- Revisa todas las secciones

### 2. Editar Perfil
```
/dashboard/profile/edit
```
- Edita algunos campos
- Sube una foto de perfil
- Guarda cambios
- Verifica que se actualizaron en `/dashboard/profile`

### 3. Crear Post (si tienes permisos)
```
/admin/posts/create
```
- Crea un post de prueba
- Agrega contenido, imágenes, topics
- Publica

### 4. Ver Post Creado
```
/post/[slug-del-post]
```
- Verifica que se ve correctamente
- Prueba las interacciones (like, comment, share)

---

## ⚠️ Notas Importantes

1. **Sidebar Izquierdo:** Siempre visible en todas las páginas de dashboard
2. **Permisos:** Dependen de tu rol (Basic, Expert, Administrator, etc.)
3. **Admin Panel:** Solo accesible con rol `Administrator`
4. **Editar Contenido:** Solo puedes editar contenido que creaste (o si eres admin)

---

¿Listo para empezar a probar?


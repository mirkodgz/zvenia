# 📝 Propuesta MEJORADA: Página "Edit Profile" - ZVENIA

## ✅ Estado Actual Verificado

### ✅ Infraestructura Lista
- ✅ Tablas de referencia: `countries`, `mining_topics`, `languages` (existen)
- ✅ Campos en BD: Todos los campos necesarios están en `profiles` (TEXT, no FK)
- ✅ Cloudinary: Endpoint `/api/upload` funcionando
- ✅ Componentes: Patrones de formulario existentes (PostForm, EventForm)
- ✅ Shadcn UI: Componentes premium disponibles

### ⚠️ Ajustes Necesarios
- ⚠️ `nationality` y `work_country` son **TEXT** (no FK) → Validar contra tabla `countries`
- ⚠️ `main_area_of_expertise` es **TEXT** (no FK) → Validar contra tabla `topics`
- ⚠️ `/settings` existe pero solo tiene tema → Reemplazar con formulario completo

---

## 🎯 Objetivo
Crear una página completa de edición de perfil accesible para **TODOS los usuarios** (todos los roles), donde puedan actualizar su información personal y profesional.

---

## 📍 URL y Acceso
- **URL:** `/settings` (reemplazar contenido actual)
- **Acceso:** Todos los usuarios autenticados (cualquier rol)
- **Protección:** Middleware de autenticación

---

## 🎨 Diseño y Layout

### Estructura General
```
┌─────────────────────────────────────────┐
│  Header (con logo y user menu)         │
├──────────┬──────────────────────────────┤
│          │                              │
│ Left     │  MAIN CONTENT AREA           │
│ Sidebar  │  ┌────────────────────────┐  │
│ (25      │  │  Page Header           │  │
│ topics)  │  │  "Edit Your Profile"   │  │
│          │  └────────────────────────┘  │
│          │  ┌────────────────────────┐  │
│          │  │  Form Sections:        │  │
│          │  │  1. Basic Info         │  │
│          │  │  2. Contact Info       │  │
│          │  │  3. Professional Info │  │
│          │  │  4. Language & Skills │  │
│          │  │  5. Avatar Upload      │  │
│          │  └────────────────────────┘  │
│          │  ┌────────────────────────┐  │
│          │  │  Action Buttons        │  │
│          │  │  [Save] [Cancel]       │  │
│          │  └────────────────────────┘  │
│          │                              │
└──────────┴──────────────────────────────┘
```

---

## 📋 Secciones del Formulario

### 1. **Basic Information** (Información Básica)
- **First Name** (text input, requerido)
- **Last Name** (text input, requerido)
- **Full Name** (text input, auto-generado opcional)
- **Headline** (text input) - "Headline User"
- **Username** (text input, opcional)
- **Email** (read-only, no editable)

### 2. **Contact Information** (Información de Contacto)
- **Phone Number** (tel input)
- **Nationality** (Select dropdown - validar contra tabla `countries`)
- **Current Location** (text input)

### 3. **Professional Information** (Información Profesional)
- **Profession** (text input)
- **Current Company** (text input)
- **Current Position** (text input)
- **Work Country** (Select dropdown - validar contra tabla `countries`)
- **LinkedIn URL** (url input, validar formato)

### 4. **Language & Expertise** (Idiomas y Experiencia)
- **Main Language** (Select: Spanish, English, Russian, French)
- **Other Languages** (Multi-select: Spanish, English, Russian, French)
- **Main Area of Expertise** (Select - validar contra tabla `topics` - 25 mining topics)
- **Other Areas of Expertise** (Multi-select - validar contra tabla `topics`)

### 5. **Profile Picture** (Foto de Perfil)
- **Avatar Upload** (Cloudinary upload - reutilizar patrón de `/api/upload`)
- Preview de imagen actual
- Botón "Change Photo"
- Validación: solo imágenes (jpg, png, webp)
- Tamaño máximo: 5MB

---

## 🔧 Funcionalidades Técnicas

### Validación
- **Client-side:** React Hook Form + Zod (recomendado)
- **Server-side:** Validación en API route
- **Campos requeridos:** First Name, Last Name
- **Validación de formato:** Email (read-only), Phone, URL (LinkedIn)
- **Validación de archivo:** Solo imágenes para avatar

### Guardado
- **Endpoint API:** `/api/profile/update`
- **Método:** POST
- **Autenticación:** Requerida (middleware)
- **Actualización:** Solo el propio perfil (RLS en Supabase)
- **Estructura de datos:**
  ```typescript
  {
    // Campos directos
    first_name, last_name, full_name, headline_user, username,
    phone_number, nationality, current_location,
    profession, company, position, work_country, linkedin_url,
    main_language, main_area_of_expertise,
    avatar_url,
    // Metadata (JSON)
    metadata: {
      others_languages: string[],
      others_areas_of_expertise: string[],
      // ... otros campos personalizados
    }
  }
  ```

### Campos Especiales

#### Selects con Validación contra Tablas de Referencia:
1. **Nationality** → Select con opciones de `countries` (guardar como TEXT)
2. **Work Country** → Select con opciones de `countries` (guardar como TEXT)
3. **Main Language** → Select: ['Spanish', 'English', 'Russian', 'French']
4. **Other Languages** → Multi-select del mismo array (guardar en `metadata.others_languages`)
5. **Main Area of Expertise** → Select con opciones de `topics` (guardar como TEXT)
6. **Other Areas of Expertise** → Multi-select de `topics` (guardar en `metadata.others_areas_of_expertise`)

#### Campos en Metadata (JSON):
- `others_languages` → Array de strings
- `others_areas_of_expertise` → Array de topic slugs o IDs
- `z_promoter` → Objeto con campos específicos (opcional)
- `z_ads` → Objeto con campos específicos (opcional)

---

## 🎨 Componentes Necesarios

### 1. **ProfileEditForm.tsx** (Componente React)
- **Framework:** React Hook Form + Zod
- **UI:** Shadcn UI components (Input, Select, Button, etc.)
- **Validación:** Client-side + Server-side
- **Estado:** useState para loading, errors, success
- **Subida de archivos:** Reutilizar patrón de `PostForm.tsx` para Cloudinary
- **Selects dinámicos:** Cargar opciones desde Supabase (countries, topics)

### 2. **AvatarUpload.tsx** (Componente React - Opcional)
- **Reutilizar:** Lógica de `PostForm.tsx` para upload
- **Preview:** Mostrar imagen actual y nueva
- **Validación:** Tipo y tamaño de archivo

### 3. **API Route: `/api/profile/update`**
- **Validación de autenticación:** Verificar `user.id`
- **Validación de datos:** Zod schema
- **Actualización en Supabase:** 
  - Campos directos → `profiles` table
  - Metadata → `profiles.metadata` (JSON)
- **Manejo de errores:** Respuestas claras

---

## 📱 Responsive Design
- **Desktop:** 2 columnas para formulario (secciones agrupadas)
- **Mobile:** 1 columna, formulario apilado
- **Tablet:** Layout adaptativo

---

## ✅ Características Adicionales

### Feedback Visual
- ✅ Mensajes de éxito/error (Toast notifications - Shadcn UI)
- ✅ Loading states (botones deshabilitados durante guardado)
- ✅ Validación en tiempo real (React Hook Form)
- ✅ Indicadores de campos requeridos (*)

### Navegación
- **Botón "Cancel"** → Redirige a `/dashboard/user-area`
- **Botón "Save"** → Guarda y muestra mensaje de éxito
- **Link "Back to Profile"** → Vuelve a User Area

### Seguridad
- ✅ Solo el usuario puede editar su propio perfil (verificar `user.id` en API)
- ✅ Validación server-side (Zod)
- ✅ RLS policies en Supabase (ya configuradas)

---

## 🚀 Implementación Sugerida

### Paso 1: Crear componente `ProfileEditForm.tsx`
- Usar React Hook Form + Zod
- Integrar Shadcn UI components
- Cargar opciones de `countries` y `topics` desde Supabase

### Paso 2: Crear API route `/api/profile/update`
- Validación de autenticación
- Validación de datos (Zod)
- Actualización en Supabase

### Paso 3: Actualizar página `/settings`
- Reemplazar contenido actual (tema)
- Integrar `ProfileEditForm`
- Layout con LeftSidebar

### Paso 4: Integrar Cloudinary para avatar
- Reutilizar patrón de `PostForm.tsx`
- Preview de imagen

### Paso 5: Agregar validación y feedback
- Toast notifications (Shadcn UI)
- Loading states
- Manejo de errores

### Paso 6: Testing
- Probar con diferentes roles
- Validar todos los campos
- Probar upload de avatar

---

## 📝 Notas Importantes

1. **Email NO es editable** (solo lectura)
2. **Role NO es editable** (solo Administrators pueden cambiar roles desde admin panel)
3. **Metadata** se actualiza como JSON completo (merge con datos existentes)
4. **Avatar** se sube a Cloudinary y se guarda la URL en `avatar_url`
5. **Selects** cargan opciones desde tablas de referencia (`countries`, `topics`) pero guardan como TEXT
6. **Validación:** Los valores de selects deben existir en las tablas de referencia

---

## 🎯 Ventajas de esta Propuesta

✅ **Reutiliza infraestructura existente:**
- Cloudinary upload pattern
- Shadcn UI components
- Tablas de referencia

✅ **Escalable:**
- Metadata JSON para campos futuros
- Validación robusta
- Estructura modular

✅ **User-friendly:**
- Validación en tiempo real
- Feedback visual claro
- Responsive design

---

¿Te parece bien esta propuesta mejorada? ¿Quieres que implemente alguna parte específica primero?


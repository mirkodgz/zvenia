# 📝 Propuesta: Página "Edit Profile" - ZVENIA

## 🎯 Objetivo
Crear una página completa de edición de perfil accesible para **TODOS los usuarios** (todos los roles), donde puedan actualizar su información personal y profesional.

---

## 📍 URL y Acceso
- **URL:** `/settings` o `/profile/edit`
- **Acceso:** Todos los usuarios autenticados (cualquier rol)
- **Protección:** Requiere autenticación (middleware)

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
│          │  │  4. Language & Skills  │  │
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
- **First Name** (text input)
- **Last Name** (text input)
- **Full Name** (text input, auto-generado opcional)
- **Headline** (text input) - "Headline User"
- **Username** (text input, opcional)
- **Email** (read-only, no editable)

### 2. **Contact Information** (Información de Contacto)
- **Phone Number** (tel input)
- **Nationality** (Select dropdown - lista de países)
- **Current Location** (text input)

### 3. **Professional Information** (Información Profesional)
- **Profession** (text input)
- **Current Company** (text input)
- **Current Position** (text input)
- **Work Country** (Select dropdown - lista de países)
- **LinkedIn URL** (url input)

### 4. **Language & Expertise** (Idiomas y Experiencia)
- **Main Language** (Select: Spanish, English, Russian, French)
- **Other Languages** (Multi-select o Checkboxes: Spanish, English, Russian, French)
- **Main Area of Expertise** (Select - 25 mining topics)
- **Other Areas of Expertise** (Multi-select o Checkboxes - 25 mining topics)

### 5. **Profile Picture** (Foto de Perfil)
- **Avatar Upload** (Cloudinary upload)
- Preview de imagen actual
- Botón "Change Photo"
- Validación: solo imágenes (jpg, png, webp)
- Tamaño máximo: 5MB

---

## 🔧 Funcionalidades Técnicas

### Validación
- Campos requeridos: First Name, Last Name, Email (read-only)
- Validación de formato: Email, Phone, URL
- Validación de tipos de archivo para avatar

### Guardado
- **Endpoint API:** `/api/profile/update`
- **Método:** POST
- **Autenticación:** Requerida
- **Actualización:** Solo el propio perfil (RLS)

### Campos Especiales

#### Selects con Opciones Predefinidas:
1. **Nationality** → Tabla `countries` (FK)
2. **Work Country** → Tabla `countries` (FK)
3. **Main Language** → Array: ['Spanish', 'English', 'Russian', 'French']
4. **Other Languages** → Multi-select del mismo array
5. **Main Area of Expertise** → Tabla `topics` (FK - 25 topics)
6. **Other Areas of Expertise** → Multi-select de `topics`

#### Campos en Metadata (JSON):
- `others_languages` → Array de strings
- `others_areas_of_expertise` → Array de topic IDs
- `z_promoter` → Objeto con campos específicos
- `z_ads` → Objeto con campos específicos

---

## 🎨 Componentes Necesarios

### 1. **ProfileEditForm.tsx** (Componente React)
- Formulario completo con validación
- Manejo de estado
- Subida de archivos (Cloudinary)
- Selects con opciones dinámicas

### 2. **AvatarUpload.tsx** (Componente React)
- Upload a Cloudinary
- Preview de imagen
- Validación de archivo

### 3. **API Route: `/api/profile/update`**
- Validación de autenticación
- Validación de datos
- Actualización en Supabase
- Manejo de errores

---

## 📱 Responsive Design
- **Desktop:** 2 columnas para formulario
- **Mobile:** 1 columna, formulario apilado
- **Tablet:** Layout adaptativo

---

## ✅ Características Adicionales

### Feedback Visual
- Mensajes de éxito/error
- Loading states
- Validación en tiempo real
- Indicadores de campos requeridos

### Navegación
- Botón "Cancel" → Redirige a `/dashboard/user-area`
- Botón "Save" → Guarda y muestra mensaje de éxito
- Link "Back to Profile" → Vuelve a User Area

### Seguridad
- Solo el usuario puede editar su propio perfil
- Validación server-side
- RLS policies en Supabase

---

## 🚀 Implementación Sugerida

### Paso 1: Crear la página `/settings` (o `/profile/edit`)
### Paso 2: Crear componente `ProfileEditForm.tsx`
### Paso 3: Crear API route `/api/profile/update`
### Paso 4: Integrar Cloudinary para avatar
### Paso 5: Agregar validación y feedback
### Paso 6: Testing con diferentes roles

---

## 📝 Notas Importantes

1. **Email NO es editable** (solo lectura)
2. **Role NO es editable** (solo Administrators pueden cambiar roles desde admin panel)
3. **Metadata** se actualiza como JSON completo
4. **Avatar** se sube a Cloudinary y se guarda la URL
5. **Selects** deben cargar opciones desde tablas de referencia (countries, topics)

---

¿Te parece bien esta estructura? ¿Quieres que implemente alguna parte específica primero?


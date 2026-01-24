# 🔒 Propuesta: Sistema de Privacidad para Perfiles Públicos

## 📋 Situación Actual

- ✅ Ya existe la página de perfil público: `/profile/[slug]/zv-user/`
- ✅ El slug se genera del email: `ltukula2@gmail.com` → `ltukula2gmail-com`
- ✅ URL actual: `/profile/ltukula2gmail-com/zv-user/`
- ❌ **NO existe sistema de privacidad** - todos los campos son visibles públicamente

## 🎯 Objetivo

Permitir que los usuarios controlen qué información es visible en su perfil público mediante checkboxes en "Edit Profile".

## 🔧 Propuesta de Slug

### Opción 1: Slug desde Email (Actual) ✅ RECOMENDADO
```
ltukula2@gmail.com → ltukula2gmail-com
```
**Ventajas:**
- ✅ Único (email es único)
- ✅ No cambia si el usuario cambia su nombre
- ✅ SEO-friendly
- ✅ Ya está implementado

**URL:** `/profile/ltukula2gmail-com/zv-user/`

### Opción 2: Slug desde Username (Alternativa)
```
username: "lerato-tukula" → lerato-tukula
```
**Ventajas:**
- ✅ Más legible
- ✅ Mejor SEO

**Desventajas:**
- ❌ Requiere que el usuario defina un username único
- ❌ Puede cambiar si el usuario cambia su username

### Opción 3: Slug Personalizado (Futuro)
Permitir que el usuario elija su propio slug (con validación de unicidad).

## 🔒 Sistema de Privacidad

### Estructura en `metadata`

```json
{
  "privacy": {
    "email": false,           // Email siempre oculto por defecto
    "phone_number": false,      // Teléfono oculto por defecto
    "nationality": true,       // Nacionalidad visible por defecto
    "current_location": true,  // Ubicación visible por defecto
    "company": true,           // Empresa visible por defecto
    "position": true,          // Posición visible por defecto
    "linkedin_url": true,      // LinkedIn visible por defecto
    "profession": true,        // Profesión visible por defecto
    "work_country": true,      // País de trabajo visible por defecto
    "main_language": true,     // Idioma principal visible por defecto
    "others_languages": true,  // Otros idiomas visibles por defecto
    "main_area_of_expertise": true,  // Área principal visible por defecto
    "others_areas_of_expertise": true // Otras áreas visibles por defecto
  }
}
```

### Campos Siempre Públicos (No se pueden ocultar)
- ✅ `full_name` (nombre completo)
- ✅ `avatar_url` (foto de perfil)
- ✅ `headline_user` (título profesional)
- ✅ `role` (rol del usuario)

### Campos Siempre Privados (No se pueden hacer públicos)
- 🔒 `email` (siempre oculto por seguridad)
- 🔒 `phone_number` (siempre oculto por defecto, pero puede hacerse público si el usuario quiere)

## 📝 Implementación

### 1. Agregar Sección de Privacidad en "Edit Profile"

En `/dashboard/profile/edit`, agregar una nueva sección:

```tsx
{/* Section 6: Privacy Settings */}
<div className="space-y-4">
    <h3 className="text-lg font-semibold text-[#202124] border-b border-gray-200 pb-2">
        Privacy Settings
    </h3>
    <p className="text-sm text-gray-600 mb-4">
        Control what information is visible on your public profile.
    </p>
    
    <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
            <input
                type="checkbox"
                checked={privacySettings.phone_number}
                onChange={() => togglePrivacy('phone_number')}
                className="w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
            />
            <span className="text-sm text-[#202124]">Show phone number</span>
        </label>
        
        <label className="flex items-center gap-3 cursor-pointer">
            <input
                type="checkbox"
                checked={privacySettings.nationality}
                onChange={() => togglePrivacy('nationality')}
                className="w-4 h-4 text-[#00c44b] border-gray-300 rounded focus:ring-[#00c44b]"
            />
            <span className="text-sm text-[#202124]">Show nationality</span>
        </label>
        
        {/* ... más checkboxes ... */}
    </div>
</div>
```

### 2. Actualizar Página de Perfil Público

En `/profile/[slug]/zv-user.astro`, verificar `metadata.privacy` antes de mostrar cada campo:

```astro
{profile.phone_number && (metadata.privacy?.phone_number !== false) && (
    <div>
        <span class="text-xs text-gray-500 uppercase">Phone number</span>
        <p class="text-gray-900">{profile.phone_number}</p>
    </div>
)}
```

### 3. Valores por Defecto

Si `metadata.privacy` no existe, usar estos valores por defecto:
- `phone_number`: `false` (oculto)
- `email`: `false` (siempre oculto)
- Todos los demás: `true` (visibles)

## 🎨 Mejoras Adicionales

### 1. Link al Perfil Público en "Edit Profile"

Agregar un banner o link que muestre:
```
"Your public profile: https://zvenia.com/profile/ltukula2gmail-com/zv-user/"
```

### 2. Preview del Perfil Público

Agregar un botón "Preview Public Profile" que abra el perfil en una nueva pestaña.

### 3. Estadísticas de Visitas (Futuro)

Mostrar cuántas veces se ha visitado el perfil público.

## 📊 Resumen de Slug

**Recomendación:** Mantener el slug actual (desde email)
- ✅ Ya funciona
- ✅ Único y estable
- ✅ No requiere cambios

**URL del ejemplo:**
```
https://zvenia.com/profile/ltukula2gmail-com/zv-user/
```

## ✅ Próximos Pasos

1. ✅ Implementar sistema de privacidad en `metadata.privacy`
2. ✅ Agregar sección de privacidad en "Edit Profile"
3. ✅ Actualizar página de perfil público para respetar privacidad
4. ✅ Agregar link al perfil público en "Edit Profile"
5. ✅ Probar con usuario real


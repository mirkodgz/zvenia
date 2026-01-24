# 🚀 Plan de Migración de Usuarios - WordPress a Supabase

## 📊 Situación Actual

- **~1500 usuarios** en WordPress con campos personalizados
- Necesitas migrar todos los datos a Supabase
- Ya tienes la estructura base funcionando en Supabase

---

## 🎯 Objetivos

1. ✅ Migrar todos los campos personalizados de WordPress
2. ✅ Crear **User Area** (área privada) - `/dashboard/user-area/`
3. ✅ Crear **Perfil Público** - `/profile/{slug}/zv-user/`
4. ✅ Generar slug único del email para URLs públicas

---

## 📋 Campos Identificados de las Capturas

### Campos Básicos (Agregar al Schema)
- ✅ `phone_number` - Teléfono
- ✅ `nationality` - Nacionalidad
- ✅ `profession` - Profesión
- ✅ `work_country` - País de trabajo
- ✅ `current_location` - Ubicación actual
- ✅ `headline_user` - Headline/Título profesional
- ✅ `main_language` - Idioma principal
- ✅ `main_area_of_expertise` - Área principal de expertise
- ✅ `username` - Nombre de usuario (para slug)

### Campos en Metadata (JSON)
- `others_languages` - Array de idiomas adicionales
- `others_areas_of_expertise` - Array de áreas de expertise
- `icon_rol_basic` - URL del icono para rol Basic
- `icon_rol_ads` - URL del icono para rol Ads
- `icon_rol_promoter` - URL del icono para rol Promoter
- `icon_rol_expert` - URL del icono para rol Expert
- `z_promoter_why` - Por qué quiere ser Promoter
- `z_promoter_contribute` - Cómo puede contribuir
- `z_promoter_priority_1/2/3` - Prioridades para Promoter
- `z_ads_*` - Campos específicos para Z-ADS

---

## 🗄️ Estructura Recomendada de la Tabla `profiles`

### Campos Directos (Columnas)
```sql
-- Campos existentes
id, email, role, first_name, last_name, full_name, 
avatar_url, company, position, linkedin_url, 
metadata, created_at, updated_at

-- Campos a AGREGAR
phone_number TEXT,
nationality TEXT,
profession TEXT,
work_country TEXT,
current_location TEXT,
headline_user TEXT,
main_language TEXT,
main_area_of_expertise TEXT,
username TEXT,  -- Para generar slug único
profile_slug TEXT UNIQUE  -- Slug generado del email
```

### Metadata (JSON) - Estructura
```json
{
  "others_languages": ["Spanish", "French"],
  "others_areas_of_expertise": ["01 General mining", "04 Geotechnics"],
  "icon_rol_basic": "url...",
  "icon_rol_ads": "url...",
  "icon_rol_promoter": "url...",
  "icon_rol_expert": "url...",
  "z_promoter": {
    "why": "texto...",
    "contribute": "texto...",
    "priority_1": "04 Geotechnics",
    "priority_2": "05 Drilling",
    "priority_3": "06 Blasting"
  },
  "z_ads": {
    // campos específicos de Z-ADS
  }
}
```

---

## 🔧 Generación de Slug del Email

El slug se genera del email para URLs públicas:
- `tagiyevemin489@gmail.com` → `tagiyevemin489gmail-com`
- `mirkodgzbusiness@gmail.com` → `mirkodgzbusinessgmail-com`

**Función para generar slug:**
```typescript
function generateSlugFromEmail(email: string): string {
  return email
    .toLowerCase()
    .replace('@', '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
```

**URL del perfil público:**
```
/profile/{slug}/zv-user/
```

---

## 📁 Estructura de Páginas a Crear

### 1. User Area (Área Privada)
**Ruta:** `/dashboard/user-area/` o `/my-zvenia`
- Vista privada del usuario logueado
- Muestra TODOS sus datos
- Permite editar perfil
- Similar a la captura que mostraste

### 2. Perfil Público
**Ruta:** `/profile/[slug]/zv-user/`
- Vista pública del perfil
- Accesible por cualquier usuario
- Muestra información pública (sin datos sensibles)
- Similar a LinkedIn

---

## 🚀 Plan de Implementación

### Fase 1: Actualizar Schema (PRIORITARIO)
1. ✅ Crear migración SQL para agregar campos faltantes
2. ✅ Actualizar `database.types.ts`
3. ✅ Generar función para crear slug del email

### Fase 2: Crear Páginas
1. ✅ Crear `/dashboard/user-area/` (área privada)
2. ✅ Crear `/profile/[slug]/zv-user/` (perfil público)
3. ✅ Crear componente de edición de perfil

### Fase 3: Migración de Datos
1. ✅ Script para migrar usuarios de WordPress
2. ✅ Generar slugs para todos los usuarios existentes
3. ✅ Validar datos migrados

---

## 📝 Próximos Pasos Inmediatos

1. **Crear migración SQL** para agregar campos
2. **Crear función de slug** del email
3. **Crear página User Area**
4. **Crear página Perfil Público**

---

**Última actualización:** 22/01/2026


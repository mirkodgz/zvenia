# 📋 Campos de Usuario - ZVENIA Mining

## Comparación: WordPress Meta Boxes vs Supabase Profiles

En WordPress tenías **meta boxes** o **campos personalizados** para usuarios. En Supabase tenemos:

1. **Campos directos** en la tabla `profiles` (equivalente a campos nativos de WordPress)
2. **Campo `metadata`** (JSON) - Equivalente a los meta boxes personalizados de WordPress

---

## 📊 Campos Disponibles en la Tabla `profiles`

### Campos Directos (Definidos en el Schema)

| Campo | Tipo | Descripción | Equivalente WordPress |
|-------|------|-------------|----------------------|
| `id` | UUID | ID único del usuario (FK de auth.users) | `user_id` |
| `email` | string | Email del usuario | `user_email` |
| `role` | string | Rol del usuario (Basic, Expert, Ads, Events, CountryManager, Administrator) | `user_role` |
| `first_name` | string \| null | Nombre | `first_name` |
| `last_name` | string \| null | Apellido | `last_name` |
| `full_name` | string \| null | Nombre completo | `display_name` |
| `avatar_url` | string \| null | URL del avatar (Cloudinary) | `avatar_url` |
| `company` | string \| null | Empresa/Organización | Meta box personalizado |
| `position` | string \| null | Cargo/Posición | Meta box personalizado |
| `linkedin_url` | string \| null | URL de LinkedIn | Meta box personalizado |
| `metadata` | JSON | **Campos personalizados** (equivalente a meta boxes) | Todos los meta boxes |
| `created_at` | timestamp | Fecha de creación | `user_registered` |
| `updated_at` | timestamp | Última actualización | - |

### Campos Adicionales (Mencionados en scripts pero no en types)

Estos campos aparecen en algunos scripts pero **NO están en el schema actual**:

- ❌ `country` - Se usa en código pero no está en `database.types.ts`
- ❌ `profession` - Se usa en scripts pero no está en `database.types.ts`
- ❌ `username` - Se usa en scripts pero no está en `database.types.ts`

**⚠️ Nota:** Estos campos probablemente están en `metadata` (JSON) o necesitan ser agregados al schema.

---

## 🗂️ Campo `metadata` (JSON) - Equivalente a Meta Boxes

El campo `metadata` es un objeto JSON que puede contener **cualquier dato personalizado**, similar a los meta boxes de WordPress.

### Ejemplo de uso:

```typescript
// Guardar datos personalizados
await supabase
  .from('profiles')
  .update({
    metadata: {
      country: 'Chile',
      profession: 'Geologist',
      phone: '+56 9 1234 5678',
      bio: 'Experto en minería...',
      website: 'https://ejemplo.com',
      twitter: '@usuario',
      // ... cualquier otro campo personalizado
    }
  })
  .eq('id', userId);

// Leer datos personalizados
const { data } = await supabase
  .from('profiles')
  .select('metadata')
  .eq('id', userId)
  .single();

const country = data?.metadata?.country;
const profession = data?.metadata?.profession;
```

---

## 🔍 Campos que se Usan en el Código Actual

### En `UserManagement.tsx`:
- ✅ `id`, `email`, `full_name`, `role`, `avatar_url`
- ⚠️ `country` - **Usado pero no está en types** (probablemente en metadata)

### En `middleware.ts`:
- ✅ `role`, `country`, `full_name`

### En scripts de migración:
- ⚠️ `username`, `profession`, `country` - **Usados pero no en schema**

---

## 📝 Recomendaciones

### Opción 1: Agregar campos faltantes al schema (Recomendado)

Si necesitas campos como `country`, `profession`, `username` frecuentemente, es mejor agregarlos como columnas directas:

```sql
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS profession TEXT,
ADD COLUMN IF NOT EXISTS username TEXT;
```

**Ventajas:**
- ✅ Búsqueda y filtrado más eficiente
- ✅ Validación a nivel de base de datos
- ✅ Mejor rendimiento

### Opción 2: Usar solo `metadata` (JSON)

Si los campos son opcionales y variables, mantenerlos en `metadata`:

```typescript
// Estructura sugerida para metadata
metadata: {
  // Información personal
  country?: string;
  profession?: string;
  bio?: string;
  phone?: string;
  website?: string;
  
  // Redes sociales
  twitter?: string;
  github?: string;
  instagram?: string;
  
  // Preferencias
  language?: string;
  timezone?: string;
  newsletter?: boolean;
  
  // Campos personalizados específicos de tu dominio
  mining_expertise?: string[];
  certifications?: string[];
  // ... etc
}
```

**Ventajas:**
- ✅ Flexibilidad total
- ✅ No requiere migraciones para nuevos campos
- ✅ Similar a meta boxes de WordPress

---

## 🎯 Campos que Probablemente Tenías en WordPress

Basado en el contexto de ZVENIA Mining, probablemente tenías:

### Información Básica
- ✅ Nombre, Apellido, Email → `first_name`, `last_name`, `email`
- ✅ Avatar → `avatar_url`
- ✅ Bio/Descripción → `metadata.bio`

### Información Profesional
- ✅ Empresa → `company`
- ✅ Cargo → `position`
- ✅ Profesión → `metadata.profession` o agregar columna
- ✅ LinkedIn → `linkedin_url`

### Información Geográfica
- ⚠️ País → `metadata.country` o agregar columna `country`
- ⚠️ Ciudad → `metadata.city`
- ⚠️ Región → `metadata.region`

### Información de Contacto
- ⚠️ Teléfono → `metadata.phone`
- ⚠️ Website → `metadata.website`
- ⚠️ Twitter → `metadata.twitter`

### Campos Específicos de ZVENIA
- ⚠️ Especialidad en Minería → `metadata.mining_expertise`
- ⚠️ Certificaciones → `metadata.certifications`
- ⚠️ Años de experiencia → `metadata.years_experience`
- ⚠️ Idiomas → `metadata.languages`

---

## 🔧 Próximos Pasos

1. **Decidir qué campos agregar como columnas directas** vs mantener en `metadata`
2. **Actualizar `database.types.ts`** para reflejar los campos reales
3. **Crear migración SQL** si agregamos nuevas columnas
4. **Actualizar componentes** para usar los campos correctos

---

**Última actualización:** 22/01/2026


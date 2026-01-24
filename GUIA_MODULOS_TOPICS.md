# 📚 Guía: Sistema de Módulos/Topics (25 Áreas de Expertise)

## 🎯 ¿Cómo Funciona?

Los **25 módulos** (áreas de expertise) se almacenan en **UNA SOLA TABLA** en Supabase: `topics`

### Estructura de la Tabla `topics`:

```sql
CREATE TABLE public.topics (
    id UUID PRIMARY KEY,
    slug TEXT UNIQUE,        -- Ej: "blasting", "economics-and-costs"
    name TEXT,               -- Ej: "06 Blasting", "12 Economics and costs"
    created_at TIMESTAMPTZ
);
```

### 📍 ¿Dónde se Usan los Topics?

Los topics se cargan dinámicamente desde Supabase en estos lugares:

1. **`/dashboard/profile/edit`** - Formulario de edición de perfil
   - Archivo: `src/components/dashboard/forms/ProfileEditForm.tsx`
   - Línea 84-87: Carga desde `topics` ordenado por `name`

2. **`/mining/[slug]`** - Páginas de temas de minería
   - Archivo: `src/pages/mining/[slug].astro`
   - Línea 28-33: Busca topic por `slug`

3. **Left Sidebar** - Barra lateral izquierda (25 temas)
   - Archivo: `src/components/social/LeftSidebar.astro`
   - Línea 11-14: Carga todos los topics ordenados por `name`

4. **Formularios de Contenido**:
   - `PostForm.tsx` - Para crear/editar posts
   - `EventForm.tsx` - Para crear/editar eventos
   - `PodcastForm.tsx` - Para crear/editar podcasts
   - `ServiceForm.tsx` - Para crear/editar servicios

5. **Perfil Público** - Resolución de IDs a nombres
   - Archivo: `src/pages/profile/[slug]/zv-user.astro`
   - Línea 79-99: Resuelve `main_area_of_expertise` (ID) a nombre legible

---

## ✅ **RESPUESTA CORTA: ¿Es 1 Solo?**

**¡SÍ!** Es **UNA SOLA TABLA** (`topics`) en Supabase. Todos los componentes cargan los datos desde ahí.

---

## 🚀 ¿Cómo Agregar un Nuevo Módulo? (Ejemplo: "26 Mirko test")

### **Opción 1: Desde Supabase Dashboard (Recomendado)**

1. Ve a **Supabase Dashboard** → **Table Editor** → **topics**
2. Click en **"Insert"** → **"Insert row"**
3. Completa:
   - **slug**: `mirko-test` (sin espacios, con guiones)
   - **name**: `26 Mirko test` (con número y nombre)
   - **id**: Se genera automáticamente (UUID)
   - **created_at**: Se genera automáticamente

4. Click en **"Save"**

**¡Listo!** El nuevo módulo aparecerá automáticamente en:
- ✅ Formulario de edición de perfil
- ✅ Left Sidebar (25 temas → 26 temas)
- ✅ Todos los formularios de contenido
- ✅ Páginas de temas de minería (`/mining/mirko-test`)

### **Opción 2: Desde SQL (Para Múltiples Módulos)**

```sql
INSERT INTO public.topics (slug, name) 
VALUES ('mirko-test', '26 Mirko test');
```

---

## 📋 **Lista Actual de los 25 Módulos**

Según `topics_seed.sql`, los módulos actuales son:

1. `01 General mining` (slug: `general-mining`)
2. `02 Mine preparation` (slug: `mine-preparation`)
3. `03 Mine organization` (slug: `mine-organization`)
4. `04 Geotechnics` (slug: `geotechnics`)
5. `05 Drilling` (slug: `drilling`)
6. `06 Blasting` (slug: `blasting`)
7. `07 Ground support` (slug: `ground-support`)
8. `08 Ventilation` (slug: `ventilation`)
9. `09 Topography` (slug: `topography`)
10. `10 Loading and hauling` (slug: `loading-and-hauling`)
11. `11 Resource estimation` (slug: `resource-estimation`)
12. `12 Economics and costs` (slug: `economics-and-costs`)
13. `13 Reserve calculations` (slug: `reserve-calculations`)
14. `14 Optimization and design` (slug: `optimization-and-design`)
15. `15 Planning` (slug: `planning`)
16. `16 Grade control` (slug: `grade-control`)
17. `17 Finances and markets` (slug: `finances-and-markets`)
18. `18 Performance levels` (slug: `performance-levels`)
19. `19 Data management` (slug: `data-management`)
20. `20 Facilities` (slug: `facilities`)
21. `21 QHSE` (slug: `qhse`)
22. `22 Logistics and purchasing` (slug: `logistics-and-purchasing`)
23. `23 Maintenance` (slug: `maintenance`)
24. `24 Legal and tax` (slug: `legal-and-tax`)
25. `25 HR and organization` (slug: `hr-and-organization`)

---

## 🔄 **¿Necesitas Cambiar en Múltiples Lugares?**

**NO.** Solo necesitas agregar el registro en la tabla `topics` de Supabase. Todos los componentes cargan los datos automáticamente.

**Excepción:** Si cambias el **orden** o el **formato** de cómo se muestran, podrías necesitar actualizar:
- El ordenamiento (`.order('name')` vs `.order('slug')`)
- El formato de visualización (si quieres mostrar solo el nombre sin el número)

---

## 📝 **Ejemplo Práctico: Agregar "26 Mirko test"**

### Paso 1: Agregar en Supabase

```sql
INSERT INTO public.topics (slug, name) 
VALUES ('mirko-test', '26 Mirko test');
```

### Paso 2: Verificar

1. Recarga `/dashboard/profile/edit`
2. Deberías ver "26 Mirko test" en el dropdown de "Main Area of Expertise"
3. Deberías ver "26 Mirko test" en los checkboxes de "Other Areas of Expertise"
4. Recarga la página principal
5. Deberías ver "26 Mirko test" en el Left Sidebar

**¡Eso es todo!** No necesitas cambiar código.

---

## 🎨 **Orden Actual**

Actualmente, los topics se ordenan por `name` (alfabéticamente), lo que significa:
- `01 General mining`
- `02 Mine preparation`
- `03 Mine organization`
- ...
- `25 HR and organization`

Si agregas `26 Mirko test`, aparecerá al final de la lista.

---

## ⚠️ **Notas Importantes**

1. **Slug debe ser único**: No puede haber dos topics con el mismo `slug`
2. **Slug debe ser URL-friendly**: Usa guiones, sin espacios, sin caracteres especiales
3. **Name puede tener formato libre**: Incluye el número y el nombre descriptivo
4. **El orden se controla con `.order()`**: Actualmente es por `name` para mantener el orden numérico

---

## 🔍 **Archivos Relevantes**

- `src/components/dashboard/forms/ProfileEditForm.tsx` - Formulario de edición de perfil
- `src/components/social/LeftSidebar.astro` - Barra lateral izquierda
- `src/pages/mining/[slug].astro` - Páginas de temas
- `topics_seed.sql` - Script de seed inicial (referencia histórica)

---

## ✅ **Resumen**

- ✅ **1 sola tabla**: `topics` en Supabase
- ✅ **Agregar módulo**: Solo insertar en `topics`
- ✅ **Automático**: Aparece en todos los lugares automáticamente
- ✅ **Sin cambios de código**: Solo necesitas agregar el registro en la BD


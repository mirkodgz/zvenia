# 🚀 Guía de Ejecución: Matching y Merge de Usuarios

## ✅ Lo que está listo

### 1. Script SQL de Tablas de Referencia
- **Archivo:** `database/create_reference_tables.sql`
- **Contenido:**
  - Tabla `countries` (todos los países)
  - Tabla `mining_topics` (25 topics)
  - Tabla `languages` (4 idiomas)
- **Estado:** ✅ Listo para ejecutar

### 2. Script de Matching Inteligente
- **Archivo:** `scripts/match_and_merge_users.ts`
- **Funcionalidades:**
  - ✅ Matching por email normalizado
  - ✅ Conversión de strings a IDs de tablas de referencia
  - ✅ Parsing de arrays serializados PHP
  - ✅ Manejo de usuarios UPDATE e INSERT
  - ✅ Solo llenar campos vacíos (no sobrescribir)
- **Estado:** ✅ Listo para ejecutar

---

## 📋 Pasos para Ejecutar

### Paso 1: Crear Tablas de Referencia

1. Ve a **Supabase Dashboard** → **SQL Editor**
2. Click en **New Query**
3. Copia y pega el contenido completo de: `database/create_reference_tables.sql`
4. Click en **Run** o presiona `Ctrl+Enter`
5. Verifica que no haya errores (debería decir "Success")

**Verificación:**
```sql
-- Verificar que las tablas existen
SELECT COUNT(*) FROM countries;      -- Debe ser ~250
SELECT COUNT(*) FROM mining_topics;   -- Debe ser 25
SELECT COUNT(*) FROM languages;       -- Debe ser 4
```

---

### Paso 2: Ejecutar Script de Matching

```bash
npx tsx scripts/match_and_merge_users.ts
```

**El script hará:**
1. ✅ Cargar tablas de referencia desde Supabase
2. ✅ Leer CSV de Supabase (1,500 usuarios)
3. ✅ Leer CSV de WordPress (1,650 usuarios)
4. ✅ Matching por email normalizado
5. ✅ Convertir strings a IDs
6. ✅ Parsear arrays serializados PHP
7. ✅ Generar CSV completo

**Output esperado:**
- Archivo: `public/users_complete_2026-01-22.csv`
- Estadísticas: UPDATE vs INSERT

---

### Paso 3: Revisar CSV Generado

1. Descarga el CSV: `http://localhost:4321/users_complete_2026-01-22.csv`
2. Revisa:
   - ✅ Usuarios marcados como UPDATE
   - ✅ Usuarios marcados como INSERT
   - ✅ IDs de tablas de referencia correctos
   - ✅ Arrays parseados correctamente
3. Verifica algunos usuarios manualmente

---

### Paso 4: Actualizar Supabase (Próximo paso)

Una vez que apruebes el CSV, ejecutaremos el script de actualización que:
1. **UPDATE** usuarios existentes (solo campos vacíos)
2. **INSERT** usuarios nuevos (crear en `auth.users` y `profiles`)
3. **Forzar reset de password** para todos los usuarios

---

## ⚠️ Notas Importantes

### Matching por Email
- Se normaliza el email (lowercase, trim)
- Si no hay match, se crea como usuario nuevo

### Solo Llenar Vacíos
- Para usuarios existentes, **NO se sobrescriben** datos que ya tienen valor
- Solo se llenan campos vacíos

### Arrays Serializados PHP
- El script parsea automáticamente arrays como: `a:1:{i:0;s:7:"English";}`
- Los convierte a arrays de IDs de tablas de referencia

### Usuarios Nuevos
- Se marcan como `action: INSERT`
- Necesitarán ser creados en `auth.users` y `profiles`
- Password será forzado a reset (no se genera temporal)

---

## 📊 Columnas del CSV Final

### Identificación
- `action` - "UPDATE" o "INSERT"
- `is_new_user` - true/false
- `id` - UUID del usuario (null para nuevos)
- `email` - Email normalizado

### Datos Básicos
- `username`, `role`, `first_name`, `last_name`, `full_name`
- `profile_slug` - Slug generado del email

### Campos Directos
- `phone_number`, `company`, `profession`, `position`
- `current_location`, `headline_user`

### Campos con IDs (FK)
- `nationality`, `nationality_id`
- `work_country`, `work_country_id`
- `main_language`, `main_language_id`
- `main_area_of_expertise`, `main_area_of_expertise_id`

### Metadata (Arrays de IDs)
- `metadata_others_languages` - IDs separados por `;`
- `metadata_others_areas_of_expertise` - IDs separados por `;`
- `metadata_z_promoter_*` - Datos de Z-PROMOTER
- `metadata_z_ads_*` - Datos de Z-ADS

---

## 🎯 Siguiente Paso

Una vez que ejecutes el script y revises el CSV, avísame y crearemos el script de actualización a Supabase.

---

**Última actualización:** 22/01/2026


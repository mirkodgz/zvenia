# 📋 Propuesta: Estructura de Datos y Tablas de Referencia

## 1️⃣ Explicación de la Pregunta 1 (Sobrescribir Datos)

### Pregunta Original:
**"¿Sobrescribir si Supabase tiene valor?"**

### Explicación:
Cuando hago el match entre WordPress y Supabase, puede pasar que:

**Caso A:** Supabase tiene `company = "ZVENIA"` y WordPress tiene `user-company = "Nueva Empresa"`
- ❌ **Sobrescribir:** Cambiaría a "Nueva Empresa" (pierdes datos de Supabase)
- ✅ **Solo llenar vacíos:** Mantendría "ZVENIA" (preservas datos existentes)

**Caso B:** Supabase tiene `company = ""` (vacío) y WordPress tiene `user-company = "Nueva Empresa"`
- ✅ **Solo llenar vacíos:** Llenaría con "Nueva Empresa" (completas datos faltantes)

**Mi Propuesta:** Solo llenar campos vacíos (NO sobrescribir)
- ✅ Preserva datos que ya existen en Supabase
- ✅ Solo completa lo que falta
- ✅ Más seguro para la migración

**¿Estás de acuerdo con esto?**

---

## 2️⃣ Estructura de Tablas de Referencia (Lookup Tables)

### ✅ Propuesta: Crear Tablas de Referencia Reutilizables

En lugar de guardar strings directamente, creamos **tablas de referencia** que se pueden reutilizar en múltiples campos.

### Estructura Propuesta:

#### **Tabla 1: `countries`** (Reutilizable)
```sql
CREATE TABLE countries (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE,  -- ej: "AF", "US"
  name VARCHAR(100),         -- ej: "Afghanistan"
  display_name VARCHAR(100) -- ej: "Afghanistan"
);
```

**Uso:**
- `profiles.nationality` → FK a `countries.id`
- `profiles.work_country` → FK a `countries.id`

**Ventajas:**
- ✅ Una sola tabla para ambos campos
- ✅ Fácil de mantener (actualizar países en un solo lugar)
- ✅ Consistencia de datos
- ✅ Búsqueda más eficiente

---

#### **Tabla 2: `mining_topics`** (Reutilizable)
```sql
CREATE TABLE mining_topics (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE,   -- ej: "01-general-mining"
  name VARCHAR(100),          -- ej: "01 General mining"
  display_name VARCHAR(100),  -- ej: "General mining"
  order_index INTEGER         -- Para ordenar en Select
);
```

**Uso:**
- `profiles.main_area_of_expertise` → FK a `mining_topics.id`
- `profiles.metadata.others_areas_of_expertise` → Array de FK a `mining_topics.id`
- `profiles.metadata.z_promoter.priority_1` → FK a `mining_topics.id`
- `profiles.metadata.z_promoter.priority_2` → FK a `mining_topics.id`
- `profiles.metadata.z_promoter.priority_3` → FK a `mining_topics.id`
- `profiles.metadata.z_ads.where_to_advertise` → Array de FK a `mining_topics.id`

**Ventajas:**
- ✅ Una sola tabla para todos los topics
- ✅ Reutilizable en múltiples campos
- ✅ Fácil agregar/quitar topics
- ✅ Consistencia en nombres

---

#### **Tabla 3: `languages`** (Reutilizable)
```sql
CREATE TABLE languages (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE,   -- ej: "es", "en"
  name VARCHAR(50),           -- ej: "Spanish", "English"
  display_name VARCHAR(50)    -- ej: "Spanish"
);
```

**Uso:**
- `profiles.main_language` → FK a `languages.id`
- `profiles.metadata.others_languages` → Array de FK a `languages.id`

**Ventajas:**
- ✅ Una sola tabla para idiomas
- ✅ Reutilizable en main y others
- ✅ Fácil agregar idiomas nuevos

---

## 3️⃣ Estructura de Datos en `profiles`

### Campos Directos (FK a tablas de referencia):
```sql
profiles.nationality → countries.id (INTEGER)
profiles.work_country → countries.id (INTEGER)
profiles.main_area_of_expertise → mining_topics.id (INTEGER)
profiles.main_language → languages.id (INTEGER)
```

### Campos en Metadata (Arrays de FK):
```json
{
  "others_areas_of_expertise": [1, 2, 3],  // Array de mining_topics.id
  "others_languages": [1, 2],              // Array de languages.id
  "z_promoter": {
    "priority_1": 5,                       // mining_topics.id
    "priority_2": 8,                       // mining_topics.id
    "priority_3": 12                       // mining_topics.id
  },
  "z_ads": {
    "where_to_advertise": [1, 2, 3, 4]    // Array de mining_topics.id
  }
}
```

---

## 4️⃣ Mapeo de Campos desde WordPress CSV

### Campos Simples (Directos):
| WordPress | Supabase | Tipo | Tabla Referencia |
|-----------|----------|------|------------------|
| `nationality` | `nationality` | FK | `countries` |
| `work_country` | `work_country` | FK | `countries` |
| `main-areaofexpertise` | `main_area_of_expertise` | FK | `mining_topics` |
| `main-language` | `main_language` | FK | `languages` |
| `user-company` | `company` | TEXT | - |
| `user-profession` | `profession` | TEXT | - |
| `current-position` | `position` | TEXT | - |
| `current-location` | `current_location` | TEXT | - |
| `headline-user` | `headline_user` | TEXT | - |
| `user_phone_number` | `phone_number` | TEXT | - |

### Campos en Metadata (Arrays):
| WordPress | Supabase Path | Tipo | Tabla Referencia |
|-----------|---------------|------|------------------|
| `others-areasofexpertise` | `metadata.others_areas_of_expertise` | Array[FK] | `mining_topics` |
| `others-language` | `metadata.others_languages` | Array[FK] | `languages` |
| `priority_1` | `metadata.z_promoter.priority_1` | FK | `mining_topics` |
| `priority_2` | `metadata.z_promoter.priority_2` | FK | `mining_topics` |
| `priority_3` | `metadata.z_promoter.priority_3` | FK | `mining_topics` |
| `where_to_advertise` | `metadata.z_ads.where_to_advertise` | Array[FK] | `mining_topics` |

---

## 5️⃣ Proceso de Migración

### Paso 1: Crear Tablas de Referencia
```sql
-- Insertar países
INSERT INTO countries (code, name, display_name) VALUES
  ('AF', 'Afghanistan', 'Afghanistan'),
  ('AL', 'Albania', 'Albania'),
  ...
  ('ZW', 'Zimbabwe', 'Zimbabwe');

-- Insertar mining topics (necesito los 25 que mencionas)
INSERT INTO mining_topics (code, name, display_name, order_index) VALUES
  ('01-general-mining', '01 General mining', 'General mining', 1),
  ('02-mine-preparation', '02 Mine preparation', 'Mine preparation', 2),
  ...
  ('25-otro', '25 Otro', 'Otro', 25);

-- Insertar idiomas
INSERT INTO languages (code, name, display_name) VALUES
  ('es', 'Spanish', 'Spanish'),
  ('en', 'English', 'English'),
  ('ru', 'Russian', 'Russian'),
  ('fr', 'French', 'French');
```

### Paso 2: Matching y Conversión
1. Leer CSV WordPress
2. Para cada campo:
   - Buscar en tabla de referencia por nombre
   - Obtener el `id` correspondiente
   - Guardar el `id` en lugar del string
3. Para arrays:
   - Parsear string serializado PHP
   - Buscar cada item en tabla de referencia
   - Crear array de `id`s
   - Guardar como JSON array

### Paso 3: Generar CSV Final
- Columnas directas con `id`s (FK)
- Metadata con arrays de `id`s
- Archivo listo para revisión

---

## 6️⃣ Ventajas de Esta Estructura

### ✅ Reutilización
- Una tabla `countries` para `nationality` y `work_country`
- Una tabla `mining_topics` para 5 campos diferentes
- Una tabla `languages` para `main_language` y `others_languages`

### ✅ Consistencia
- No hay variaciones en nombres (ej: "USA" vs "United States")
- Todos usan los mismos valores de referencia

### ✅ Mantenibilidad
- Actualizar un país en un solo lugar
- Agregar un topic nuevo se refleja en todos los campos

### ✅ Performance
- Búsquedas más rápidas (índices en `id`)
- Menos espacio (guardar `id` en lugar de strings largos)

### ✅ Frontend
- Fácil crear Select/Checkbox desde tablas
- Datos normalizados y consistentes

---

## 7️⃣ Preguntas para Confirmar

### Pregunta 1: ¿Sobrescribir datos existentes?
- **Propuesta:** NO, solo llenar vacíos
- **¿Confirmas?**

### Pregunta 2: ¿Estructura con tablas de referencia?
- **Propuesta:** Sí, crear `countries`, `mining_topics`, `languages`
- **¿Confirmas?**

### Pregunta 3: ¿Necesitas los 25 mining topics?
- ✅ **Ya tengo la lista completa** (encontrada en `topics_seed.sql`):
  1. 01 General mining
  2. 02 Mine preparation
  3. 03 Mine organization
  4. 04 Geotechnics
  5. 05 Drilling
  6. 06 Blasting
  7. 07 Ground support
  8. 08 Ventilation
  9. 09 Topography
  10. 10 Loading and hauling
  11. 11 Resource estimation
  12. 12 Economics and costs
  13. 13 Reserve calculations
  14. 14 Optimization and design
  15. 15 Planning
  16. 16 Grade control
  17. 17 Finances and markets
  18. 18 Performance levels
  19. 19 Data management
  20. 20 Facilities
  21. 21 QHSE
  22. 22 Logistics and purchasing
  23. 23 Maintenance
  24. 24 Legal and tax
  25. 25 HR and organization

### Pregunta 4: ¿others-languages como Select o Checkbox?
- **Tu sugerencia:** Select (mejor)
- **Propuesta:** Select múltiple (permite varios idiomas)
- **¿Confirmas?**

---

## 8️⃣ Próximos Pasos

1. ✅ Confirmar estructura de tablas de referencia
2. ⏭️ Obtener lista completa de 25 mining topics
3. ⏭️ Crear script SQL para tablas de referencia
4. ⏭️ Crear script de matching con conversión a FK
5. ⏭️ Generar CSV final con `id`s

---

**¿Te parece bien esta estructura? ¿Alguna modificación?**


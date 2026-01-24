# ✅ RESUMEN FINAL - Propuesta de Matching y Estructura

## 📋 Respuestas a tus Preguntas

### 1️⃣ ¿Sobrescribir datos existentes?
**Respuesta:** NO, solo llenar campos vacíos
- ✅ Preserva datos que ya existen en Supabase
- ✅ Solo completa lo que falta
- ✅ Más seguro para la migración

### 2️⃣ ¿Formato de Arrays?
**Respuesta:** Sí, String separado por `;` en CSV, pero en Supabase se guardarán como:
- **Arrays JSON** en metadata (ej: `[1, 2, 3]` donde son IDs de tablas de referencia)
- Esto permite crear Select/Checkbox fácilmente desde las tablas de referencia

### 3️⃣ ¿Columnas Separadas?
**Respuesta:** ✅ SÍ, columnas separadas para fácil revisión

---

## 🗄️ Estructura Propuesta: Tablas de Referencia

### ✅ Ventaja Principal: REUTILIZACIÓN

En lugar de guardar strings directamente, usamos **tablas de referencia** que se pueden reutilizar:

#### **Tabla 1: `countries`**
- **Uso:** `nationality` y `work_country` (ambos usan la misma tabla)
- **Ventaja:** Una sola tabla para ambos campos

#### **Tabla 2: `mining_topics`** (25 topics)
- **Uso:** 
  - `main_area_of_expertise` (Select)
  - `others_areas_of_expertise` (Checkbox - Array)
  - `priority_1`, `priority_2`, `priority_3` (Select)
  - `where_to_advertise` (Checkbox - Array)
- **Ventaja:** Una sola tabla para 5 campos diferentes

#### **Tabla 3: `languages`** (4 idiomas)
- **Uso:**
  - `main_language` (Select)
  - `others_languages` (Select múltiple - Array)
- **Ventaja:** Una sola tabla para ambos campos

---

## 📊 Los 25 Mining Topics (Ya identificados)

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

---

## 🔄 Mapeo Final de Campos

### Campos Directos (TEXT - Sin tabla de referencia):
- `user-company` → `company`
- `user-profession` → `profession`
- `current-position` → `position`
- `current-location` → `current_location`
- `headline-user` → `headline_user`
- `user_phone_number` → `phone_number`

### Campos con Tabla de Referencia (FK):
- `nationality` → `countries.id` (FK)
- `work_country` → `countries.id` (FK)
- `main-areaofexpertise` → `mining_topics.id` (FK)
- `main-language` → `languages.id` (FK)

### Campos en Metadata (Arrays de FK):
- `others-areasofexpertise` → `metadata.others_areas_of_expertise` → Array de `mining_topics.id`
- `others-language` → `metadata.others_languages` → Array de `languages.id`
- `priority_1` → `metadata.z_promoter.priority_1` → `mining_topics.id`
- `priority_2` → `metadata.z_promoter.priority_2` → `mining_topics.id`
- `priority_3` → `metadata.z_promoter.priority_3` → `mining_topics.id`
- `where_to_advertise` → `metadata.z_ads.where_to_advertise` → Array de `mining_topics.id`

### Campos Z-PROMOTER (TEXT):
- `why_do_you_want` → `metadata.z_promoter.why`
- `how_can_you_contribute` → `metadata.z_promoter.contribute`

### Campos Z-ADS (TEXT):
- `company_name_zads` → `metadata.z_ads.company_name`
- `company_website_zads` → `metadata.z_ads.company_website`
- `primary_contact_name_z_ads` → `metadata.z_ads.primary_contact_name`
- `primary_contact_email_z_ads` → `metadata.z_ads.primary_contact_email`
- `primary_contact_phone_z_ads` → `metadata.z_ads.primary_contact_phone`
- `product_description_zads` → `metadata.z_ads.product_description`

---

## 🎯 Proceso de Implementación

### Paso 1: Crear Tablas de Referencia
1. Crear tabla `countries` con todos los países
2. Crear tabla `mining_topics` con los 25 topics
3. Crear tabla `languages` con 4 idiomas

### Paso 2: Script de Matching y Creación
1. Leer CSV Supabase (1,500 usuarios)
2. Leer CSV WordPress (1,650 usuarios)
3. **Matching por email (normalizado):**
   - Si existe en Supabase → **ACTUALIZAR** (solo llenar vacíos)
   - Si NO existe en Supabase → **CREAR NUEVO USUARIO**
4. Para cada campo:
   - Si es campo con tabla de referencia → Buscar ID en tabla
   - Si es array → Parsear y buscar cada ID
   - Solo llenar si Supabase está vacío (para usuarios existentes)
5. Generar CSV completo con IDs:
   - Usuarios existentes: marcados como "UPDATE"
   - Usuarios nuevos: marcados como "INSERT"

### Paso 3: Revisión
- CSV generado en `public/users_complete_2026-01-22.csv`
- Revisar manualmente:
  - Usuarios a actualizar
  - Usuarios nuevos a crear
- Aprobar para actualización

### Paso 4: Actualización a Supabase
- Script para:
  1. **UPDATE** usuarios existentes (solo campos vacíos)
  2. **INSERT** usuarios nuevos (crear en `auth.users` y `profiles`)

---

## ✅ Confirmaciones Necesarias

1. ✅ **Sobrescribir:** NO, solo llenar vacíos (para usuarios existentes)
2. ✅ **Usuarios nuevos:** SÍ, crear usuarios que no existen en Supabase
3. ✅ **Tablas de referencia:** SÍ, crear `countries`, `mining_topics`, `languages`
4. ✅ **Arrays:** Guardar como arrays de IDs en metadata JSON
5. ✅ **Columnas separadas:** SÍ, para fácil revisión
6. ✅ **others-languages:** Select múltiple (mejor que checkbox)

---

## 📊 Manejo de Usuarios Nuevos

### Usuarios Existentes (~1,500)
- **Acción:** UPDATE (solo llenar campos vacíos)
- **Matching:** Por email normalizado
- **Preservar:** Datos que ya existen en Supabase

### Usuarios Nuevos (~150)
- **Acción:** INSERT (crear nuevo usuario)
- **Proceso:**
  1. Crear en `auth.users` (con email y password temporal)
  2. Crear en `profiles` (con todos los datos de WordPress)
  3. Generar `profile_slug` automáticamente
  4. Asignar rol `Basic` por defecto (o el que tenga en WordPress)

### CSV Final Incluirá:
- Columna `action`: "UPDATE" o "INSERT"
- Todos los datos necesarios para ambos casos

---

## 🚀 ¿Procedo con la Implementación?

Si confirmas todo lo anterior, procedo a:
1. Crear scripts SQL para tablas de referencia
2. Crear script de matching inteligente
3. Generar CSV completo para revisión

**¿Todo está correcto? ¿Algún cambio antes de implementar?**


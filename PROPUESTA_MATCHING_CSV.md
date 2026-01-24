# 📋 Propuesta: Matching Inteligente de CSVs

## 🎯 Objetivo
Hacer match entre usuarios de Supabase y WordPress para completar datos faltantes.

---

## 📊 Análisis de Archivos

### CSV Supabase (`users_export_2026-01-22.csv`)
- **Total usuarios:** 1,540
- **Campo clave para matching:** `email`
- **Columnas actuales:** 22 campos directos
- **Estado:** Muchos campos vacíos

### CSV WordPress (`user-export-wordpress-1-697236a535238.csv`)
- **Total usuarios:** ~1,651 (líneas - 1 header)
- **Campo clave para matching:** `user_email`
- **Columnas:** 200+ columnas (muchas de WordPress internas)
- **Estado:** Datos completos de WordPress

---

## 🔗 Estrategia de Matching

### 1. Matching por Email (Principal)
- **Supabase:** `email`
- **WordPress:** `user_email`
- **Normalización:** 
  - Convertir a lowercase
  - Trim espacios
  - Comparación exacta después de normalización

### 2. Matching Alternativo (Si email no coincide)
- **Supabase:** `username` o `profile_slug`
- **WordPress:** `user_login` o `user_nicename`
- **Solo si el email no encuentra match**

---

## 📝 Mapeo de Columnas

### Campos Directos (Columnas en Supabase)

| WordPress Column | Supabase Column | Tipo | Notas |
|-----------------|----------------|------|-------|
| `user-company` | `company` | TEXT | Directo |
| `nationality` | `nationality` | TEXT | Directo |
| `main-areaofexpertise` | `main_area_of_expertise` | TEXT | Directo |
| `main-language` | `main_language` | TEXT | Directo |
| `user-profession` | `profession` | TEXT | Directo |
| `current-position` | `position` | TEXT | Directo |
| `current-location` | `current_location` | TEXT | Directo |
| `headline-user` | `headline_user` | TEXT | Directo |
| `work_country` | `work_country` | TEXT | Directo |
| `user_phone_number` | `phone_number` | TEXT | Directo |

### Campos en Metadata (JSON)

| WordPress Column | Supabase Path | Tipo | Notas |
|-----------------|---------------|------|-------|
| `others-areasofexpertise` | `metadata.others_areas_of_expertise` | Array | Parsear si es string serializado |
| `others-language` | `metadata.others_languages` | Array | Parsear si es string serializado |
| `why_do_you_want` | `metadata.z_promoter.why` | TEXT | Objeto z_promoter |
| `how_can_you_contribute` | `metadata.z_promoter.contribute` | TEXT | Objeto z_promoter |
| `priority_1` | `metadata.z_promoter.priority_1` | TEXT | Objeto z_promoter |
| `priority_2` | `metadata.z_promoter.priority_2` | TEXT | Objeto z_promoter |
| `priority_3` | `metadata.z_promoter.priority_3` | TEXT | Objeto z_promoter |
| `company_name_zads` | `metadata.z_ads.company_name` | TEXT | Objeto z_ads |
| `company_website_zads` | `metadata.z_ads.company_website` | TEXT | Objeto z_ads |
| `primary_contact_name_z_ads` | `metadata.z_ads.primary_contact_name` | TEXT | Objeto z_ads |
| `primary_contact_email_z_ads` | `metadata.z_ads.primary_contact_email` | TEXT | Objeto z_ads |
| `primary_contact_phone_z_ads` | `metadata.z_ads.primary_contact_phone` | TEXT | Objeto z_ads |
| `product_description_zads` | `metadata.z_ads.product_description` | TEXT | Objeto z_ads |
| `where_to_advertise` | `metadata.z_ads.where_to_advertise` | TEXT | Objeto z_ads |

---

## 🔍 Procesamiento de Datos

### 1. Parsing de Arrays Serializados
WordPress puede tener arrays serializados en formato PHP:
- `a:2:{i:0;s:5:"English";i:1;s:7:"Spanish";}`
- Necesito parsear esto a array JSON: `["English", "Spanish"]`

### 2. Manejo de Valores Vacíos
- Si WordPress tiene valor pero Supabase está vacío → **Actualizar**
- Si ambos tienen valor → **Mantener Supabase** (no sobrescribir)
- Si WordPress está vacío → **No tocar**

### 3. Estructura de Metadata
```json
{
  "others_languages": ["English", "Spanish"],
  "others_areas_of_expertise": ["General mining", "Drilling"],
  "z_promoter": {
    "why": "...",
    "contribute": "...",
    "priority_1": "...",
    "priority_2": "...",
    "priority_3": "..."
  },
  "z_ads": {
    "company_name": "...",
    "company_website": "...",
    "primary_contact_name": "...",
    "primary_contact_email": "...",
    "primary_contact_phone": "...",
    "product_description": "...",
    "where_to_advertise": "..."
  }
}
```

---

## 📤 Output del Script

### Archivo Generado: `users_complete_2026-01-22.csv`

**Estructura:**
1. **Todas las columnas de Supabase** (22 columnas base)
2. **Columnas adicionales para metadata:**
   - `metadata_others_languages` (string separado por `;`)
   - `metadata_others_areas_of_expertise` (string separado por `;`)
   - `metadata_z_promoter_why`
   - `metadata_z_promoter_contribute`
   - `metadata_z_promoter_priority_1`
   - `metadata_z_promoter_priority_2`
   - `metadata_z_promoter_priority_3`
   - `metadata_z_ads_company_name`
   - `metadata_z_ads_company_website`
   - `metadata_z_ads_primary_contact_name`
   - `metadata_z_ads_primary_contact_email`
   - `metadata_z_ads_primary_contact_phone`
   - `metadata_z_ads_product_description`
   - `metadata_z_ads_where_to_advertise`

**Total:** ~35 columnas

---

## ⚙️ Lógica del Script

### Paso 1: Cargar Archivos
- Leer CSV Supabase → Diccionario por `email`
- Leer CSV WordPress → Diccionario por `user_email`

### Paso 2: Matching
```typescript
for each supabaseUser in supabaseUsers:
  email = normalize(supabaseUser.email)
  wpUser = wordpressUsers[email]
  
  if wpUser exists:
    // Hacer merge de datos
    mergeData(supabaseUser, wpUser)
  else:
    // Usuario no encontrado en WordPress
    // Mantener datos de Supabase
```

### Paso 3: Merge de Datos
```typescript
function mergeData(supabase, wordpress):
  // Solo actualizar si Supabase está vacío
  if !supabase.company && wordpress['user-company']:
    supabase.company = wordpress['user-company']
  
  // Parsear arrays serializados
  if wordpress['others-language']:
    supabase.metadata.others_languages = parseArray(wordpress['others-language'])
  
  // Construir objetos anidados
  if wordpress['why_do_you_want']:
    supabase.metadata.z_promoter = {
      why: wordpress['why_do_you_want'],
      contribute: wordpress['how_can_you_contribute'],
      ...
    }
```

### Paso 4: Generar CSV
- Crear CSV con todas las columnas
- Arrays convertidos a strings separados por `;`
- Metadata aplanada en columnas separadas

---

## 📊 Estadísticas que Mostrará el Script

1. **Total usuarios en Supabase:** 1,540
2. **Total usuarios en WordPress:** ~1,651
3. **Matches encontrados:** X
4. **Matches por email exacto:** X
5. **Matches por username:** X
6. **Usuarios sin match:** X
7. **Campos actualizados:** X por campo
8. **Usuarios con datos completos:** X

---

## ⚠️ Consideraciones Importantes

### 1. Parsing de Arrays Serializados PHP
WordPress usa formato PHP serializado. Necesito:
- Detectar formato `a:N:{...}`
- Parsear a array JavaScript
- Convertir a JSON string

### 2. Normalización de Emails
- Lowercase
- Trim
- Manejar variaciones (espacios, puntos, etc.)

### 3. Validación de Datos
- Verificar que los emails sean válidos
- Validar formatos de arrays
- Manejar caracteres especiales en CSV

### 4. Preservación de Datos Existentes
- **NO sobrescribir** si Supabase ya tiene valor
- Solo llenar campos vacíos
- Log de cambios para revisión

---

## 🎯 Resultado Final

### Archivo: `users_complete_2026-01-22.csv`
- Ubicación: `public/users_complete_2026-01-22.csv`
- Formato: CSV con todas las columnas
- Listo para revisión manual
- Después de aprobación → Script de actualización a Supabase

---

## ✅ Checklist de Implementación

- [ ] Leer y parsear CSV de Supabase
- [ ] Leer y parsear CSV de WordPress
- [ ] Implementar normalización de emails
- [ ] Implementar matching por email
- [ ] Implementar matching alternativo (username)
- [ ] Parsear arrays serializados PHP
- [ ] Merge de datos (solo llenar vacíos)
- [ ] Construir estructura de metadata
- [ ] Generar CSV completo
- [ ] Generar reporte de estadísticas
- [ ] Manejar errores y casos edge

---

## 💡 Preguntas para Confirmar

1. **¿Sobrescribir si Supabase tiene valor?**
   - Propuesta: NO, solo llenar vacíos
   - ¿Confirmas?

2. **¿Qué hacer con usuarios sin match?**
   - Propuesta: Mantener en CSV pero marcados
   - ¿Confirmas?

3. **¿Formato de arrays en CSV?**
   - Propuesta: String separado por `;` (ej: "English; Spanish")
   - ¿Confirmas?

4. **¿Metadata como columnas separadas o JSON?**
   - Propuesta: Columnas separadas para fácil revisión
   - ¿Confirmas?

---

**¿Te parece bien esta propuesta? ¿Algún cambio antes de implementar?**


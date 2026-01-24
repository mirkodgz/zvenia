# 🚀 GUÍA PASO A PASO - Ejecución Completa

## ✅ PASO 1: Verificar Archivos Necesarios

### Archivos que DEBEN existir:
- ✅ `public/users_export_2026-01-22.csv` - CSV de Supabase
- ✅ `public/user-export-wordpress-1-697236a535238.csv` - CSV de WordPress
- ✅ `database/create_reference_tables.sql` - Script SQL
- ✅ `scripts/match_and_merge_users.ts` - Script de matching

---

## 📋 PASO 2: Crear Tablas de Referencia en Supabase

### Instrucciones:
1. Abre tu navegador
2. Ve a: **Supabase Dashboard** → Tu proyecto
3. Click en **SQL Editor** (menú lateral izquierdo)
4. Click en **New Query** (botón verde arriba)
5. Abre el archivo: `database/create_reference_tables.sql`
6. **Copia TODO el contenido** del archivo
7. **Pega** en el editor SQL de Supabase
8. Click en **Run** (o presiona `Ctrl+Enter`)
9. Espera a que diga **"Success"** (puede tardar unos segundos)

### Verificación:
Después de ejecutar, ejecuta esto en Supabase SQL Editor:
```sql
SELECT COUNT(*) as countries FROM countries;
SELECT COUNT(*) as topics FROM mining_topics;
SELECT COUNT(*) as languages FROM languages;
```

**Resultados esperados:**
- countries: ~250
- topics: 25
- languages: 4

---

## 🔄 PASO 3: Ejecutar Script de Matching

### En tu terminal (PowerShell):
```bash
npx tsx scripts/match_and_merge_users.ts
```

### ¿Qué hace este script?
1. ✅ Se conecta a Supabase
2. ✅ Carga las tablas de referencia
3. ✅ Lee CSV de Supabase (1,500 usuarios)
4. ✅ Lee CSV de WordPress (1,650 usuarios)
5. ✅ Hace matching por email
6. ✅ Convierte strings a IDs
7. ✅ Parsea arrays PHP
8. ✅ Genera CSV completo

### Tiempo estimado: 2-5 minutos

### Output esperado:
```
🚀 Iniciando matching y merge de usuarios...
📊 Cargando tablas de referencia...
✅ Countries: 250
✅ Mining Topics: 25
✅ Languages: 4
📥 Leyendo CSV de Supabase...
✅ Usuarios en Supabase: 1540
📥 Leyendo CSV de WordPress...
✅ Usuarios en WordPress: 1651
🔄 Procesando usuarios...
   Procesados: 100/1651
   Procesados: 200/1651
   ...
✅ Procesamiento completado
   UPDATE: 1500
   INSERT: 151
📝 Generando CSV final...
✅ CSV generado exitosamente!
📁 Archivo guardado en: D:\def\zveniaproject\public\users_complete_2026-01-22.csv
```

---

## 📊 PASO 4: Revisar CSV Generado

### Opción 1: Desde el navegador
```
http://localhost:4321/users_complete_2026-01-22.csv
```

### Opción 2: Desde el sistema de archivos
```
D:\def\zveniaproject\public\users_complete_2026-01-22.csv
```

### Qué revisar:
1. ✅ Columna `action`: Debe tener "UPDATE" e "INSERT"
2. ✅ Columna `is_new_user`: true/false
3. ✅ IDs de tablas de referencia (nationality_id, etc.)
4. ✅ Arrays parseados (metadata_others_languages, etc.)
5. ✅ Algunos usuarios manualmente para verificar datos

---

## ✅ PASO 5: Confirmar y Aprobar

Una vez que revises el CSV y estés satisfecho:
- ✅ Confirma que los datos se ven correctos
- ✅ Verifica algunos usuarios manualmente
- ✅ Asegúrate de que los IDs de tablas de referencia son correctos

**Cuando apruebes, procederemos con el PASO 6: Actualización a Supabase**

---

## ⚠️ IMPORTANTE

- ✅ **NO ejecutes el script de actualización** hasta que apruebes el CSV
- ✅ El CSV es solo para **revisión** - no modifica Supabase aún
- ✅ Puedes ejecutar el script de matching **múltiples veces** sin problemas

---

## 🆘 Si algo sale mal

### Error: "Missing Supabase environment variables"
- Verifica que `.env` tenga `PUBLIC_SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`

### Error: "Error cargando countries"
- Verifica que ejecutaste el SQL de tablas de referencia (PASO 2)

### Error: "Cannot find module csv-parse"
- Ejecuta: `npm install csv-parse`

### El CSV no se genera
- Verifica que los archivos CSV estén en `public/`
- Verifica permisos de escritura en `public/`

---

**¿Listo para empezar? Empecemos con el PASO 1**


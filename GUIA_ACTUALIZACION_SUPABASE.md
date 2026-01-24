# 🚀 Guía: Actualización Final a Supabase

## ⚠️ IMPORTANTE ANTES DE EJECUTAR

### Backup Recomendado
Antes de ejecutar la actualización, es recomendable hacer un backup de la tabla `profiles`:

```sql
-- En Supabase SQL Editor, ejecuta esto para crear un backup
CREATE TABLE profiles_backup_2026_01_22 AS SELECT * FROM profiles;
```

---

## 📋 PASO 1: Ejecutar Script de Actualización

### Comando:
```bash
npx tsx scripts/update_users_to_supabase.ts
```

### ¿Qué hace este script?

#### Para usuarios UPDATE (1,533):
1. ✅ Actualiza campos vacíos en `profiles`
2. ✅ Actualiza campos con IDs de tablas de referencia
3. ✅ Mergea metadata (no sobrescribe, solo agrega)
4. ✅ Preserva datos existentes

#### Para usuarios INSERT (20):
1. ✅ Crea usuario en `auth.users`
2. ✅ Crea perfil en `profiles` con todos los datos
3. ✅ Genera `profile_slug` automáticamente
4. ✅ Asigna rol desde WordPress o `Basic` por defecto
5. ✅ Crea password temporal (forzará reset)

### Tiempo estimado: 5-10 minutos

---

## 📊 Output Esperado

```
🚀 Iniciando actualización de usuarios a Supabase...
📥 Leyendo CSV completo...
✅ Total usuarios en CSV: 1553
📊 Usuarios a actualizar: 1533
📊 Usuarios nuevos a crear: 20
🔄 Procesando usuarios UPDATE...
   Actualizados: 100/1533
   Actualizados: 200/1533
   ...
✅ UPDATE completado: 1533/1533
🔄 Procesando usuarios INSERT...
   Creados: 10/20
   Creados: 20/20
✅ INSERT completado: 20/20
📊 RESUMEN FINAL:
================================
✅ Usuarios actualizados: 1533
✅ Usuarios nuevos creados: 20
❌ Errores: 0
🎉 ¡Migración completada!
```

---

## ⚠️ Si hay Errores

Si el script muestra errores:
1. Revisa el archivo de errores generado: `public/migration_errors_YYYY-MM-DD.txt`
2. Los errores más comunes:
   - Email duplicado → Usuario ya existe
   - Foreign key violation → ID de tabla de referencia no existe
   - Constraint violation → Datos inválidos

---

## 🔐 Password Reset

### Para TODOS los usuarios:
- ✅ Usuarios existentes: Mantienen su password actual (pero recomendamos reset)
- ✅ Usuarios nuevos: Tienen password temporal (deben usar "Forgot Password")

### Recomendación:
Después de la migración, envía un email a todos los usuarios informándoles que:
1. La migración está completa
2. Deben usar "Forgot Password" para resetear su contraseña
3. Su email sigue siendo el mismo

---

## ✅ Verificación Post-Migración

### Verificar usuarios actualizados:
```sql
SELECT COUNT(*) FROM profiles WHERE updated_at > NOW() - INTERVAL '1 hour';
```

### Verificar usuarios nuevos:
```sql
SELECT COUNT(*) FROM profiles WHERE created_at > NOW() - INTERVAL '1 hour';
```

### Verificar datos completos:
```sql
SELECT 
  COUNT(*) as total,
  COUNT(company) as with_company,
  COUNT(nationality) as with_nationality,
  COUNT(main_language) as with_language
FROM profiles;
```

---

## 🎯 Siguiente Paso

Una vez que la migración esté completa:
1. ✅ Verifica algunos usuarios manualmente
2. ✅ Prueba login con algunos usuarios
3. ✅ Verifica que los datos se muestren correctamente en `/dashboard/user-area`

---

**¿Listo para ejecutar? Avísame cuando estés listo y procedemos.**


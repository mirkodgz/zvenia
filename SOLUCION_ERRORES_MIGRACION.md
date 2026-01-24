# 🔧 Solución de Errores de Migración

## ❌ Error Encontrado

El script de actualización falló con el error:
```
Could not find the 'metadata' column of 'profiles' in the schema cache
```

## 🔍 Causa

La columna `metadata` no existe en la tabla `profiles` en Supabase, aunque está definida en `database.types.ts`.

## ✅ Solución

### PASO 1: Agregar Columna Metadata

1. Ve a **Supabase Dashboard** → **SQL Editor**
2. Click en **New Query**
3. Copia y pega el contenido de: `database/add_metadata_column.sql`
4. Click en **Run**
5. Debería decir "Success"

### PASO 2: Re-ejecutar Script de Actualización

Después de agregar la columna, ejecuta de nuevo:

```bash
npx tsx scripts/update_users_to_supabase.ts
```

---

## 📊 Resultados Parciales del Primer Intento

- ✅ **884 usuarios actualizados** exitosamente
- ❌ **649 usuarios con error** (falta columna metadata)
- ❌ **20 usuarios nuevos** no se pudieron crear (errores de auth)

---

## 🎯 Después de Agregar Metadata

El script debería:
- ✅ Actualizar los 649 usuarios que fallaron
- ✅ Crear los 20 usuarios nuevos
- ✅ Completar la migración al 100%

---

**¿Listo para agregar la columna metadata?**


# ✅ Guía de Ejecución de Migración - Paso a Paso

## 🎯 Objetivo
Agregar todos los campos personalizados de WordPress a la tabla `profiles` en Supabase.

---

## 📋 Paso 1: Ejecutar Migración SQL

### Opción A: Desde Supabase Dashboard (Recomendado)

1. Ve a tu proyecto en **Supabase Dashboard**
2. Click en **SQL Editor** (en el menú lateral)
3. Click en **New Query**
4. Copia y pega el contenido completo de: `database/migration_add_user_fields.sql`
5. Click en **Run** o presiona `Ctrl+Enter`
6. Verifica que no haya errores (debería decir "Success")

### Opción B: Desde línea de comandos (si tienes psql)

```bash
psql -h [tu-host] -U postgres -d postgres -f database/migration_add_user_fields.sql
```

---

## 📋 Paso 2: Verificar la Migración

1. En Supabase Dashboard → **SQL Editor**
2. Copia y pega el contenido de: `scripts/test_migration.sql`
3. Ejecuta el script
4. Verifica que:
   - ✅ Todas las columnas aparecen en la lista
   - ✅ La función `generate_profile_slug` existe
   - ✅ El índice `idx_profiles_slug` existe
   - ✅ Los triggers están creados
   - ✅ Los usuarios tienen slugs generados

---

## 📋 Paso 3: Actualizar TypeScript Types

**¡YA ESTÁ HECHO!** ✅

He actualizado `src/types/database.types.ts` con todos los nuevos campos. No necesitas hacer nada más.

---

## 📋 Paso 4: Probar las Páginas

### Probar User Area (Área Privada)
1. Asegúrate de estar logueado
2. Ve a: `http://localhost:4321/dashboard/user-area`
3. Deberías ver tu perfil completo

### Probar Perfil Público
1. Obtén tu slug (debería estar en tu perfil o ejecuta):
   ```sql
   SELECT email, profile_slug FROM profiles WHERE email = 'tu-email@ejemplo.com';
   ```
2. Ve a: `http://localhost:4321/profile/{tu-slug}/zv-user/`
3. Deberías ver tu perfil público

---

## 🔍 Verificación Final

### Verificar que un usuario tiene slug:
```sql
SELECT id, email, profile_slug, full_name 
FROM profiles 
WHERE email = 'mirkodgzbusiness@gmail.com';
```

### Verificar que el trigger funciona:
```sql
-- Crear un usuario de prueba
INSERT INTO profiles (id, email, full_name)
VALUES (gen_random_uuid(), 'test@example.com', 'Test User')
RETURNING email, profile_slug;
-- Debería generar automáticamente el slug
```

---

## ⚠️ Si Algo Sale Mal

### Error: "column already exists"
- ✅ **No es problema** - El `IF NOT EXISTS` evita duplicados
- La migración es **idempotente** (puedes ejecutarla múltiples veces)

### Error: "duplicate key value violates unique constraint"
- Esto significa que hay emails duplicados generando el mismo slug
- El trigger `ensure_unique_slug` debería manejar esto automáticamente
- Si persiste, ejecuta:
  ```sql
  UPDATE profiles
  SET profile_slug = generate_profile_slug(email) || '-' || substr(id::text, 1, 8)
  WHERE profile_slug IS NULL;
  ```

### Error: "function does not exist"
- Verifica que ejecutaste TODA la migración SQL
- No ejecutes solo partes, ejecuta el archivo completo

---

## ✅ Checklist Final

- [ ] Migración SQL ejecutada sin errores
- [ ] Script de verificación ejecutado correctamente
- [ ] TypeScript types actualizados (ya hecho)
- [ ] Página `/dashboard/user-area` funciona
- [ ] Página `/profile/[slug]/zv-user/` funciona
- [ ] Los usuarios existentes tienen slugs generados

---

## 🚀 Siguiente Paso: Migración de Datos de WordPress

Una vez que esto esté funcionando, podemos crear el script para migrar los ~1500 usuarios de WordPress a Supabase.

---

**Última actualización:** 22/01/2026


# 📋 Guía: Agregar Columnas first_name y last_name

## 🎯 Situación Actual

- ✅ Los datos **SÍ fueron migrados** desde WordPress
- ✅ El `full_name` contiene "ZVENIA ACCOUNT" (combinado)
- ❌ Las columnas `first_name` y `last_name` **NO existen** en la tabla `profiles`
- ❌ Por eso el formulario de edición falla

## 🔧 Solución: Ejecutar Script SQL

### Paso 1: Abrir Supabase Dashboard

1. Ve a tu proyecto en **Supabase Dashboard**
2. Click en **SQL Editor** (menú lateral izquierdo)
3. Click en **New Query**

### Paso 2: Ejecutar el Script

1. Copia y pega el contenido completo de: `database/add_first_last_name_columns.sql`
2. Click en **Run** o presiona `Ctrl+Enter`
3. Verifica que no haya errores (debería decir "Success")

### Paso 3: Verificar Resultados

El script hará lo siguiente:

1. ✅ **Agregar columnas** `first_name` y `last_name` si no existen
2. ✅ **Separar automáticamente** `full_name` en `first_name` y `last_name` para usuarios existentes
   - Ejemplo: `full_name = "ZVENIA ACCOUNT"` → `first_name = "ZVENIA"`, `last_name = "ACCOUNT"`
3. ✅ **Mostrar ejemplos** de la actualización

### Paso 4: Verificar en Supabase

1. Ve a **Table Editor** → `profiles`
2. Verifica que ahora veas las columnas `first_name` y `last_name`
3. Verifica que los datos estén separados correctamente

## 📊 Ejemplo de Resultado

**Antes:**
```
full_name: "ZVENIA ACCOUNT"
first_name: (no existe)
last_name: (no existe)
```

**Después:**
```
full_name: "ZVENIA ACCOUNT"
first_name: "ZVENIA"
last_name: "ACCOUNT"
```

## ⚠️ Nota Importante

El script de separación automática:
- Solo actualiza usuarios que tienen `full_name` con al menos un espacio
- Solo actualiza si `first_name` y `last_name` están vacíos
- Si un usuario tiene `full_name = "Juan"` (una sola palabra), no se separará

## ✅ Después de Ejecutar

1. El formulario de edición (`/dashboard/profile/edit`) funcionará correctamente
2. Podrás editar `first_name` y `last_name` por separado
3. El `full_name` se generará automáticamente desde `first_name` + `last_name`


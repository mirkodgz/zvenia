-- Agregar columnas first_name y last_name si no existen
-- Fecha: 2026-01-24
-- Descripción: Estas columnas deberían existir según los tipos TypeScript, pero pueden no estar en la BD real

-- Verificar y agregar first_name
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'first_name'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN first_name TEXT;
        
        RAISE NOTICE 'Columna first_name agregada exitosamente';
    ELSE
        RAISE NOTICE 'Columna first_name ya existe';
    END IF;
END $$;

-- Verificar y agregar last_name
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'last_name'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN last_name TEXT;
        
        RAISE NOTICE 'Columna last_name agregada exitosamente';
    ELSE
        RAISE NOTICE 'Columna last_name ya existe';
    END IF;
END $$;

-- Verificar que las columnas existen
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
  AND column_name IN ('first_name', 'last_name', 'full_name')
ORDER BY column_name;

-- OPCIONAL: Separar full_name en first_name y last_name para usuarios existentes
-- Este script intenta dividir full_name en dos partes (primera palabra = first_name, resto = last_name)
-- Solo actualiza si first_name y last_name están vacíos
UPDATE public.profiles
SET 
    first_name = SPLIT_PART(full_name, ' ', 1),
    last_name = SUBSTRING(full_name FROM LENGTH(SPLIT_PART(full_name, ' ', 1)) + 2)
WHERE 
    full_name IS NOT NULL 
    AND full_name != ''
    AND (first_name IS NULL OR first_name = '')
    AND (last_name IS NULL OR last_name = '')
    AND full_name LIKE '% %'; -- Solo si tiene al menos un espacio (dos palabras)

-- Mostrar algunos ejemplos de la actualización
SELECT 
    id,
    email,
    full_name,
    first_name,
    last_name
FROM public.profiles
WHERE full_name IS NOT NULL
LIMIT 10;


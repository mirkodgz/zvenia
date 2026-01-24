-- Verificar y agregar columnas faltantes en profiles
-- Fecha: 2026-01-22

-- Verificar y agregar position si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'position'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN position TEXT;
        
        RAISE NOTICE 'Columna position agregada exitosamente';
    ELSE
        RAISE NOTICE 'Columna position ya existe';
    END IF;
END $$;

-- Verificar metadata
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'metadata'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
        
        CREATE INDEX IF NOT EXISTS idx_profiles_metadata ON public.profiles USING GIN (metadata);
        
        RAISE NOTICE 'Columna metadata agregada exitosamente';
    ELSE
        RAISE NOTICE 'Columna metadata ya existe';
    END IF;
END $$;

-- Verificar todas las columnas esperadas
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
  AND column_name IN (
    'position', 'metadata', 'phone_number', 'nationality', 
    'profession', 'work_country', 'current_location', 
    'headline_user', 'main_language', 'main_area_of_expertise',
    'username', 'profile_slug'
  )
ORDER BY column_name;


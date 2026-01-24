-- Agregar columna metadata si no existe
-- Fecha: 2026-01-22

-- Verificar y agregar columna metadata
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
        
        RAISE NOTICE 'Columna metadata agregada exitosamente';
    ELSE
        RAISE NOTICE 'Columna metadata ya existe';
    END IF;
END $$;

-- Crear índice GIN para búsquedas eficientes en JSONB
CREATE INDEX IF NOT EXISTS idx_profiles_metadata ON public.profiles USING GIN (metadata);

-- Comentario
COMMENT ON COLUMN public.profiles.metadata IS 'Campos personalizados en formato JSON (equivalente a meta boxes de WordPress)';


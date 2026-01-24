-- Ejemplo: Agregar un nuevo módulo/topic
-- Fecha: 2026-01-24
-- Descripción: Script de ejemplo para agregar el módulo "26 Mirko test"

-- IMPORTANTE: Este es solo un EJEMPLO. 
-- Para agregar un módulo real, cambia el slug y name según necesites.

-- Verificar si el topic ya existe (evitar duplicados)
DO $$
BEGIN
    -- Intentar insertar el nuevo topic
    INSERT INTO public.topics (slug, name)
    VALUES ('mirko-test', '26 Mirko test')
    ON CONFLICT (slug) DO NOTHING; -- Si ya existe, no hacer nada
    
    RAISE NOTICE 'Topic agregado exitosamente (o ya existía)';
END $$;

-- Verificar que se agregó correctamente
SELECT id, slug, name, created_at 
FROM public.topics 
WHERE slug = 'mirko-test';

-- Listar todos los topics ordenados por nombre
SELECT id, slug, name 
FROM public.topics 
ORDER BY name;


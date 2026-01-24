-- Migration: Agregar campos de usuario faltantes
-- Fecha: 2026-01-22
-- Descripción: Agregar campos personalizados de WordPress a la tabla profiles

-- 1. Agregar columnas directas para campos frecuentes
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS nationality TEXT,
ADD COLUMN IF NOT EXISTS profession TEXT,
ADD COLUMN IF NOT EXISTS work_country TEXT,
ADD COLUMN IF NOT EXISTS current_location TEXT,
ADD COLUMN IF NOT EXISTS headline_user TEXT,
ADD COLUMN IF NOT EXISTS main_language TEXT,
ADD COLUMN IF NOT EXISTS main_area_of_expertise TEXT,
ADD COLUMN IF NOT EXISTS username TEXT,
ADD COLUMN IF NOT EXISTS profile_slug TEXT UNIQUE;

-- 2. Crear índice para búsqueda rápida por slug
CREATE INDEX IF NOT EXISTS idx_profiles_slug ON public.profiles(profile_slug);

-- 3. Crear función para generar slug del email
CREATE OR REPLACE FUNCTION generate_profile_slug(email_address TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(email_address, '@', '', 'g'),
        '[^a-z0-9]', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 4. Generar slugs para usuarios existentes que no tengan uno
UPDATE public.profiles
SET profile_slug = generate_profile_slug(email)
WHERE profile_slug IS NULL OR profile_slug = '';

-- 5. Crear trigger para generar slug automáticamente al insertar/actualizar email
CREATE OR REPLACE FUNCTION auto_generate_profile_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email IS NOT NULL AND (NEW.profile_slug IS NULL OR NEW.profile_slug = '') THEN
    NEW.profile_slug := generate_profile_slug(NEW.email);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_generate_slug ON public.profiles;
CREATE TRIGGER trigger_auto_generate_slug
  BEFORE INSERT OR UPDATE OF email ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_profile_slug();

-- 7. Manejar posibles duplicados de slug (agregar sufijo numérico si es necesario)
CREATE OR REPLACE FUNCTION ensure_unique_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  IF NEW.profile_slug IS NULL OR NEW.profile_slug = '' THEN
    base_slug := generate_profile_slug(NEW.email);
    final_slug := base_slug;
    
    -- Verificar si el slug ya existe (excluyendo el registro actual en UPDATE)
    WHILE EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profile_slug = final_slug 
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) LOOP
      counter := counter + 1;
      final_slug := base_slug || '-' || counter;
    END LOOP;
    
    NEW.profile_slug := final_slug;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_ensure_unique_slug ON public.profiles;
CREATE TRIGGER trigger_ensure_unique_slug
  BEFORE INSERT OR UPDATE OF email, profile_slug ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION ensure_unique_slug();

-- 6. Comentarios para documentación
COMMENT ON COLUMN public.profiles.phone_number IS 'Número de teléfono del usuario';
COMMENT ON COLUMN public.profiles.nationality IS 'Nacionalidad del usuario';
COMMENT ON COLUMN public.profiles.profession IS 'Profesión del usuario';
COMMENT ON COLUMN public.profiles.work_country IS 'País donde trabaja el usuario';
COMMENT ON COLUMN public.profiles.current_location IS 'Ubicación actual del usuario';
COMMENT ON COLUMN public.profiles.headline_user IS 'Headline o título profesional del usuario';
COMMENT ON COLUMN public.profiles.main_language IS 'Idioma principal del usuario';
COMMENT ON COLUMN public.profiles.main_area_of_expertise IS 'Área principal de expertise (ej: 01 General mining)';
COMMENT ON COLUMN public.profiles.username IS 'Nombre de usuario (opcional, puede ser diferente del email)';
COMMENT ON COLUMN public.profiles.profile_slug IS 'Slug único generado del email para URLs públicas (ej: tagiyevemin489gmail-com)';


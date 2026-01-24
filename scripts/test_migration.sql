-- Script de prueba para verificar la migración
-- Ejecuta esto DESPUÉS de ejecutar migration_add_user_fields.sql

-- 1. Verificar que las columnas existen
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
  AND column_name IN (
    'phone_number', 'nationality', 'profession', 'work_country',
    'current_location', 'headline_user', 'main_language',
    'main_area_of_expertise', 'username', 'profile_slug'
  )
ORDER BY column_name;

-- 2. Verificar que la función existe
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'generate_profile_slug';

-- 3. Probar la función de generación de slug
SELECT 
  email,
  generate_profile_slug(email) as generated_slug,
  profile_slug as current_slug
FROM profiles
LIMIT 10;

-- 4. Verificar que el índice existe
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'profiles'
  AND indexname = 'idx_profiles_slug';

-- 5. Verificar que el trigger existe
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND event_object_table = 'profiles'
  AND trigger_name LIKE '%slug%';

-- 6. Contar usuarios con slug generado
SELECT 
  COUNT(*) as total_users,
  COUNT(profile_slug) as users_with_slug,
  COUNT(*) - COUNT(profile_slug) as users_without_slug
FROM profiles;


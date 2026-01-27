/* 
  SQL Migration: Relax Profile Constraints
  Run this in Supabase Dashboard -> SQL Editor
  
  This script ensures that only 'id' and 'email' are strictly required.
  All other profile fields will be made OPTIONAL to prevent Signup 500 Errors.
*/

-- 1. Make text fields optional
ALTER TABLE public.profiles ALTER COLUMN username DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN full_name DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN first_name DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN last_name DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN avatar_url DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN website DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN profession DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN company DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN headline_user DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN current_location DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN role DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN country DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN phone_number DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN nationality DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN work_country DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN main_language DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN main_area_of_expertise DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN profile_slug DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN metadata DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN position DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN region DROP NOT NULL;

-- 2. Add a default value to 'role' just in case
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'Basic';

-- 3. Ensure profile_slug can be null initially (it might be generated later)
-- If there is a unique constraint on profile_slug, we might need to handle duplicates,
-- but usually dropping NOT NULL is enough for the insert to pass.

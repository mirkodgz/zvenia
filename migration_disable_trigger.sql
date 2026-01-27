/*
  SQL Migration: Disable Broken Auth Trigger
  
  DIAGNOSIS:
  The table 'public.profiles' accepts our data (verified via direct insert test).
  The 500 Error is caused by the 'on_auth_user_created' Trigger function crashing 
  during execution (likely due to internal logic errors or type mismatches).

  SOLUTION:
  We will DROP the trigger. 
  We will then handle Profile creation directly in the API/Code, 
  which gives us full control and visible error messages.
*/

-- Drop the trigger from auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user ON auth.users;

-- Optional: Drop the function to keep it clean (if you want)
-- DROP FUNCTION IF EXISTS public.handle_new_user();

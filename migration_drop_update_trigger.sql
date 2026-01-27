/*
  SQL Migration: Drop Incorrect Update Trigger
  
  ANALYSIS:
  The screenshot revealed a trigger named 'on_auth_user_updated' 
  that executes 'handle_new_user()'.
  
  PROBLEM:
  Running "New User" logic on every "Update" is incorrect and dangerous.
  This is likely firing during the Signup process (when Supabase updates 
  last_sign_in or tokens) and crashing because the function expects 
  fresh creation data (or fails duplicate checks).
  
  SOLUTION:
  Drop this specific trigger. 
  We already handle Profile Creation manually in our API code (signup.ts).
*/

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- Note: We do NOT drop the function 'handle_new_user' just in case 
-- it's used elsewhere, but we disconnect it from the Update event.

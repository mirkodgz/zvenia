import { d as defineMiddleware, s as sequence } from './chunks/index_D6hfqxdq.mjs';
import { createServerClient } from '@supabase/ssr';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_ChO5iSlK.mjs';
import 'piccolore';
import './chunks/astro/server_DxclfMW8.mjs';
import 'clsx';

const onRequest$1 = defineMiddleware(async (context, next) => {
  const supabaseUrl = "https://ddgdtdhgaqeqnoigmfrh.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZ2R0ZGhnYXFlcW5vaWdtZnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNDE3NjMsImV4cCI6MjA4MjYxNzc2M30.aSW3Ds1z-8ta1sx-22P3NGyx4jzaY0aGNPPB9PsFcs0";
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(key) {
        return context.cookies.get(key)?.value;
      },
      set(key, value, options) {
        context.cookies.set(key, value, options);
      },
      remove(key, options) {
        context.cookies.delete(key, options);
      }
    }
  });
  context.locals.supabase = supabase;
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role, country").eq("id", user.id).single();
    if (profile) {
      user.role = profile.role || "Basic";
      user.country = profile.country;
    }
  }
  context.locals.user = user;
  return next();
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };

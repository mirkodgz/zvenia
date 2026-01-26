import { d as defineMiddleware, s as sequence } from './chunks/index_Co6w9F7S.mjs';
import { createServerClient } from '@supabase/ssr';
import './chunks/supabase_HTSrsVit.mjs';
import { i as isAdministrator } from './chunks/roles_DL-H1sB4.mjs';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_CBZfTrh9.mjs';
import 'piccolore';
import './chunks/astro/server_CNOy-_Bn.mjs';
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
    data: { session }
  } = await supabase.auth.getSession();
  const user = session?.user || null;
  context.locals.session = session;
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role, country, full_name, first_name, last_name, avatar_url, profile_slug").eq("id", user.id).single();
    if (profile) {
      user.role = profile.role || "Basic";
      user.country = profile.country;
      user.full_name = profile.full_name;
      user.first_name = profile.first_name;
      user.last_name = profile.last_name;
      user.avatar_url = profile.avatar_url;
      user.profile_slug = profile.profile_slug;
    }
    context.locals.user = user;
    context.locals.profile = profile ? {
      id: user.id,
      email: user.email,
      role: profile.role || "Basic",
      full_name: profile.full_name || user.email,
      avatar_url: profile.avatar_url || null,
      profile_slug: profile.profile_slug || null
    } : null;
  } else {
    context.locals.user = null;
    context.locals.profile = null;
  }
  if (context.url.pathname.startsWith("/z-posts/")) {
    const slug = context.url.pathname.replace("/z-posts/", "").replace(/\/$/, "");
    if (slug) {
      return context.redirect(`/post/${slug}`, 301);
    }
  }
  if (context.url.pathname.startsWith("/admin")) {
    if (context.url.pathname === "/admin/login") {
      return next();
    }
    if (!user) {
      return context.redirect("/admin/login");
    }
    const { data: profile } = await supabase.from("profiles").select("role, full_name, avatar_url").eq("id", user.id).single();
    if (!profile) {
      console.error("Error fetching user profile for admin access");
      return context.redirect("/admin/login");
    }
    const userRole = profile.role || "Basic";
    if (!isAdministrator(userRole)) {
      return context.redirect("/?error=unauthorized");
    }
    context.locals.profile = {
      id: user.id,
      email: user.email,
      role: userRole,
      full_name: profile.full_name || user.email,
      avatar_url: profile.avatar_url || null,
      profile_slug: null
      // Admin access doesn't necessarily need a slug, but type requires it
    };
  }
  return next();
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };

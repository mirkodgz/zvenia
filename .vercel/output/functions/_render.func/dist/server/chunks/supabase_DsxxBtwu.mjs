import { createClient } from '@supabase/supabase-js';
import { createBrowserClient, createServerClient, parseCookieHeader } from '@supabase/ssr';

const supabaseUrl = "https://ddgdtdhgaqeqnoigmfrh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZ2R0ZGhnYXFlcW5vaWdtZnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNDE3NjMsImV4cCI6MjA4MjYxNzc2M30.aSW3Ds1z-8ta1sx-22P3NGyx4jzaY0aGNPPB9PsFcs0";
const supabase = createBrowserClient(
  supabaseUrl,
  supabaseKey
);
const createSupabaseServerClient = (context) => {
  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookieOptions: {
        secure: true,
        // Only use secure cookies in production (HTTPS)
        sameSite: "lax",
        path: "/"
      },
      cookies: {
        get(key) {
          if (context.cookies) {
            const cookie = context.cookies.get(key);
            return cookie?.value;
          }
          const cookies = parseCookieHeader(context.req.headers.get("Cookie") ?? "");
          return cookies.find((c) => c.name === key)?.value;
        },
        set(key, value, options) {
          if (context.cookies) {
            context.cookies.set(key, value, {
              ...options,
              path: "/",
              secure: false,
              // HARDCODED FALSE: Crucial for localhost OAuth flow
              sameSite: "lax",
              httpOnly: true,
              maxAge: 60 * 60 * 24 * 7
              // 1 week (Force persistence)
            });
            return;
          }
        },
        remove(key, options) {
          if (context.cookies) {
            context.cookies.delete(key, {
              ...options,
              path: "/",
              secure: false,
              // HARDCODED FALSE: Match set() to ensure deletion works
              sameSite: "lax",
              httpOnly: true
            });
            return;
          }
        }
      }
    }
  );
};
function getServiceSupabase() {
  const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZ2R0ZGhnYXFlcW5vaWdtZnJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA0MTc2MywiZXhwIjoyMDgyNjE3NzYzfQ.7NDs-99j4TtSDwkol4OVRTIeyFWJYd6LzzMFeHuQdK0";
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export { createSupabaseServerClient as c, getServiceSupabase as g, supabase as s };

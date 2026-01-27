import { c as createSupabaseServerClient } from '../../../chunks/supabase_DsxxBtwu.mjs';
import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../../renderers.mjs';

const SUPABASE_URL = "https://ddgdtdhgaqeqnoigmfrh.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZ2R0ZGhnYXFlcW5vaWdtZnJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA0MTc2MywiZXhwIjoyMDgyNjE3NzYzfQ.7NDs-99j4TtSDwkol4OVRTIeyFWJYd6LzzMFeHuQdK0";
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
}) ;
const POST = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }
  const supabase = createSupabaseServerClient({ req: request, cookies });
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) {
    if (error.message === "Invalid login credentials" && supabaseAdmin) {
      const { data: profile } = await supabaseAdmin.from("profiles").select("id, email").eq("email", email).single();
      if (profile) {
        try {
          const emailResponse = await fetch(`${new URL(request.url).origin}/api/auth/send-migration-email`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ email })
          });
          const emailData = await emailResponse.json();
        } catch (e) {
          console.error("Error enviando email de migración:", e);
        }
        return new Response(JSON.stringify({
          error: "We've migrated to a new platform! Your password needs to be reset. We've sent you an email with instructions to reset your password.",
          code: "migration_required",
          emailSent: true
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    return new Response(JSON.stringify({
      error: error.message,
      code: error.status || 400
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  return redirect("/");
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

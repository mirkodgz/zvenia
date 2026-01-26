import { createClient } from '@supabase/supabase-js';
import { i as isAdministrator } from '../../../../chunks/roles_C8ezOKbC.mjs';
export { renderers } from '../../../../renderers.mjs';

const supabaseAdmin = createClient(
  "https://ddgdtdhgaqeqnoigmfrh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZ2R0ZGhnYXFlcW5vaWdtZnJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA0MTc2MywiZXhwIjoyMDgyNjE3NzYzfQ.7NDs-99j4TtSDwkol4OVRTIeyFWJYd6LzzMFeHuQdK0",
  { auth: { autoRefreshToken: false, persistSession: false } }
);
const DELETE = async ({ request, cookies }) => {
  const supabaseAuth = createClient(
    "https://ddgdtdhgaqeqnoigmfrh.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZ2R0ZGhnYXFlcW5vaWdtZnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNDE3NjMsImV4cCI6MjA4MjYxNzc2M30.aSW3Ds1z-8ta1sx-22P3NGyx4jzaY0aGNPPB9PsFcs0",
    {
      global: { headers: { Cookie: request.headers.get("cookie") || "" } }
    }
  );
  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const { data: requesterProfile } = await supabaseAdmin.from("profiles").select("role").eq("id", user.id).single();
  if (!requesterProfile || !isAdministrator(requesterProfile.role)) {
    return new Response(JSON.stringify({ error: "Forbidden: Admins only" }), { status: 403 });
  }
  const url = new URL(request.url);
  const targetUserId = url.searchParams.get("id");
  if (!targetUserId) {
    return new Response(JSON.stringify({ error: "Missing ID" }), { status: 400 });
  }
  if (targetUserId === user.id) {
    return new Response(JSON.stringify({ error: "Cannot delete yourself" }), { status: 400 });
  }
  console.log(`[ADMIN] Deleting user: ${targetUserId}`);
  const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(targetUserId);
  if (deleteAuthError) {
    console.error("Delete Error:", deleteAuthError);
    return new Response(JSON.stringify({ error: deleteAuthError.message }), { status: 500 });
  }
  await supabaseAdmin.from("profiles").delete().eq("id", targetUserId);
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
const POST = async ({ request }) => {
  const supabaseAuth = createClient(
    "https://ddgdtdhgaqeqnoigmfrh.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZ2R0ZGhnYXFlcW5vaWdtZnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNDE3NjMsImV4cCI6MjA4MjYxNzc2M30.aSW3Ds1z-8ta1sx-22P3NGyx4jzaY0aGNPPB9PsFcs0",
    {
      global: { headers: { Cookie: request.headers.get("cookie") || "" } }
    }
  );
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  const { data: requesterProfile } = await supabaseAdmin.from("profiles").select("role").eq("id", user.id).single();
  if (!requesterProfile || !isAdministrator(requesterProfile.role)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }
  const body = await request.json();
  const { email, password, role, fullName } = body;
  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Email and password required" }), { status: 400 });
  }
  const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      role: role || "Basic"
    }
  });
  if (createError) {
    return new Response(JSON.stringify({ error: createError.message }), { status: 500 });
  }
  if (newUser.user) {
    await supabaseAdmin.from("profiles").upsert({
      id: newUser.user.id,
      email,
      role: role || "Basic",
      full_name: fullName,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  return new Response(JSON.stringify({ success: true, user: newUser.user }), { status: 200 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    DELETE,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

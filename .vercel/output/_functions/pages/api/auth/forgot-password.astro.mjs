import { c as createSupabaseServerClient } from '../../../chunks/supabase_DsxxBtwu.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  if (!email) {
    return new Response(JSON.stringify({ error: "Email is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const supabase = createSupabaseServerClient({ req: request, cookies });
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${new URL(request.url).origin}/reset-password`
  });
  if (error) {
    return new Response(JSON.stringify({
      message: "If an account exists with this email, a password reset link has been sent."
    }), {
      status: 200,
      // Siempre retornar 200 para no revelar si el email existe
      headers: { "Content-Type": "application/json" }
    });
  }
  return new Response(JSON.stringify({
    message: "If an account exists with this email, a password reset link has been sent."
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

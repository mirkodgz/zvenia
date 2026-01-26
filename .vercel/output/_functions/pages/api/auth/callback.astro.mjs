import { c as createSupabaseServerClient } from '../../../chunks/supabase_DZBRYQhj.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ url, request, cookies, redirect }) => {
  const authCode = url.searchParams.get("code");
  if (!authCode) {
    return new Response("No code provided", { status: 400 });
  }
  const supabase = createSupabaseServerClient({ req: request, cookies });
  const { error } = await supabase.auth.exchangeCodeForSession(authCode);
  if (error) {
    console.error("Auth Callback Error (Handled Gracefully):", error.message);
    const next2 = url.searchParams.get("next") || "/";
    return redirect(next2);
  }
  const next = url.searchParams.get("next") || "/";
  return redirect(next);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

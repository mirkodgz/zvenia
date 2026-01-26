import { c as createSupabaseServerClient } from '../../../chunks/supabase_DZBRYQhj.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ request, cookies, redirect }) => {
  const supabase = createSupabaseServerClient({ req: request, cookies });
  await supabase.auth.signOut();
  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });
  const projectRef = "ddgdtdhgaqeqnoigmfrh";
  cookies.delete(`sb-${projectRef}-auth-token`, { path: "/" });
  return redirect("/", 302);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

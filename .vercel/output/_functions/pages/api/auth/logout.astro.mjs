import { c as createSupabaseServerClient } from '../../../chunks/supabase_DsxxBtwu.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ request, cookies, redirect }) => {
  const supabase = createSupabaseServerClient({ req: request, cookies });
  await supabase.auth.signOut();
  return redirect("/admin/login");
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

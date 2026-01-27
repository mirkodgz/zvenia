import { c as createSupabaseServerClient } from '../../chunks/supabase_DsxxBtwu.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async ({ request, cookies }) => {
  const supabase = createSupabaseServerClient({ req: request, cookies });
  const { data, error } = await supabase.from("countries").select("id, name").order("name");
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

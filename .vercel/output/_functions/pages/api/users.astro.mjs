import { c as createSupabaseServerClient } from '../../chunks/supabase_DZBRYQhj.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async ({ request, cookies }) => {
  const supabase = createSupabaseServerClient({ req: request, cookies });
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "12");
  const search = url.searchParams.get("search");
  const role = url.searchParams.get("role");
  const country = url.searchParams.get("country");
  const start = (page - 1) * limit;
  const end = start + limit - 1;
  let query = supabase.from("profiles").select("id, profile_slug, full_name, email, avatar_url, profession, created_at, role, nationality, work_country", { count: "exact" });
  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }
  if (role && role !== "All") {
    query = query.eq("role", role);
  }
  if (country && country !== "All") {
    query = query.eq("work_country", country);
  }
  const { data, count, error } = await query.order("created_at", { ascending: false }).range(start, end);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({
    users: data,
    total: count,
    page,
    totalPages: Math.ceil((count || 0) / limit)
  }), {
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

import { c as createSupabaseServerClient, g as getServiceSupabase } from '../../../chunks/supabase_DsxxBtwu.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies }) => {
  const supabase = createSupabaseServerClient({ req: request, cookies });
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }
  const { postId, eventId, podcastId, serviceId } = body;
  const id = postId || eventId || podcastId || serviceId;
  if (!id) {
    return new Response(JSON.stringify({ error: "Content ID required" }), { status: 400 });
  }
  let table = "posts";
  if (eventId) table = "events";
  if (podcastId) table = "podcasts";
  if (serviceId) table = "services";
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const userRole = profile?.role || "Basic";
  const isModerator = ["Administrator", "CountryManager"].includes(userRole);
  const { data: item, error: fetchError } = await supabase.from(table).select("author_id").eq("id", id).single();
  if (fetchError || !item) {
    return new Response(JSON.stringify({ error: "Item not found" }), { status: 404 });
  }
  if (item.author_id !== user.id && !isModerator) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }
  const adminSupabase = getServiceSupabase();
  const { error: deleteError, count } = await adminSupabase.from(table).delete({ count: "exact" }).eq("id", id);
  if (deleteError) {
    return new Response(JSON.stringify({ error: deleteError.message }), { status: 500 });
  }
  if (count === 0) {
    return new Response(JSON.stringify({ error: "Failed to delete item." }), { status: 403 });
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

import { c as createSupabaseServerClient } from '../../../chunks/supabase_DZBRYQhj.mjs';
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
  const {
    first_name,
    last_name,
    full_name,
    headline_user,
    username,
    phone_number,
    nationality,
    current_location,
    profession,
    company,
    position,
    work_country,
    linkedin_url,
    main_language,
    main_area_of_expertise,
    avatar_url,
    metadata
  } = body;
  const updateData = {};
  if (first_name !== void 0) updateData.first_name = first_name || null;
  if (last_name !== void 0) updateData.last_name = last_name || null;
  if (first_name !== void 0 || last_name !== void 0) {
    const firstName = first_name || "";
    const lastName = last_name || "";
    const generatedFullName = `${firstName} ${lastName}`.trim();
    if (generatedFullName) {
      updateData.full_name = generatedFullName;
    }
  }
  if (full_name !== void 0 && full_name) {
    updateData.full_name = full_name;
  }
  if (headline_user !== void 0) updateData.headline_user = headline_user || null;
  if (username !== void 0) updateData.username = username || null;
  if (phone_number !== void 0) updateData.phone_number = phone_number || null;
  if (nationality !== void 0) updateData.nationality = nationality || null;
  if (current_location !== void 0) updateData.current_location = current_location || null;
  if (profession !== void 0) updateData.profession = profession || null;
  if (company !== void 0) updateData.company = company || null;
  if (position !== void 0) updateData.position = position || null;
  if (work_country !== void 0) updateData.work_country = work_country || null;
  if (linkedin_url !== void 0) updateData.linkedin_url = linkedin_url || null;
  if (main_language !== void 0) updateData.main_language = main_language || null;
  if (main_area_of_expertise !== void 0) updateData.main_area_of_expertise = main_area_of_expertise || null;
  if (avatar_url !== void 0) updateData.avatar_url = avatar_url || null;
  if (metadata !== void 0) updateData.metadata = metadata;
  const { data, error } = await supabase.from("profiles").update(updateData).eq("id", user.id).select().single();
  if (error) {
    console.error("Profile update error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ success: true, data }), { status: 200 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

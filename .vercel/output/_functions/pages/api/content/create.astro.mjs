import { c as createSupabaseServerClient } from '../../../chunks/supabase_DsxxBtwu.mjs';
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
  const { type, data } = body;
  const { data: rawProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const profile = rawProfile;
  const role = profile?.role || "Basic";
  const permissions = {
    post: ["Basic", "Expert", "Ads", "Events", "CountryManager", "Administrator"],
    event: ["Events", "CountryManager", "Administrator"],
    podcast: ["Expert", "CountryManager", "Administrator"],
    service: ["Ads", "CountryManager", "Administrator"]
  };
  if (!permissions[type]?.includes(role)) {
    return new Response(JSON.stringify({
      error: `Permission denied: Role '${role}' cannot create content type '${type}'`
    }), { status: 403 });
  }
  if (type === "post") {
    const { title, slug, excerpt, content, featured_image_url, document_url, topic_id, source, metadata } = data;
    if (!title || !slug) {
      return new Response(JSON.stringify({ error: "Title and Slug are required" }), { status: 400 });
    }
    if (!topic_id) {
      return new Response(JSON.stringify({ error: "Topic is required" }), { status: 400 });
    }
    const { data: topicData, error: topicError } = await supabase.from("topics").select("id").eq("slug", topic_id).single();
    if (topicError || !topicData) {
      return new Response(JSON.stringify({ error: "Invalid Topic selected" }), { status: 400 });
    }
    const { count } = await supabase.from("posts").select("id", { count: "exact", head: true }).eq("slug", slug);
    let finalSlug = slug;
    if (count && count > 0) {
      const uniqueSuffix = Math.random().toString(36).substring(2, 8);
      finalSlug = `${slug}-${uniqueSuffix}`;
    }
    const { data: insertedPost, error: insertError } = await supabase.from("posts").insert({
      title,
      slug: finalSlug,
      excerpt,
      content,
      featured_image_url,
      document_url,
      source,
      author_id: user.id,
      topic_id: topicData.id,
      // Fix: Save topic_id directly
      metadata: metadata || {}
    }).select().single();
    if (insertError) {
      console.error("Error creating post:", insertError);
      return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
    }
    return new Response(JSON.stringify({ success: true, data: insertedPost }), { status: 200 });
  }
  if (type === "event") {
    const {
      title,
      slug: providedSlug,
      description,
      topic_id,
      start_date,
      end_date,
      location,
      cover_photo_url,
      organizer,
      organizer_phone,
      organizer_email,
      type_id,
      language_id,
      format_id,
      price_id,
      official_link,
      start_time,
      schedule_pdf_url
    } = data;
    if (!title || !topic_id || !start_date || !end_date) {
      return new Response(JSON.stringify({ error: "Title, Topic, Start Date and End Date are required" }), { status: 400 });
    }
    const { data: topicData, error: topicError } = await supabase.from("topics").select("id").eq("slug", topic_id).single();
    if (topicError || !topicData) {
      return new Response(JSON.stringify({ error: "Invalid Topic selected" }), { status: 400 });
    }
    const slug = providedSlug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const { count } = await supabase.from("events").select("id", { count: "exact", head: true }).eq("slug", slug);
    let finalSlug = slug;
    if (count && count > 0) {
      const uniqueSuffix = Math.random().toString(36).substring(2, 8);
      finalSlug = `${slug}-${uniqueSuffix}`;
    }
    const { data: insertedEvent, error: insertError } = await supabase.from("events").insert({
      title,
      slug: finalSlug,
      description,
      start_date,
      end_date,
      location,
      featured_image_url: cover_photo_url,
      // For card display
      cover_photo_url,
      // For internal page header
      schedule_pdf_url,
      // New PDF Schedule
      organizer,
      organizer_phone,
      organizer_email,
      type_id,
      language_id,
      format_id,
      price_id,
      external_link: official_link,
      start_time,
      author_id: user.id,
      topic_id: topicData.id
      // Fix: Save topic_id
    }).select().single();
    if (insertError) {
      console.error("Error creating event:", insertError);
      return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
    }
    return new Response(JSON.stringify({ success: true, data: insertedEvent }), { status: 200 });
  }
  if (type === "podcast") {
    const {
      title,
      description,
      topic_id,
      host,
      featured_image_url,
      episodes
      // JSONB Array
    } = data;
    if (!title || !topic_id) {
      return new Response(JSON.stringify({ error: "Title and Topic are required" }), { status: 400 });
    }
    const { data: topicData, error: topicError } = await supabase.from("topics").select("id").eq("slug", topic_id).single();
    if (topicError || !topicData) {
      return new Response(JSON.stringify({ error: "Invalid Topic selected" }), { status: 400 });
    }
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const { count: podCount } = await supabase.from("podcasts").select("id", { count: "exact", head: true }).eq("slug", slug);
    let finalSlug = slug;
    if (podCount && podCount > 0) {
      const uniqueSuffix = Math.random().toString(36).substring(2, 8);
      finalSlug = `${slug}-${uniqueSuffix}`;
    }
    const { data: insertedPodcast, error: insertError } = await supabase.from("podcasts").insert({
      title,
      slug: finalSlug,
      description,
      host,
      cover_image_url: featured_image_url,
      episodes: episodes || [],
      topic_id: topicData.id,
      // Direct Relation
      author_id: user.id
    }).select().single();
    if (insertError) {
      console.error("Error creating podcast:", insertError);
      return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
    }
    return new Response(JSON.stringify({ success: true, data: insertedPodcast }), { status: 200 });
  }
  if (type === "service") {
    const {
      title,
      description,
      topic_id,
      type_id,
      duration_id,
      target_country,
      organizer_company,
      company_link,
      contact_email,
      featured_image_url
    } = data;
    if (!title || !topic_id) {
      return new Response(JSON.stringify({ error: "Title and Topic are required" }), { status: 400 });
    }
    const { data: topicData, error: topicError } = await supabase.from("topics").select("id").eq("slug", topic_id).single();
    if (topicError || !topicData) {
      return new Response(JSON.stringify({ error: "Invalid Topic selected" }), { status: 400 });
    }
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const { count: servCount } = await supabase.from("services").select("id", { count: "exact", head: true }).eq("slug", slug);
    let finalSlug = slug;
    if (servCount && servCount > 0) {
      const uniqueSuffix = Math.random().toString(36).substring(2, 8);
      finalSlug = `${slug}-${uniqueSuffix}`;
    }
    const { data: insertedService, error: insertError } = await supabase.from("services").insert({
      title,
      slug: finalSlug,
      content: description,
      // Map form 'description' to DB 'content'
      topic_id: topicData.id,
      type_id: type_id || null,
      duration_id: duration_id || null,
      target_country,
      organizer_company,
      company_link,
      contact_email,
      featured_image_url,
      quick_view_image_url: featured_image_url,
      // Sync for now
      author_id: user.id
    }).select().single();
    if (insertError) {
      console.error("Error creating service:", insertError);
      return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
    }
    return new Response(JSON.stringify({ success: true, data: insertedService }), { status: 200 });
  }
  return new Response(JSON.stringify({ error: "Invalid content type" }), { status: 400 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

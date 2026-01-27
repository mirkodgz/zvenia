import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_0Ysjtq05.mjs';
import 'piccolore';
import { s as supabase } from '../../chunks/supabase_DsxxBtwu.mjs';
import { $ as $$PostCard } from '../../chunks/PostCard_D5ELRwwj.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_CxJDR4Zz.mjs';

const $$Astro = createAstro();
const $$PostsPartial = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PostsPartial;
  const limit = parseInt(Astro2.url.searchParams.get("limit") || "20");
  const offset = parseInt(Astro2.url.searchParams.get("offset") || "0");
  const slug = Astro2.url.searchParams.get("slug") || "all";
  const search = Astro2.url.searchParams.get("search") || "";
  let query = supabase.from("posts").select(
    "*, author:profiles(full_name, avatar_url, profession, company, profile_slug)"
  );
  if (search) {
    query = query.ilike("title", `%${search}%`);
  }
  if (slug !== "all" && slug !== "all-topics") {
    const { data: topic } = await supabase.from("topics").select("id").eq("slug", slug).single();
    const topicData = topic;
    if (topicData) {
      query = query.eq("topic_id", topicData.id);
    }
  }
  query = query.order("created_at", { ascending: false }).order("id", { ascending: true }).range(offset, offset + limit - 1);
  const { data: posts } = await query;
  const currentUser = Astro2.locals.user;
  return renderTemplate`${posts?.map((post) => renderTemplate`${renderComponent($$result, "PostCard", $$PostCard, { "post": { ...post, type: "Post", collection: "posts" }, "currentUser": currentUser })}`)}`;
}, "D:/zveniaproject/src/pages/partials/posts-partial.astro", void 0);

const $$file = "D:/zveniaproject/src/pages/partials/posts-partial.astro";
const $$url = "/partials/posts-partial";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$PostsPartial,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

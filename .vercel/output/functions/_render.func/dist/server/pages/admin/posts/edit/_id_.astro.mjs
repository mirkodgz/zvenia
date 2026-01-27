import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../../chunks/astro/server_0Ysjtq05.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../../../chunks/AdminLayout_kIrHDt3T.mjs';
import { P as PostFormAdmin } from '../../../../chunks/PostFormAdmin_BxkGT4Uz.mjs';
import { c as createSupabaseServerClient } from '../../../../chunks/supabase_DsxxBtwu.mjs';
import { i as isAdministrator } from '../../../../chunks/roles_C8ezOKbC.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro = createAstro();
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const user = Astro2.locals.user;
  const profile = Astro2.locals.profile;
  const userRole = profile?.role || user?.role || "Basic";
  if (!user || !isAdministrator(userRole)) {
    return Astro2.redirect("/");
  }
  const { id } = Astro2.params;
  if (!id) {
    return Astro2.redirect("/admin/posts");
  }
  const supabase = createSupabaseServerClient({ req: Astro2.request, cookies: Astro2.cookies });
  const { data: post, error } = await supabase.from("posts").select("*").eq("id", id).single();
  if (error || !post) {
    return Astro2.redirect("/admin/posts");
  }
  let topicSlug = "";
  if (post.topic_id) {
    const { data: topicData } = await supabase.from("topics").select("slug").eq("id", post.topic_id).single();
    if (topicData) {
      topicSlug = topicData.slug;
    }
  }
  const { data: topics } = await supabase.from("topics").select("id, name, slug").order("name");
  const initialData = {
    ...post,
    topic_id: topicSlug
  };
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Edit Post", "activePage": "posts" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-6"> <h1 class="text-2xl font-bold text-white tracking-tight">Edit Post</h1> <p class="text-gray-400 text-sm mt-1">Update post information and content.</p> </div>  ${renderComponent($$result2, "PostFormAdmin", PostFormAdmin, { "client:load": true, "currentUser": user, "initialData": initialData, "topics": topics || [], "client:component-hydration": "load", "client:component-path": "D:/zveniaproject/src/components/admin/forms/PostFormAdmin", "client:component-export": "default" })} ` })}`;
}, "D:/zveniaproject/src/pages/admin/posts/edit/[id].astro", void 0);

const $$file = "D:/zveniaproject/src/pages/admin/posts/edit/[id].astro";
const $$url = "/admin/posts/edit/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$id,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

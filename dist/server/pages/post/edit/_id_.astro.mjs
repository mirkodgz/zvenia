import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_DxclfMW8.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../../chunks/Layout_7SPMbouh.mjs';
import { P as PostForm } from '../../../chunks/PostForm_gWR0LH7O.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  if (!id) {
    return Astro2.redirect("/404");
  }
  const user = Astro2.locals.user;
  if (!user) {
    return Astro2.redirect("/login");
  }
  const { data: post, error } = await Astro2.locals.supabase.from("posts").select("*").eq("id", id).single();
  if (error || !post) {
    return Astro2.redirect("/404");
  }
  if (post.author_id !== user.id) {
    return Astro2.redirect("/");
  }
  let topicSlug = "";
  if (post.topic_id) {
    const { data: topicData } = await Astro2.locals.supabase.from("topics").select("slug").eq("id", post.topic_id).single();
    if (topicData) {
      topicSlug = topicData.slug;
    }
  }
  const initialData = {
    ...post,
    topic_id: topicSlug
    // properties must match PostFormData interface in PostForm
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Edit Post: ${post.title}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-8"> <h1 class="text-3xl font-bold text-[var(--text-main)] mb-8 text-center">Edit Post</h1> ${renderComponent($$result2, "PostForm", PostForm, { "client:load": true, "currentUser": user, "initialData": initialData, "client:component-hydration": "load", "client:component-path": "D:/zvenia/astro-frontend/src/components/dashboard/forms/PostForm", "client:component-export": "default" })} </div> ` })}`;
}, "D:/zvenia/astro-frontend/src/pages/post/edit/[id].astro", void 0);

const $$file = "D:/zvenia/astro-frontend/src/pages/post/edit/[id].astro";
const $$url = "/post/edit/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
   __proto__: null,
   default: $$id,
   file: $$file,
   url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

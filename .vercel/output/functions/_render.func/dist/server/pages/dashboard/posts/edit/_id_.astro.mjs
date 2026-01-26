import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../../chunks/astro/server_0Ysjtq05.mjs';
import 'piccolore';
import { $ as $$SocialLayout, a as $$LeftSidebar } from '../../../../chunks/LeftSidebar_DEdUkq9E.mjs';
import { P as PostForm } from '../../../../chunks/PostForm_yIeYG45x.mjs';
export { renderers } from '../../../../renderers.mjs';

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
  const { data: rawPost, error } = await Astro2.locals.supabase.from("posts").select("*").eq("id", id).single();
  if (error || !rawPost) {
    return Astro2.redirect("/404");
  }
  const post = rawPost;
  const role = user.role;
  const isOwner = post.author_id === user.id;
  const isAdmin = role === "Administrator";
  if (!isOwner && !isAdmin) {
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
    content: post.content || void 0,
    excerpt: post.excerpt || void 0,
    featured_image_url: post.featured_image_url || void 0,
    topic_id: topicSlug,
    metadata: post.metadata
  };
  return renderTemplate`${renderComponent($$result, "SocialLayout", $$SocialLayout, { "title": `Edit Post: ${post.title}`, "hideRightSidebar": true }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="max-w-5xl mx-auto px-4 py-8"> <h1 class="text-2xl font-bold text-dark mb-6">Edit Post</h1> ${renderComponent($$result2, "PostForm", PostForm, { "client:load": true, "currentUser": user, "initialData": initialData, "client:component-hydration": "load", "client:component-path": "D:/zveniaproject/src/components/dashboard/forms/PostForm", "client:component-export": "default" })} </div> `, "left-sidebar": async ($$result2) => renderTemplate`${renderComponent($$result2, "LeftSidebar", $$LeftSidebar, { "slot": "left-sidebar" })}` })}`;
}, "D:/zveniaproject/src/pages/dashboard/posts/edit/[id].astro", void 0);

const $$file = "D:/zveniaproject/src/pages/dashboard/posts/edit/[id].astro";
const $$url = "/dashboard/posts/edit/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$id,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

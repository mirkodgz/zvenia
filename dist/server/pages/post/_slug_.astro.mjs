import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DxclfMW8.mjs';
import 'piccolore';
import { $ as $$SocialLayout } from '../../chunks/SocialLayout_CmNf_1R7.mjs';
import { $ as $$RightSidebar, a as $$LeftSidebar } from '../../chunks/RightSidebar_CSUqyzAu.mjs';
import { $ as $$PostCard } from '../../chunks/PostCard_BgmrP_li.mjs';
import { s as supabase } from '../../chunks/supabase_HTSrsVit.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  if (!slug) return Astro2.redirect("/404");
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
  const columnName = isUuid ? "id" : "slug";
  console.log(`[POST DEBUG] slug: "${slug}", isUuid: ${isUuid}, col: ${columnName}`);
  const { data: post, error } = await supabase.from("posts").select(`
        *, 
        author:profiles(full_name, avatar_url, profession, company),
        topic:topics(name, slug)
    `).eq(columnName, slug).single();
  if (error) {
    console.error(`[POST DEBUG] Error fetching post:`, error);
  }
  if (error || !post) {
    console.error("Post not found:", error);
    return Astro2.redirect("/404");
  }
  const currentUser = Astro2.locals.user;
  return renderTemplate`${renderComponent($$result, "SocialLayout", $$SocialLayout, { "title": `${post.title} | Zvenia Social` }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="max-w-3xl mx-auto px-4 sm:px-0"> ${renderComponent($$result2, "PostCard", $$PostCard, { "post": post, "currentUser": currentUser, "isDetail": true })} </div>  `, "left-sidebar": async ($$result2) => renderTemplate`${renderComponent($$result2, "LeftSidebar", $$LeftSidebar, { "slot": "left-sidebar" })}`, "right-sidebar": async ($$result2) => renderTemplate`${renderComponent($$result2, "RightSidebar", $$RightSidebar, { "slot": "right-sidebar" })}` })}`;
}, "D:/zvenia/astro-frontend/src/pages/post/[slug].astro", void 0);

const $$file = "D:/zvenia/astro-frontend/src/pages/post/[slug].astro";
const $$url = "/post/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$slug,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

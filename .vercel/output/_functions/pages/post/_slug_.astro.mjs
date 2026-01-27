import { e as createComponent, f as createAstro, m as maybeRenderHead, h as addAttribute, r as renderTemplate, k as renderComponent } from '../../chunks/astro/server_0Ysjtq05.mjs';
import 'piccolore';
import { $ as $$SocialLayout, a as $$LeftSidebar } from '../../chunks/LeftSidebar_DwHsW1bP.mjs';
import 'clsx';
import { $ as $$PostCard } from '../../chunks/PostCard_B_2DrTdi.mjs';
import { s as supabase } from '../../chunks/supabase_DsxxBtwu.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro();
const $$PostAuthorSidebarCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$PostAuthorSidebarCard;
  const {
    authorName,
    authorAvatarUrl,
    profileUrl = "#"
  } = Astro2.props;
  const backgroundUrl = "https://res.cloudinary.com/dun3slcfg/images/v1691587336/cloud-files/Background-Default-/Background-Default-.jpg";
  return renderTemplate`${maybeRenderHead()}<div> <div class="bg-white border border-[var(--border-color)] overflow-hidden shadow-sm" style="border-radius: var(--radius-s);"> <div class="relative bg-cover"${addAttribute(`height: 80px; background-image: url('${backgroundUrl}'); background-position: right top; background-size: 200% auto; background-repeat: no-repeat;`, "style")}> <div class="absolute left-1/2 -bottom-6 -translate-x-1/2"> <div class="w-12 h-12 bg-white border border-[var(--border-color)] overflow-hidden shadow-sm" style="border-radius: 0.6666666667rem;"> ${authorAvatarUrl ? renderTemplate`<img${addAttribute(authorAvatarUrl, "src")}${addAttribute(authorName, "alt")} class="w-full h-full object-cover" loading="lazy">` : renderTemplate`<div class="w-full h-full flex items-center justify-center text-xs text-[#202124] font-medium"> ${authorName?.slice(0, 2)?.toUpperCase()} </div>`} </div> </div> </div> <div class="pt-10 pb-4 px-4 text-center"> <div class="text-[#202124]" style="font-size: 15px; font-weight: 700; line-height: 1.3em;"> ${authorName} </div> <a${addAttribute(profileUrl, "href")} class="mt-2 inline-block" style="font-size: 15px; font-weight: 400; color: #0a66c2;">
View Profile
</a> </div> </div> </div>`;
}, "D:/zveniaproject/src/components/social/PostAuthorSidebarCard.astro", void 0);

const $$AdsSidebar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="w-full" style="width: 200px;"> <img src="/ZVENIA-Logo-ADS.svg" alt="ZVENIA ADS" class="w-full h-auto" loading="lazy"> </div>`;
}, "D:/zveniaproject/src/components/social/AdsSidebar.astro", void 0);

const $$Astro = createAstro();
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  if (!slug) return Astro2.redirect("/404");
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    slug
  );
  const columnName = isUuid ? "id" : "slug";
  console.log(
    `[POST DEBUG] slug: "${slug}", isUuid: ${isUuid}, col: ${columnName}`
  );
  const { data: rawPost, error } = await supabase.from("posts").select(
    `
        *, 
        author:profiles(full_name, avatar_url, profession, company, profile_slug),
        topic:topics(name, slug)
    `
  ).eq(columnName, slug).single();
  if (error) {
    console.error(`[POST DEBUG] Error fetching post:`, error);
  }
  if (error || !rawPost) {
    console.error("Post not found:", error);
    return Astro2.redirect("/404");
  }
  const post = rawPost;
  const currentUser = Astro2.locals.user;
  return renderTemplate`${renderComponent($$result, "SocialLayout", $$SocialLayout, { "title": `${post.title} | Zvenia Social`, "hideRightSidebar": true }, { "default": async ($$result2) => renderTemplate`    ${maybeRenderHead()}<div class="w-full px-4 sm:px-6"> <div class="flex flex-col lg:flex-row gap-6 items-start lg:justify-between"> <!-- Column 1: Author Card (Left) - Shown first on mobile, left on desktop --> <aside class="shrink-0 w-full lg:w-auto order-1" style="flex-basis: 220px;"> ${renderComponent($$result2, "PostAuthorSidebarCard", $$PostAuthorSidebarCard, { "authorName": post.author?.full_name || "Unknown Author", "authorAvatarUrl": post.author?.avatar_url, "profileUrl": post.author?.profile_slug ? `/profile/${post.author.profile_slug}` : `/in/${post.author_id}` })} </aside> <!-- Column 2: Post Content (Center) - Second on mobile, center on desktop --> <main class="shrink-0 mx-auto lg:mx-0 order-2" style="width: 500px; max-width: 100%;"> ${renderComponent($$result2, "PostCard", $$PostCard, { "post": post, "currentUser": currentUser, "isDetail": true })} </main> <!-- Column 3: ADS (Right) - Hidden on mobile, shown on desktop --> <aside class="hidden lg:block shrink-0 order-3" style="flex-basis: 200px;"> ${renderComponent($$result2, "AdsSidebar", $$AdsSidebar, {})} </aside> </div> </div> `, "left-sidebar": async ($$result2) => renderTemplate`${renderComponent($$result2, "LeftSidebar", $$LeftSidebar, { "slot": "left-sidebar", "activeTopicSlug": post.topic?.slug })}` })}`;
}, "D:/zveniaproject/src/pages/post/[slug].astro", void 0);

const $$file = "D:/zveniaproject/src/pages/post/[slug].astro";
const $$url = "/post/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

import { e as createComponent, f as createAstro, h as addAttribute, l as renderHead, k as renderComponent, o as renderSlot, r as renderTemplate, m as maybeRenderHead } from './astro/server_0Ysjtq05.mjs';
import 'piccolore';
/* empty css                         */
import { $ as $$Header } from './Header_k3myN7Xc.mjs';
import { $ as $$Footer } from './Footer_DyX1phjR.mjs';
/* empty css                          */
import 'clsx';
import { s as supabase } from './supabase_DZBRYQhj.mjs';

const $$Astro$1 = createAstro();
const $$SocialLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$SocialLayout;
  const { title, description = "Zvenia - Community for Mining Professionals", hideRightSidebar = false } = Astro2.props;
  return renderTemplate`<html lang="en" data-astro-cid-dzqexri3> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/png" href="/favicon.png"><meta name="generator"${addAttribute(Astro2.generator, "content")}><meta name="description"${addAttribute(description, "content")}><title>${title}</title><!-- Fonts: Outfit --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"><!-- Material Icons --><link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">${renderHead()}</head> <body class="bg-[var(--bg-body)] min-h-screen font-sans selection:bg-primary-500 selection:text-white" data-astro-cid-dzqexri3> <!-- Fixed Header --> ${renderComponent($$result, "Header", $$Header, { "data-astro-cid-dzqexri3": true })} <!-- LEFT SIDEBAR (Fixed, starts below header/brand) --> <aside class="hidden lg:block fixed left-0 top-[70px] bottom-0 w-[270px] z-[998] bg-[var(--bg-surface)] overflow-y-auto no-scrollbar border-r border-[#e5e7eb]" data-astro-cid-dzqexri3> ${renderSlot($$result, $$slots["left-sidebar"])} </aside> <!-- RIGHT SIDEBAR (Fixed, starts below header) --> ${!hideRightSidebar && renderTemplate`<aside class="hidden lg:block fixed right-0 top-[70px] bottom-0 w-[300px] z-[998] bg-[var(--bg-surface)] overflow-y-auto no-scrollbar border-l border-[#e5e7eb] px-4 py-4" data-astro-cid-dzqexri3> ${renderSlot($$result, $$slots["right-sidebar"])} </aside>`} <!-- MAIN CONTENT (Fluid center, pushed by sidebars) --> <div${addAttribute(`w-full min-h-screen bg-[var(--bg-surface)] pt-[70px] lg:pl-[270px] ${hideRightSidebar ? "" : "lg:pr-[300px]"}`, "class")} data-astro-cid-dzqexri3> <!-- Inner Content Container --> <main class="w-full min-h-full border-x border-[var(--border-color)] py-6" style="background-color: #f3f3f3;" data-astro-cid-dzqexri3> <div class="w-full max-w-[98%] mx-auto" data-astro-cid-dzqexri3> ${renderSlot($$result, $$slots["default"])} </div> </main> <!-- Footer might need to be inside main or hidden if we want infinite scroll feel, putting it here for now --> ${renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-dzqexri3": true })} </div> </body></html>`;
}, "D:/zveniaproject/src/layouts/SocialLayout.astro", void 0);

const $$Astro = createAstro();
const $$LeftSidebar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$LeftSidebar;
  const { activeTopicSlug } = Astro2.props;
  const { data: topics, error } = await supabase.from("topics").select("*").order("name");
  if (error) {
    console.error("Error fetching topics:", error);
  }
  const currentUser = Astro2.locals.user;
  ({
    name: currentUser?.user_metadata?.full_name || currentUser?.email || "Guest User",
    // Placeholder for now
    avatar: currentUser?.user_metadata?.avatar_url || null,
    initial: (currentUser?.email?.[0] || "G").toUpperCase()
  });
  const { slug: currentSlug } = Astro2.params;
  const pathname = Astro2.url.pathname;
  return renderTemplate`${maybeRenderHead()}<div class="bg-[#dedede] min-h-full"> <ul class="flex flex-col text-[var(--neutral)] text-sm tracking-normal"> <!-- HOME LINK --> <li class="border-b border-[var(--neutral)]"> <a href="/"${addAttribute(`flex items-center gap-2 px-4 py-3 transition-colors whitespace-nowrap overflow-hidden text-ellipsis ${pathname === "/" ? "bg-[#00c44b] font-bold" : "hover:bg-[#9fdbb6]"}`, "class")}> <span class="material-icons" style="font-size: 16px; line-height: 1; width: 16px; height: 16px; display: inline-flex; align-items: center; justify-content: center;">home</span>
Home
</a> </li> <!-- MY ZVENIA LINK --> <li class="border-b border-[var(--neutral)]"> <a href="/my-zvenia"${addAttribute(`flex items-center gap-2 px-4 py-3 transition-colors whitespace-nowrap overflow-hidden text-ellipsis ${pathname === "/my-zvenia" ? "bg-[#00c44b] font-bold" : "hover:bg-[#9fdbb6]"}`, "class")}> <span class="material-icons" style="font-size: 16px; line-height: 1; width: 16px; height: 16px; display: inline-flex; align-items: center; justify-content: center;">layers</span>
MY ZVENIA
</a> </li> <!-- DYNAMIC TOPICS --> ${topics?.map((topic) => {
    const isActive = currentSlug === topic.slug || activeTopicSlug === topic.slug;
    return renderTemplate`<li class="border-b border-[var(--neutral)]"> <a${addAttribute(`/mining/${topic.slug}`, "href")}${addAttribute(`block px-4 py-3 transition-colors whitespace-nowrap overflow-hidden text-ellipsis ${isActive ? "bg-[#00c44b] font-medium" : "hover:bg-[#9fdbb6]"}`, "class")}> ${topic.name} </a> </li>`;
  })} </ul> </div>`;
}, "D:/zveniaproject/src/components/social/LeftSidebar.astro", void 0);

export { $$SocialLayout as $, $$LeftSidebar as a };

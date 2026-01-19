import { e as createComponent, f as createAstro, m as maybeRenderHead, h as addAttribute, r as renderTemplate } from './astro/server_DxclfMW8.mjs';
import 'piccolore';
import 'clsx';
import { s as supabase } from './supabase_HTSrsVit.mjs';

const $$Astro = createAstro();
const $$LeftSidebar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$LeftSidebar;
  const { data: topics, error } = await supabase.from("topics").select("*").order("name");
  if (error) {
    console.error("Error fetching topics:", error);
  }
  const currentUser = Astro2.locals.user;
  const user = {
    name: currentUser?.user_metadata?.full_name || currentUser?.email || "Guest User",
    headline: "Mining Professional",
    // Placeholder for now
    avatar: currentUser?.user_metadata?.avatar_url || null,
    initial: (currentUser?.email?.[0] || "G").toUpperCase()
  };
  const { slug: currentSlug } = Astro2.params;
  return renderTemplate`${maybeRenderHead()}<div class="space-y-4"> <!-- Profile Widget --> <div class="bg-[var(--bg-surface)] rounded-lg border border-[var(--border-color)] p-4 mb-4"> <div class="flex items-center gap-3 mb-3"> <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-green-600 flex items-center justify-center text-black font-bold text-lg"> ${user.avatar ? renderTemplate`<img${addAttribute(user.avatar, "src")} class="w-full h-full rounded-full object-cover">` : user.initial} </div> <div class="overflow-hidden"> <h3 class="text-sm font-bold text-[var(--text-main)] leading-tight truncate"${addAttribute(user.name, "title")}>${user.name}</h3> <p class="text-xs text-[var(--text-secondary)]">${user.headline}</p> </div> </div> <div class="flex justify-between items-center text-xs text-[var(--text-secondary)] border-t border-[var(--border-color)] pt-3"> <span class="hover:text-[var(--text-main)] cursor-pointer transition-colors">124 connections</span> <span class="hover:text-[var(--text-main)] cursor-pointer transition-colors">850 views</span> </div> </div> <!-- Topics List Widget --> <div class="bg-[var(--bg-surface)] rounded-lg border border-[var(--border-color)] p-4"> <h3 class="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Mining Topics</h3> <ul class="space-y-1"> <li> <a href="/mining/all"${addAttribute(`flex items-center gap-3 py-2 px-2 text-sm rounded-md transition-colors whitespace-nowrap overflow-hidden text-ellipsis ${currentSlug === "all" ? "text-primary-400 bg-primary-500/10 font-bold border-l-2 border-primary-500" : "text-[var(--text-secondary)] hover:text-primary-400 hover:bg-[var(--bg-surface-hover)] border-l-2 border-transparent"}`, "class")}> <span${addAttribute(currentSlug === "all" ? "opacity-100" : "opacity-50", "class")}>#</span> All Topics
</a> </li> ${topics?.map((topic) => {
    const isActive = currentSlug === topic.slug;
    const baseClass = "flex items-center gap-3 py-2 px-2 text-sm rounded-md transition-colors whitespace-nowrap overflow-hidden text-ellipsis";
    const activeMod = "text-primary-400 bg-primary-500/10 font-bold border-l-2 border-primary-500";
    const inactiveMod = "text-[var(--text-secondary)] hover:text-primary-400 hover:bg-[var(--bg-surface-hover)] border-l-2 border-transparent";
    const finalClass = `${baseClass} ${isActive ? activeMod : inactiveMod}`;
    return renderTemplate`<li> <a${addAttribute(`/mining/${topic.slug}`, "href")}${addAttribute(finalClass, "class")}> <span${addAttribute(isActive ? "opacity-100" : "opacity-50", "class")}>#</span> ${topic.name} </a> </li>`;
  })} </ul> <button class="w-full mt-4 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors flex items-center justify-center gap-1">
Show more <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg> </button> </div> </div>`;
}, "D:/zvenia/astro-frontend/src/components/social/LeftSidebar.astro", void 0);

const $$RightSidebar = createComponent(async ($$result, $$props, $$slots) => {
  const { data: ads } = await supabase.from("ads").select("*").limit(2);
  const { data: managers } = await supabase.from("country_managers").select("*").limit(3);
  return renderTemplate`${maybeRenderHead()}<div class="space-y-4"> <!-- Promoted / Ads Widget --> <div class="bg-[var(--bg-surface)] rounded-lg border border-[var(--border-color)] p-4"> <div class="flex justify-between items-center mb-3"> <h3 class="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Promoted</h3> <span class="text-[10px] text-gray-600">Ad</span> </div> <div class="space-y-4"> ${ads?.map((ad) => renderTemplate`<a${addAttribute(ad.link_url || "#", "href")} target="_blank" class="block group"> ${ad.image_url && renderTemplate`<div class="rounded-md overflow-hidden aspect-video mb-2"> <img${addAttribute(ad.image_url, "src")}${addAttribute(ad.title, "alt")} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"> </div>`} <h4 class="text-sm font-semibold text-[var(--text-secondary)] group-hover:text-primary-400 leading-tight mb-1">${ad.title}</h4> <p class="text-xs text-[var(--text-secondary)] line-clamp-2">${ad.content}</p> </a>`)} ${!ads?.length && renderTemplate`<p class="text-xs text-gray-600 italic">No active promotions</p>`} </div> </div> <!-- Who to Follow Widget --> <div class="bg-[var(--bg-surface)] rounded-lg border border-[var(--border-color)] p-4"> <h3 class="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Experts to Follow</h3> <ul class="space-y-4"> ${managers?.map((manager) => renderTemplate`<li class="flex items-start gap-3"> <div class="w-10 h-10 rounded-full bg-[var(--bg-surface-hover)] flex-shrink-0 overflow-hidden"> ${manager.image_url ? renderTemplate`<img${addAttribute(manager.image_url, "src")} class="w-full h-full object-cover">` : renderTemplate`<div class="w-full h-full flex items-center justify-center text-lg">👤</div>`} </div> <div> <h4 class="text-sm font-semibold text-[var(--text-main)] leading-none mb-1">${manager.title}</h4> <p class="text-xs text-[var(--text-secondary)] line-clamp-1">${manager.country || "Global"}</p> <button class="mt-2 text-xs font-bold text-primary-400 border border-primary-500/30 rounded-full px-3 py-1 hover:bg-primary-500/10 transition-colors">
+ Follow
</button> </div> </li>`)} </ul> <a href="/network" class="block mt-4 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors">
View all recommendations
</a> </div> <!-- Zvenia Footer Links --> <div class="text-center px-4"> <p class="text-[10px] text-gray-500">
About · Accessibility · Help Center · Privacy & Terms <br>
Ad Choices · Advertising · Business Services <br>
Get the Zvenia app
</p> <p class="text-[10px] text-gray-600 mt-2">
Zvenia Corporation © 2025
</p> </div> </div>`;
}, "D:/zvenia/astro-frontend/src/components/social/RightSidebar.astro", void 0);

export { $$RightSidebar as $, $$LeftSidebar as a };

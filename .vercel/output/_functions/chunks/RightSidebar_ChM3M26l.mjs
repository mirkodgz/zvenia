import { e as createComponent, f as createAstro, m as maybeRenderHead, h as addAttribute, r as renderTemplate, k as renderComponent } from './astro/server_0Ysjtq05.mjs';
import 'piccolore';
import { s as supabase } from './supabase_DZBRYQhj.mjs';
import 'clsx';

const $$Astro = createAstro();
const $$CountryManagersWidget = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CountryManagersWidget;
  const { country } = Astro2.locals;
  const detectedCountryCode = country || null;
  let countryManager = null;
  let countryName = "your country";
  if (detectedCountryCode) {
    const { data: countryDataVal } = await supabase.from("countries").select("id, display_name").eq("code", detectedCountryCode).single();
    const countryData = countryDataVal;
    if (countryData) {
      countryName = countryData.display_name;
      const { data: managerVal } = await supabase.from("profiles").select("*").eq("work_country", countryData.id).eq("role", "CountryManager").single();
      const manager = managerVal;
      if (manager) {
        countryManager = manager;
      }
    }
  }
  return renderTemplate`${maybeRenderHead()}<div class="bg-white border border-(--border-color) p-4 shadow-sm"> <h3 class="font-bold text-lg mb-4 text-(--text-main) flex items-center gap-2"> <span class="w-1 h-6 bg-primary-500"></span>
Country Manager
</h3> ${countryManager ? renderTemplate`<div class="flex flex-col gap-4"> <div class="flex items-start gap-3"> <a${addAttribute(`/profile/${countryManager.profile_slug}`, "href")} class="shrink-0 group"> ${countryManager.avatar_url ? renderTemplate`<img${addAttribute(countryManager.avatar_url, "src")}${addAttribute(countryManager.full_name, "alt")} class="w-12 h-12 rounded-full object-cover ring-2 ring-transparent group-hover:ring-accent-500 transition-all">` : renderTemplate`<div class="w-12 h-12 rounded-full bg-(--bg-surface-hover) flex items-center justify-center text-primary-500 font-bold text-lg ring-2 ring-transparent group-hover:ring-accent-500 transition-all"> ${countryManager.full_name?.[0] || "U"} </div>`} </a> <div class="flex-1 min-w-0"> <a${addAttribute(`/profile/${countryManager.profile_slug}`, "href")} class="block"> <h4 class="font-bold text-(--text-main) hover:text-accent-500 transition-colors leading-tight"> ${countryManager.full_name} </h4> </a> <p class="text-sm text-(--text-secondary) leading-tight mt-1"> ${countryName} </p> </div> </div> <a${addAttribute(`/profile/${countryManager.profile_slug}`, "href")} class="w-full py-2 px-4 bg-(--bg-surface-hover) hover:brightness-95 text-(--text-main) text-sm font-semibold transition-colors text-center border border-(--border-color)">
View Profile
</a> </div>` : renderTemplate`<div class="text-center py-6 space-y-4"> <div class="w-12 h-12 bg-(--bg-surface-hover) rounded-full flex items-center justify-center mx-auto text-primary-500"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <div> <p class="text-sm text-(--text-secondary)">
We don't have a manager in
<span class="font-bold text-(--text-main) block mt-1"> ${countryName} </span>
yet.
</p> </div> <a href="/join" class="block w-full py-2.5 px-4 bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold transition-colors shadow-sm">
Become a Country Manager
</a> </div>`} </div>`;
}, "D:/zveniaproject/src/components/social/CountryManagersWidget.astro", void 0);

const $$RightSidebar = createComponent(async ($$result, $$props, $$slots) => {
  const { data: adsVal } = await supabase.from("ads").select("*").order("created_at", { ascending: false }).limit(2);
  const ads = adsVal || [];
  return renderTemplate`${maybeRenderHead()}<aside class="hidden lg:block w-full shrink-0 space-y-6">  ${renderComponent($$result, "CountryManagersWidget", $$CountryManagersWidget, {})}  <div class="bg-white border border-(--border-color) p-4 shadow-sm"> <h3 class="font-bold text-lg mb-4 text-(--text-main) flex items-center gap-2"> <span class="w-1 h-6 bg-red-600"></span>
Promoted
</h3> <div class="space-y-4"> ${ads && ads.length > 0 ? ads.map((ad) => renderTemplate`<a${addAttribute(ad.link_url, "href")} target="_blank" rel="noopener noreferrer" class="block group"> <div class="aspect-video overflow-hidden bg-(--bg-surface-hover) mb-2 relative"> ${ad.image_url ? renderTemplate`<img${addAttribute(ad.image_url, "src")}${addAttribute(ad.title, "alt")} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">` : renderTemplate`<div class="w-full h-full flex items-center justify-center text-(--text-secondary)"> <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg> </div>`} <div class="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-0.5 text-[10px] text-white font-medium uppercase tracking-wider">
Ad
</div> </div> <h4 class="font-bold text-(--text-main) group-hover:text-accent-500 transition-colors leading-tight"> ${ad.title} </h4> <p class="text-xs text-(--text-secondary) mt-1 line-clamp-2"> ${ad.location && renderTemplate`<span class="mr-2">📍 ${ad.location}</span>`} </p> </a>`) : renderTemplate`<div class="p-4 text-center text-sm text-(--text-secondary) bg-(--bg-surface-hover) border border-dashed border-(--border-color)">
No active promotions
</div>`} </div> </div>  <div class="text-center px-4"> <p class="text-[10px] text-gray-500 dark:text-zinc-500">
About · Accessibility · Help Center · Privacy & Terms <br>
Ad Choices · Advertising · Business Services <br>
Get the Zvenia app
</p> <p class="text-[10px] text-gray-600 dark:text-zinc-600 mt-2">
Zvenia Corporation © 2025
</p> </div> </aside>`;
}, "D:/zveniaproject/src/components/social/RightSidebar.astro", void 0);

export { $$RightSidebar as $ };

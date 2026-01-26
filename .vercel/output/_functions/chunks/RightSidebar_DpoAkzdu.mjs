import { e as createComponent, m as maybeRenderHead, h as addAttribute, r as renderTemplate } from './astro/server_CNOy-_Bn.mjs';
import 'piccolore';
import 'clsx';
import { s as supabase } from './supabase_HTSrsVit.mjs';

const $$RightSidebar = createComponent(async ($$result, $$props, $$slots) => {
  const { data: ads } = await supabase.from("ads").select("*").limit(2);
  const { data: managers } = await supabase.from("country_managers").select("*").limit(3);
  return renderTemplate`${maybeRenderHead()}<div class="space-y-4"> <!-- Promoted / Ads Widget --> <div class="bg-[var(--bg-surface)] border border-[var(--border-color)] p-4"> <div class="flex justify-between items-center mb-3"> <h3 class="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Promoted</h3> <span class="text-[10px] text-gray-600">Ad</span> </div> <div class="space-y-4"> ${ads?.map((ad) => renderTemplate`<a${addAttribute(ad.link_url || "#", "href")} target="_blank" class="block group"> ${ad.image_url && renderTemplate`<div class="overflow-hidden aspect-video mb-2"> <img${addAttribute(ad.image_url, "src")}${addAttribute(ad.title, "alt")} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"> </div>`} <h4 class="text-sm font-semibold text-[var(--text-secondary)] group-hover:text-primary-400 leading-tight mb-1">${ad.title}</h4> <p class="text-xs text-[var(--text-secondary)] line-clamp-2">${ad.content}</p> </a>`)} ${!ads?.length && renderTemplate`<p class="text-xs text-gray-600 italic">No active promotions</p>`} </div> </div> <!-- Who to Follow Widget --> <div class="bg-[var(--bg-surface)] border border-[var(--border-color)] p-4"> <h3 class="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Experts to Follow</h3> <ul class="space-y-4"> ${managers?.map((manager) => renderTemplate`<li class="flex items-start gap-3"> <div class="w-10 h-10 bg-[var(--bg-surface-hover)] flex-shrink-0 overflow-hidden"> ${manager.image_url ? renderTemplate`<img${addAttribute(manager.image_url, "src")} class="w-full h-full object-cover">` : renderTemplate`<div class="w-full h-full flex items-center justify-center text-lg">👤</div>`} </div> <div> <h4 class="text-sm font-semibold text-[var(--text-main)] leading-none mb-1">${manager.title}</h4> <p class="text-xs text-[var(--text-secondary)] line-clamp-1">${manager.country || "Global"}</p> <button class="mt-2 text-xs font-bold text-primary-400 border border-primary-500/30 px-3 py-1 hover:bg-primary-500/10 transition-colors">
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
}, "D:/zveniaproject/src/components/social/RightSidebar.astro", void 0);

export { $$RightSidebar as $ };

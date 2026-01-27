import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_0Ysjtq05.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_9oJT8HrB.mjs';
import { $ as $$Header } from '../../chunks/Header_FOfAroyN.mjs';
import { s as supabase } from '../../chunks/supabase_DsxxBtwu.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_CxJDR4Zz.mjs';

const $$Astro = createAstro();
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  if (!slug) {
    return Astro2.redirect("/404");
  }
  const { data: podcast, error } = await supabase.from("podcasts").select(`
        *,
        author:profiles(*)
    `).eq("slug", slug).single();
  if (error || !podcast) {
    console.error("Podcast not found or error:", error);
    return Astro2.redirect("/404");
  }
  const coverImage = podcast.cover_image_url || podcast.featured_image_url || "/images/default-podcast-cover.jpg";
  const episodes = Array.isArray(podcast.episodes) ? podcast.episodes : [];
  const castEpisodes = episodes;
  castEpisodes.sort((a, b) => a.number - b.number);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${podcast.title} | Zvenia Podcasts` }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<main class="min-h-screen bg-[var(--bg-body)] text-[var(--text-main)] w-full overflow-x-hidden selection:bg-red-500 selection:text-white">  <div class="relative w-full h-[70vh] lg:h-[85vh] flex items-end pb-12 lg:pb-24 bg-black">  <div class="absolute inset-0 z-0"> <img${addAttribute(coverImage, "src")}${addAttribute(podcast.title, "alt")} class="w-full h-full object-cover opacity-80">   <div class="absolute inset-0 bg-black/20 z-10"></div>  <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent z-10 h-40"></div>  <div class="absolute inset-0 bg-gradient-to-t from-[#000000] via-black/60 to-transparent z-10 bottom-0"></div>  <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 w-full lg:w-3/4"></div> </div>  <div class="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="max-w-3xl">  <div class="flex items-center gap-2 mb-4"> <span class="text-xs font-bold tracking-widest uppercase text-white bg-red-600 px-2 py-1 rounded shadow-lg">
MINING SERIES
</span> ${podcast.host && renderTemplate`<span class="text-sm font-medium text-gray-300 tracking-wide">
WITH ${podcast.host.toUpperCase()} </span>`} </div>  <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none mb-6 text-white drop-shadow-2xl"> ${podcast.title} </h1>  <div class="flex items-center gap-4 text-sm sm:text-base font-bold text-gray-300 mb-6"> <span class="text-green-400">Expert Verified</span> <span>${new Date(podcast.created_at).getFullYear()}</span> <span class="border border-gray-400/50 px-1 rounded text-xs py-0.5">Technical</span> <span>${castEpisodes.length} Episodes</span> </div>  <p class="text-lg sm:text-xl text-gray-200 line-clamp-3 mb-8 drop-shadow-md max-w-2xl leading-relaxed"> ${podcast.description || podcast.excerpt || "Join us for an in-depth conversation on the future of mining and geotechnics."} </p>  <div class="flex flex-wrap items-center gap-4"> <a${addAttribute(castEpisodes[0]?.video_url || "#", "href")} target="_blank" class="bg-white text-black px-8 py-3 rounded font-bold text-lg flex items-center gap-2 hover:bg-gray-200 transition transform hover:scale-105 shadow-xl"> <svg class="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
Play
</a> <button class="bg-gray-500/30 backdrop-blur-md text-white px-8 py-3 rounded font-bold text-lg flex items-center gap-2 hover:bg-gray-500/50 transition border border-gray-400/30"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
More Info
</button> </div> </div> </div> </div>  <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-12"> <div class="flex items-center justify-between mb-6"> <h2 class="text-2xl font-bold text-[var(--text-main)]">Episodes</h2> <div class="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">
Season 1
</div> </div> <div class="flex flex-col gap-0 border-t border-[var(--border-color)]"> ${castEpisodes.length === 0 ? renderTemplate`<div class="py-12 text-center text-[var(--text-secondary)]">
No episodes available yet.
</div>` : castEpisodes.map((ep) => renderTemplate`<div class="group relative flex items-center gap-4 sm:gap-6 p-4 sm:p-8 border-b border-[var(--border-color)] hover:bg-[var(--bg-surface-hover)] transition-colors cursor-pointer rounded-lg overflow-hidden">  <div class="text-3xl font-bold text-[var(--text-secondary)] w-8 text-center group-hover:text-[var(--text-main)] transition-colors"> ${ep.number} </div>  <div class="relative shrink-0 w-32 h-20 sm:w-40 sm:h-24 bg-gray-800 rounded-md overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300"> <img${addAttribute(coverImage, "src")}${addAttribute(ep.title, "alt")} class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity">  <div class="absolute inset-0 flex items-center justify-center"> <div class="bg-white/20 rounded-full p-2 backdrop-blur-sm group-hover:bg-white transition-colors"> <svg class="w-6 h-6 fill-white group-hover:fill-black" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg> </div> </div> </div>  <div class="flex-1 min-w-0"> <div class="flex items-center justify-between mb-2"> <h3 class="text-lg font-bold text-[var(--text-main)] truncate pr-4"> ${ep.title} </h3> ${ep.duration && renderTemplate`<span class="text-sm text-[var(--text-secondary)] font-medium"> ${ep.duration} </span>`} </div> <p class="text-sm text-[var(--text-secondary)] line-clamp-2"> ${podcast.description?.substring(0, 100)}...
</p> </div>  <a${addAttribute(ep.video_url, "href")} target="_blank" class="absolute inset-0 z-10"${addAttribute(`Play ${ep.title}`, "aria-label")}></a> </div>`)} </div> </div> </main> `, "header": async ($$result2) => renderTemplate`${renderComponent($$result2, "Header", $$Header, { "slot": "header" })}` })}`;
}, "D:/zveniaproject/src/pages/podcast/[slug].astro", void 0);

const $$file = "D:/zveniaproject/src/pages/podcast/[slug].astro";
const $$url = "/podcast/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$slug,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

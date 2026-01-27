import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML, h as addAttribute } from '../../chunks/astro/server_0Ysjtq05.mjs';
import 'piccolore';
import { $ as $$SocialLayout, a as $$LeftSidebar } from '../../chunks/LeftSidebar_DwHsW1bP.mjs';
import { $ as $$RightSidebar } from '../../chunks/RightSidebar_BK4xkNnG.mjs';
import { c as createSupabaseServerClient } from '../../chunks/supabase_DsxxBtwu.mjs';
import { ArrowLeft, Play, Calendar, Briefcase } from 'lucide-react';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  if (!slug) return Astro2.redirect("/404");
  const supabase = createSupabaseServerClient({
    req: Astro2.request,
    cookies: Astro2.cookies
  });
  const { data: talk, error } = await supabase.from("talks").select("*").eq("slug", slug).single();
  if (error || !talk) {
    console.error("Talk not found:", error);
    return Astro2.redirect("/404");
  }
  const metadata = talk.metadata || {};
  const guestName = metadata["guest-z-talk"] || "Invitado Especial";
  const company = metadata["guest-company"] || "Zvenia Mining";
  let imageUrl = talk.featured_image_url;
  if (imageUrl && imageUrl.includes(".mp4")) {
    imageUrl = imageUrl.replace(".mp4", ".jpg");
  }
  const publishDate = talk.published_at ? new Date(talk.published_at).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }) : "";
  return renderTemplate`${renderComponent($$result, "SocialLayout", $$SocialLayout, { "title": `${talk.title} | Z-TALKS`, "hideRightSidebar": false }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="max-w-4xl mx-auto px-4 py-6">  <a href="/z-talks" class="inline-flex items-center text-(--text-secondary) hover:text-(--text-main) mb-6 transition-colors"> ${renderComponent($$result2, "ArrowLeft", ArrowLeft, { "className": "w-4 h-4 mr-2" })}
Volver a Z-Talks
</a>  ${/* Video Player or Hero Image */
  talk.video_url ? renderTemplate`<div class="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl mb-8 group ring-1 ring-white/10"> <video controls class="w-full h-full"${addAttribute(imageUrl, "poster")}> <source${addAttribute(talk.video_url, "src")} type="video/mp4">
Tu navegador no soporta la etiqueta de video.
</video> </div>` : (
    /* Fallback to Image Placeholder logic */
    renderTemplate`<div class="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl mb-8 group ring-1 ring-white/10"> ${imageUrl ? renderTemplate`<img${addAttribute(imageUrl, "src")}${addAttribute(talk.title, "alt")} class="absolute inset-0 w-full h-full object-cover opacity-80">` : renderTemplate`<div class="absolute inset-0 bg-linear-to-br from-gray-800 to-gray-900"></div>`}  <div class="absolute inset-0 flex items-center justify-center"> <div class="bg-white/10 backdrop-blur-md rounded-full p-6 border border-white/20 transition-transform duration-300 cursor-not-allowed opacity-50"> ${renderComponent($$result2, "Play", Play, { "className": "w-12 h-12 text-white fill-current ml-1" })} </div> </div> <div class="absolute bottom-0 inset-x-0 h-32 bg-linear-to-t from-black via-black/60 to-transparent"></div> </div>`
  )}  <div class="space-y-6"> <div> <h1 class="text-3xl sm:text-4xl font-extrabold text-(--text-main) mb-3 tracking-tight font-font-primary"> ${talk.title} </h1> <div class="flex flex-wrap items-center gap-4 text-sm text-(--text-secondary) font-medium"> <span class="inline-flex items-center gap-1.5"> ${renderComponent($$result2, "Calendar", Calendar, { "className": "w-4 h-4" })} ${publishDate} </span> <span class="w-1 h-1 bg-(--text-secondary) rounded-full opacity-50"></span> <span class="bg-(--primary-color)/10 text-(--primary-color) px-2.5 py-0.5 rounded-full text-xs border border-(--primary-color)/20">
Z-TALK
</span> </div> </div>  <div class="bg-(--bg-card) border border-(--border-color) rounded-xl p-6"> <h2 class="text-xs font-bold text-(--text-secondary) uppercase tracking-wider mb-4">
Invitado
</h2> <div class="flex items-start gap-4"> <div class="w-12 h-12 rounded-full bg-linear-to-br from-(--primary-color) to-purple-600 flex items-center justify-center shrink-0"> <span class="text-white font-bold text-lg"> ${guestName.charAt(0)} </span> </div> <div> <div class="flex items-center gap-2 mb-1"> <h3 class="text-lg font-bold text-(--text-main)"> ${guestName} </h3> </div> <div class="flex items-center gap-2 text-(--text-secondary) text-sm"> ${renderComponent($$result2, "Briefcase", Briefcase, { "className": "w-4 h-4" })} <span>${company}</span> </div> </div> </div> </div>  <div class="prose prose-invert max-w-none text-(--text-secondary) leading-relaxed text-base sm:text-lg space-y-4">${unescapeHTML(talk.description || "No hay descripci\xF3n disponible para esta charla.")}</div> </div> </div>  `, "left-sidebar": async ($$result2) => renderTemplate`${renderComponent($$result2, "LeftSidebar", $$LeftSidebar, { "slot": "left-sidebar" })}`, "right-sidebar": async ($$result2) => renderTemplate`${renderComponent($$result2, "RightSidebar", $$RightSidebar, { "slot": "right-sidebar" })}` })}`;
}, "D:/zveniaproject/src/pages/z-talks/[slug].astro", void 0);

const $$file = "D:/zveniaproject/src/pages/z-talks/[slug].astro";
const $$url = "/z-talks/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$slug,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

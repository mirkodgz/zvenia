import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, h as addAttribute, p as Fragment, m as maybeRenderHead } from '../../chunks/astro/server_0Ysjtq05.mjs';
import 'piccolore';
import { $ as $$SocialLayout, a as $$LeftSidebar } from '../../chunks/LeftSidebar_PEEkwiet.mjs';
import { c as createSupabaseServerClient } from '../../chunks/supabase_DsxxBtwu.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_CxJDR4Zz.mjs';

const $$Astro = createAstro();
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const supabase = createSupabaseServerClient({
    req: Astro2.request,
    cookies: Astro2.cookies
  });
  const { data: event, error } = await supabase.from("events").select(
    `
        *,
        type:event_types(name, slug),
        language:event_languages(name, code),
        format:event_formats(name, slug),
        price:event_prices(name, slug)
    `
  ).eq("slug", slug).single();
  if (error || !event) {
    return Astro2.redirect("/404");
  }
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  const eventData = event;
  return renderTemplate`${renderComponent($$result, "SocialLayout", $$SocialLayout, { "title": eventData.title }, { "default": async ($$result2) => renderTemplate`    ${maybeRenderHead()}<div class="max-w-[600px] mx-auto pb-20">  <div class="mb-4"> <a href="/" class="text-sm font-medium text-gray-500 hover:text-primary-600 flex items-center gap-1 transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path> </svg>
Back to Feed
</a> </div>  <div class="relative w-full h-[300px] bg-gray-100 rounded-xl overflow-hidden mb-6 border border-gray-200"> ${eventData.cover_photo_url ? renderTemplate`<img${addAttribute(eventData.cover_photo_url, "src")}${addAttribute(eventData.title, "alt")} class="w-full h-full object-cover">` : renderTemplate`<div class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400"> <svg xmlns="http://www.w3.org/2000/svg" class="w-20 h-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"> ${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect> <line x1="16" y1="2" x2="16" y2="6"></line> <line x1="8" y1="2" x2="8" y2="6"></line> <line x1="3" y1="10" x2="21" y2="10"></line> ` })} </svg> </div>`} </div>  <h1 class="text-3xl font-bold text-gray-900 leading-tight mb-4"> ${eventData.title} </h1>  <div class="flex flex-wrap gap-2 mb-6"> ${eventData.type && renderTemplate`<span class="bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"> <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> ${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path> <line x1="7" y1="7" x2="7.01" y2="7"></line> ` })} </svg> ${eventData.type.name} </span>`} ${eventData.language && renderTemplate`<span class="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"> <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> ${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <circle cx="12" cy="12" r="10"></circle> <line x1="2" y1="12" x2="22" y2="12"></line> <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path> ` })} </svg> ${eventData.language.name} </span>`} ${eventData.format && renderTemplate`<span class="bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"> <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> ${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path> <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path> <line x1="12" y1="19" x2="12" y2="23"></line> <line x1="8" y1="23" x2="16" y2="23"></line> ` })} </svg> ${eventData.format.name} </span>`} ${eventData.price && renderTemplate`<span class="bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"> <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> ${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <line x1="12" y1="1" x2="12" y2="23"></line> <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path> ` })} </svg> ${eventData.price.name} </span>`} </div>  <div class="prose prose-gray max-w-none text-gray-600 leading-relaxed whitespace-pre-line"> ${eventData.description} </div> </div>   `, "left-sidebar": async ($$result2) => renderTemplate`${renderComponent($$result2, "LeftSidebar", $$LeftSidebar, { "slot": "left-sidebar" })}`, "right-sidebar": async ($$result2) => renderTemplate`<div class="space-y-6">  <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"> <div class="border-b border-gray-100 pb-3 mb-3"> <h3 class="text-gray-900 font-bold text-base flex items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"></path><path d="M5 21V7l8-4 8 4v14"></path><path d="M8 21v-4h8v4"></path></svg>
Organizer
</h3> </div> <div class="space-y-3"> ${eventData.organizer && renderTemplate`<p class="text-gray-700 font-medium text-sm"> ${eventData.organizer} </p>`} ${eventData.organizer_email && renderTemplate`<a${addAttribute(`mailto:${eventData.organizer_email}`, "href")} class="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> ${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path> <polyline points="22,6 12,13 2,6"></polyline> ` })} </svg> ${eventData.organizer_email} </a>`} ${eventData.organizer_phone && renderTemplate`<p class="flex items-center gap-2 text-sm text-gray-500"> <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path> </svg> ${eventData.organizer_phone} </p>`} </div> </div>  <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">  ${eventData.external_link && renderTemplate`<div> <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
Official Link
</h4> <a${addAttribute(eventData.external_link, "href")} target="_blank" rel="noopener" class="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-center text-sm font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> ${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <circle cx="12" cy="12" r="10"></circle> <line x1="2" y1="12" x2="22" y2="12"></line> <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path> ` })} </svg>
Visit Official Website
</a> </div>`}  ${eventData.schedule_pdf_url && renderTemplate`<div> <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
Resources
</h4> <a${addAttribute(eventData.schedule_pdf_url, "href")} target="_blank" class="w-full py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-center text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 group"> <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-gray-400 group-hover:text-red-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> ${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path> <polyline points="14 2 14 8 20 8"></polyline> <line x1="16" y1="13" x2="8" y2="13"></line> <line x1="16" y1="17" x2="8" y2="17"></line> <line x1="10" y1="9" x2="8" y2="9"></line> ` })} </svg>
Download Program (PDF)
</a> </div>`} <div class="border-t border-gray-100 my-2"></div>  <div class="space-y-3"> <div> <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
Location
</h4> <p class="text-gray-900 font-medium text-sm flex items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> ${eventData.location || "Online"} </p> </div> <div> <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
Start Date
</h4> <p class="text-gray-900 font-medium text-sm flex items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> ${formatDate(eventData.start_date)} </p> </div> ${eventData.start_time && renderTemplate`<div> <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
Start Time
</h4> <p class="text-gray-900 font-medium text-sm flex items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> ${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <circle cx="12" cy="12" r="10"></circle> <polyline points="12 6 12 12 16 14"></polyline> ` })} </svg> ${eventData.start_time} </p> </div>`} </div> </div> </div>` })}`;
}, "D:/zveniaproject/src/pages/event/[slug].astro", void 0);

const $$file = "D:/zveniaproject/src/pages/event/[slug].astro";
const $$url = "/event/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$slug,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

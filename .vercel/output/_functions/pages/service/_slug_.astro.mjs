import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_0Ysjtq05.mjs';
import 'piccolore';
import { $ as $$SocialLayout, a as $$LeftSidebar } from '../../chunks/LeftSidebar_DEdUkq9E.mjs';
import { $ as $$RightSidebar } from '../../chunks/RightSidebar_DDFO6qYz.mjs';
import { S as ServiceOptions } from '../../chunks/ServiceOptions_Dmgq1fL7.mjs';
import { s as supabase } from '../../chunks/supabase_DZBRYQhj.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  if (!slug) {
    return Astro2.redirect("/404");
  }
  let query = supabase.from("services").select(`
    *,
    topic:topics(*)
  `);
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
  console.log(`[SERVICE DEBUG] slug param: "${slug}", isUuid: ${isUuid}`);
  if (isUuid) {
    query = query.eq("id", slug);
  } else {
    query = query.eq("slug", slug);
  }
  const { data: serviceData, error } = await query.single();
  if (error) {
    console.error("[SERVICE DEBUG] Supabase Error:", error);
  }
  if (error || !serviceData) {
    console.error("Service not found or error:", error);
    return Astro2.redirect("/404");
  }
  if (serviceData.author_id) {
    const { data: author } = await supabase.from("profiles").select("*").eq("id", serviceData.author_id).single();
    if (author) {
      serviceData.author = author;
    }
  }
  const service = {
    ...serviceData,
    description: serviceData.description || serviceData.content
  };
  const coverImage = service.featured_image_url || service.quick_view_image_url || "/images/default-service.jpg";
  return renderTemplate`${renderComponent($$result, "SocialLayout", $$SocialLayout, { "title": `${service.title} | Zvenia Services` }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="space-y-6 pb-20">  <a href="/" onClick="history.back(); return false;" class="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-2"> <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
Back
</a>  <article class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] overflow-hidden relative">  <div class="absolute top-4 right-4 z-30"> ${renderComponent($$result2, "ServiceOptions", ServiceOptions, { "client:load": true, "serviceId": service.id, "authorId": service.author_id, "currentUserId": Astro2.locals.user?.id, "slug": service.slug, "client:component-hydration": "load", "client:component-path": "D:/zveniaproject/src/components/social/ServiceOptions", "client:component-export": "default" })} </div>  <div class="relative h-64 sm:h-80 w-full bg-[var(--bg-surface)]"> <img${addAttribute(coverImage, "src")}${addAttribute(service.title, "alt")} class="w-full h-full object-cover"> <div class="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] to-transparent opacity-90"></div> </div>  <div class="p-6 sm:p-8 -mt-20 relative z-10">  <div class="flex flex-wrap gap-2 mb-4"> ${service.topic && renderTemplate`<a${addAttribute(`/mining/${service.topic.slug}`, "href")} class="text-xs font-bold text-primary-400 bg-primary-500/10 px-2 py-1 rounded uppercase tracking-wider hover:bg-primary-500/20 transition-colors"> ${service.topic.name} </a>`} ${service.type_of_ads && renderTemplate`<span class="text-xs font-bold text-[var(--text-secondary)] bg-[var(--bg-surface-hover)] border border-[var(--border-color)] px-2 py-1 rounded uppercase tracking-wider"> ${service.type_of_ads} </span>`} </div>  <h1 class="text-3xl sm:text-4xl font-bold text-[var(--text-main)] mb-2 leading-tight"> ${service.title} </h1> ${service.organizer_company && renderTemplate`<div class="flex items-center gap-2 mb-6"> <span class="text-sm font-medium text-[var(--text-secondary)]">Organized by</span> <span class="text-sm font-bold text-[var(--text-main)]">${service.organizer_company}</span> </div>`}  <div class="prose prose-invert max-w-none text-[var(--text-secondary)] mb-8 leading-relaxed whitespace-pre-wrap"> ${service.description} </div>  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 p-4 bg-[var(--bg-surface)] rounded-lg border border-[var(--border-color)]"> ${service.target_country && renderTemplate`<div> <span class="block text-xs text-gray-500 uppercase font-bold mb-1">Target Country</span> <span class="text-sm text-[var(--text-main)]">${service.target_country}</span> </div>`} ${service.created_at && renderTemplate`<div> <span class="block text-xs text-gray-500 uppercase font-bold mb-1">Posted On</span> <span class="text-sm text-[var(--text-main)]">${new Date(service.created_at).toLocaleDateString()}</span> </div>`}  </div>  <div class="flex flex-wrap gap-4"> ${service.company_link && renderTemplate`<a${addAttribute(service.company_link, "href")} target="_blank" rel="noopener noreferrer" class="flex-1 sm:flex-none bg-white text-black px-6 py-3 rounded-lg font-bold text-center hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
Visit Website
<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg> </a>`} <button class="flex-1 sm:flex-none px-6 py-3 rounded-lg font-bold text-[var(--text-main)] border border-[var(--border-color)] hover:bg-[var(--bg-surface-hover)] transition-colors">
Contact Organizer
</button> </div> </div> </article> </div>  `, "left-sidebar": async ($$result2) => renderTemplate`${renderComponent($$result2, "LeftSidebar", $$LeftSidebar, { "slot": "left-sidebar" })}`, "right-sidebar": async ($$result2) => renderTemplate`${renderComponent($$result2, "RightSidebar", $$RightSidebar, { "slot": "right-sidebar" })}` })}`;
}, "D:/zveniaproject/src/pages/service/[slug].astro", void 0);

const $$file = "D:/zveniaproject/src/pages/service/[slug].astro";
const $$url = "/service/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

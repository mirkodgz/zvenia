import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_0Ysjtq05.mjs';
import 'piccolore';
import { $ as $$SocialLayout, a as $$LeftSidebar } from '../chunks/LeftSidebar_DwHsW1bP.mjs';
import { $ as $$RightSidebar } from '../chunks/RightSidebar_BK4xkNnG.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import 'react';
import { ExternalLink } from 'lucide-react';
import { c as createSupabaseServerClient } from '../chunks/supabase_DsxxBtwu.mjs';
export { renderers } from '../renderers.mjs';

const TalkCard = ({ talk }) => {
  const metadata = talk.metadata;
  const guestName = metadata?.["guest-z-talk"] || "Invitado Especial";
  let imageUrl = talk.featured_image_url;
  if (imageUrl && imageUrl.includes(".mp4")) {
    imageUrl = imageUrl.replace(".mp4", ".jpg");
  }
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href: `/z-talks/${talk.slug}`,
      className: "group block w-full bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden",
      children: [
        /* @__PURE__ */ jsx("div", { className: "relative aspect-video w-full bg-gray-900 overflow-hidden", children: imageUrl ? /* @__PURE__ */ jsx(
          "img",
          {
            src: imageUrl,
            alt: talk.title,
            className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          }
        ) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-linear-to-br from-gray-800 to-gray-900" }) }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 bg-white flex justify-between items-start gap-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900 leading-tight font-font-primary group-hover:text-(--primary-color) transition-colors line-clamp-2", children: guestName }),
          /* @__PURE__ */ jsx(ExternalLink, { className: "w-5 h-5 text-gray-400 group-hover:text-(--primary-color) transition-colors shrink-0" })
        ] })
      ]
    }
  );
};

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const supabase = createSupabaseServerClient({
    req: Astro2.request,
    cookies: Astro2.cookies
  });
  const { data: talks, error } = await supabase.from("talks").select("*").order("published_at", { ascending: false }).returns();
  return renderTemplate`${renderComponent($$result, "SocialLayout", $$SocialLayout, { "title": "Z-TALKS | Zvenia Mining" }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="max-w-7xl mx-auto p-4 sm:p-6">  <div class="mb-8"> <h1 class="text-3xl sm:text-4xl font-extrabold text-(--text-main) mb-3 tracking-tight font-font-primary">
Z-TALKS
</h1> <p class="text-lg text-(--text-secondary) max-w-2xl font-font-secondary">
Conversaciones exclusivas con líderes, innovadores y expertos
                que están transformando la industria.
</p> </div>  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> ${error ? renderTemplate`<div class="col-span-full p-6 border border-red-500/20 bg-red-500/10 rounded-lg text-red-400"> <p class="font-bold">Error loading talks</p> <p class="text-sm">${error.message}</p> </div>` : talks && talks.length > 0 ? talks.map((talk) => renderTemplate`${renderComponent($$result2, "TalkCard", TalkCard, { "talk": { ...talk, metadata: talk.metadata } })}`) : renderTemplate`<div class="col-span-full py-12 text-center text-(--text-secondary) bg-(--bg-card) rounded-xl border border-(--border-color)"> <p>
No hay conversaciones disponibles en este momento.
</p> </div>`} </div> </div>  `, "left-sidebar": async ($$result2) => renderTemplate`${renderComponent($$result2, "LeftSidebar", $$LeftSidebar, { "slot": "left-sidebar" })}`, "right-sidebar": async ($$result2) => renderTemplate`${renderComponent($$result2, "RightSidebar", $$RightSidebar, { "slot": "right-sidebar" })}` })}`;
}, "D:/zveniaproject/src/pages/z-talks/index.astro", void 0);

const $$file = "D:/zveniaproject/src/pages/z-talks/index.astro";
const $$url = "/z-talks";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

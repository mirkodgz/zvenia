import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DxclfMW8.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_7SPMbouh.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { P as PostForm } from '../../chunks/PostForm_gWR0LH7O.mjs';
import { E as EventForm } from '../../chunks/EventForm_B0_D9QHP.mjs';
import { P as PodcastForm } from '../../chunks/PodcastForm_W7_T3Sme.mjs';
import { S as ServiceForm } from '../../chunks/ServiceForm_aC2BHNIm.mjs';
export { renderers } from '../../renderers.mjs';

function CreateContent({ currentUser }) {
  const [activeTab, setActiveTab] = useState("post");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab && ["post", "event", "podcast", "service"].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);
  const tabs = [
    { id: "post", label: "Posts", icon: "📝" },
    { id: "event", label: "Events", icon: "📅" },
    { id: "podcast", label: "Podcasts", icon: "🎙️" },
    { id: "service", label: "Services", icon: "💼" }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsx("div", { className: "border-b border-white/10 bg-black/20", children: /* @__PURE__ */ jsx("nav", { className: "flex -mb-px", "aria-label": "Tabs", children: tabs.map((tab) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setActiveTab(tab.id),
        className: `
                w-1/4 py-4 px-1 text-center border-b-2 text-sm font-medium transition-colors duration-200
                ${activeTab === tab.id ? "border-primary-500 text-primary-400" : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700"}
              `,
        children: [
          /* @__PURE__ */ jsx("span", { className: "mr-2", children: tab.icon }),
          tab.label
        ]
      },
      tab.id
    )) }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 bg-neutral-900/50 min-h-[500px]", children: [
      activeTab === "post" && /* @__PURE__ */ jsx(PostForm, { currentUser }),
      activeTab === "event" && /* @__PURE__ */ jsx(EventForm, { currentUser }),
      activeTab === "podcast" && /* @__PURE__ */ jsx(PodcastForm, { currentUser }),
      activeTab === "service" && /* @__PURE__ */ jsx(ServiceForm, { currentUser })
    ] })
  ] });
}

const $$Astro = createAstro();
const $$Create = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Create;
  const { user } = Astro2.locals;
  if (!user) {
    return Astro2.redirect("/login");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Creator Studio | Zvenia" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-black pt-24 pb-12"> <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"> <!-- Header --> <div class="mb-8"> <h1 class="text-3xl font-bold text-white tracking-tight">Creator Studio</h1> <p class="mt-2 text-gray-400">Share your knowledge with the professional mining community.</p> </div> <!-- Main Content app --> <div class="bg-neutral-900/50 border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm"> ${renderComponent($$result2, "CreateContent", CreateContent, { "client:load": true, "currentUser": user, "client:component-hydration": "load", "client:component-path": "D:/zvenia/astro-frontend/src/components/dashboard/forms/CreateContent", "client:component-export": "default" })} </div> </div> </div> ` })}`;
}, "D:/zvenia/astro-frontend/src/pages/dashboard/create.astro", void 0);

const $$file = "D:/zvenia/astro-frontend/src/pages/dashboard/create.astro";
const $$url = "/dashboard/create";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Create,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

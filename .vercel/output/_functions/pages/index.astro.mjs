import { e as createComponent, f as createAstro, m as maybeRenderHead, h as addAttribute, k as renderComponent, r as renderTemplate, o as Fragment$1 } from '../chunks/astro/server_CNOy-_Bn.mjs';
import 'piccolore';
import { $ as $$SocialLayout, a as $$LeftSidebar } from '../chunks/LeftSidebar_DHrYbctm.mjs';
import { $ as $$RightSidebar } from '../chunks/RightSidebar_DpoAkzdu.mjs';
import { s as supabase } from '../chunks/supabase_HTSrsVit.mjs';
import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { P as PostForm } from '../chunks/PostForm_D8fHGLYy.mjs';
import { E as EventForm } from '../chunks/EventForm_B0_D9QHP.mjs';
import { P as PodcastForm } from '../chunks/PodcastForm_W7_T3Sme.mjs';
import { S as ServiceForm } from '../chunks/ServiceForm_aC2BHNIm.mjs';
import { $ as $$PostCard } from '../chunks/PostCard_1jfQ50xD.mjs';
import { P as PodcastRow } from '../chunks/PodcastRow_BuOEXnVg.mjs';
import { E as EventCard, S as ServiceCard } from '../chunks/ServiceCard_wi3Dro0O.mjs';
export { renderers } from '../renderers.mjs';

function CreateContentModal({ currentUser, userInitials, activeFeed = "post" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("post");
  const [editId, setEditId] = useState(null);
  const modalRef = useRef(null);
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);
  useEffect(() => {
    const handleEdit = (event) => {
      const { type, id } = event.detail;
      setEditId(id);
      setActiveTab(type);
      setIsOpen(true);
    };
    window.addEventListener("open-edit-modal", handleEdit);
    return () => window.removeEventListener("open-edit-modal", handleEdit);
  }, []);
  useEffect(() => {
    if (!isOpen) setEditId(null);
  }, [isOpen]);
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };
  const openModal = (tab = "post") => {
    setEditId(null);
    setActiveTab(tab);
    setIsOpen(true);
  };
  const navigateToFeed = (feedType) => {
    window.location.href = `/?feed=${feedType}`;
  };
  const role = currentUser?.role || "Basic";
  const ALL_TABS = [
    {
      id: "post",
      label: "Posts",
      icon: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ jsx("path", { d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" }),
        /* @__PURE__ */ jsx("polyline", { points: "14 2 14 8 20 8" }),
        /* @__PURE__ */ jsx("line", { x1: "16", y1: "13", x2: "8", y2: "13" }),
        /* @__PURE__ */ jsx("line", { x1: "16", y1: "17", x2: "8", y2: "17" }),
        /* @__PURE__ */ jsx("line", { x1: "10", y1: "9", x2: "8", y2: "9" })
      ] })
    },
    {
      id: "event",
      label: "Events",
      icon: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ jsx("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }),
        /* @__PURE__ */ jsx("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
        /* @__PURE__ */ jsx("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
        /* @__PURE__ */ jsx("line", { x1: "3", y1: "10", x2: "21", y2: "10" })
      ] })
    },
    {
      id: "podcast",
      label: "Podcasts",
      icon: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ jsx("path", { d: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" }),
        /* @__PURE__ */ jsx("path", { d: "M19 10v2a7 7 0 0 1-14 0v-2" }),
        /* @__PURE__ */ jsx("line", { x1: "12", y1: "19", x2: "12", y2: "23" }),
        /* @__PURE__ */ jsx("line", { x1: "8", y1: "23", x2: "16", y2: "23" })
      ] })
    },
    {
      id: "service",
      label: "Services",
      icon: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ jsx("rect", { x: "2", y: "7", width: "20", height: "14", rx: "2", ry: "2" }),
        /* @__PURE__ */ jsx("path", { d: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" })
      ] })
    }
  ];
  const getAllowedTabs = () => {
    if (role === "Administrator" || role === "CountryManager") return ALL_TABS;
    const allowedIds = ["post"];
    if (role === "Events") allowedIds.push("event");
    if (role === "Expert") allowedIds.push("podcast");
    if (role === "Ads") allowedIds.push("service");
    return ALL_TABS.filter((t) => allowedIds.includes(t.id));
  };
  const tabs = getAllowedTabs();
  const getButtonClass = (feedType) => {
    const isActive = activeFeed === feedType;
    return isActive ? "btn-tab btn-tab-active" : "btn-tab";
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-surface)] border border-[var(--border-color)] p-4 mb-6", children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          onClick: () => openModal("post"),
          className: "flex gap-3 group cursor-pointer",
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-[var(--bg-surface-hover)] flex-shrink-0 flex items-center justify-center border border-[var(--border-color)] group-hover:border-primary-500/50 transition-colors text-[var(--text-main)] font-bold", children: userInitials }),
            /* @__PURE__ */ jsx("div", { className: "w-full bg-[var(--bg-body)] border border-[var(--border-color)] px-6 py-3 text-sm text-[var(--text-secondary)] group-hover:border-primary-500/50 group-hover:text-[var(--text-main)] transition-all flex items-center shadow-inner", children: "Start a post, share a mining update..." })
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center mt-4 pt-3 pl-16", children: /* @__PURE__ */ jsx("div", { className: "flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar", children: ALL_TABS.map((tab) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => navigateToFeed(tab.id),
          className: getButtonClass(tab.id),
          children: [
            tab.icon,
            " ",
            tab.label
          ]
        },
        tab.id
      )) }) })
    ] }),
    isOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200",
        onClick: handleBackdropClick,
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            ref: modalRef,
            className: "bg-[var(--bg-surface)] w-full max-w-4xl max-h-[90vh] border border-[var(--border-color)] shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200",
            children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setIsOpen(false),
                  className: "absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-main)] z-10 p-2 rounded-full hover:bg-[var(--bg-surface-hover)] transition-colors",
                  children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "p-6 border-b border-[var(--border-color)] bg-[var(--bg-surface)]", children: /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-[var(--text-main)]", children: editId ? "Edit Content" : "Create Content" }) }),
              /* @__PURE__ */ jsx("div", { className: "border-b border-[var(--border-color)] bg-[var(--bg-surface)] px-6", children: /* @__PURE__ */ jsx("nav", { className: "flex -mb-px space-x-8", "aria-label": "Tabs", children: tabs.map((tab) => /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setActiveTab(tab.id),
                  className: `
                                            group inline-flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                            ${activeTab === tab.id ? "border-primary-500 text-primary-400" : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:border-[var(--border-color)]"}
                                        `,
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "mr-2", children: tab.icon }),
                    tab.label
                  ]
                },
                tab.id
              )) }) }),
              /* @__PURE__ */ jsxs("div", { className: "overflow-y-auto p-6 md:p-8 custom-scrollbar bg-[var(--bg-body)] flex-1", children: [
                activeTab === "post" && /* @__PURE__ */ jsx(PostForm, { currentUser, initialData: { editId: editId || void 0 } }),
                activeTab === "event" && /* @__PURE__ */ jsx(EventForm, { currentUser }),
                activeTab === "podcast" && /* @__PURE__ */ jsx(PodcastForm, { currentUser }),
                activeTab === "service" && /* @__PURE__ */ jsx(ServiceForm, { currentUser })
              ] })
            ]
          }
        )
      }
    )
  ] });
}

const $$Astro = createAstro();
const $$Feed = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Feed;
  const feedType = Astro2.url.searchParams.get("feed") || "post";
  let data = [];
  let error = null;
  if (feedType === "post") {
    const { data: posts, error: err } = await supabase.from("posts").select(
      `*, author:profiles(full_name, avatar_url, profession, company, profile_slug), topic:topics(name, slug)`
    ).order("created_at", { ascending: false }).limit(20);
    data = posts || [];
    error = err;
  } else if (feedType === "event") {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const { data: events, error: err } = await supabase.from("events").select("*").or(`end_date.gte.${now},start_date.gte.${now}`).order("created_at", { ascending: false }).limit(50);
    data = events || [];
    error = err;
  } else if (feedType === "podcast") {
    const { data: podcasts, error: err } = await supabase.from("podcasts").select("*").order("created_at", { ascending: false }).limit(20);
    data = podcasts || [];
    error = err;
  } else if (feedType === "service") {
    const { data: services, error: err } = await supabase.from("services").select("*").order("created_at", { ascending: false }).limit(20);
    data = services || [];
    error = err;
  }
  if (error) {
    console.error(`Error fetching ${feedType} feed:`, error);
  }
  return renderTemplate`${maybeRenderHead()}<div class="w-full mx-auto pb-20"> <!-- Header / Creator --> ${Astro2.locals.user && renderTemplate`${renderComponent($$result, "CreateContentModal", CreateContentModal, { "client:load": true, "currentUser": Astro2.locals.user, "userInitials": Astro2.locals.user.email?.charAt(0).toUpperCase() || "U", "activeFeed": feedType, "client:component-hydration": "load", "client:component-path": "D:/zveniaproject/src/components/dashboard/CreateContentModal", "client:component-export": "default" })}`} <!-- Feed Label --> <div class="flex justify-between items-center px-4 mb-4"> <h3 class="text-(--text-main) font-bold text-lg capitalize flex items-center gap-2"> ${feedType === "post" && renderTemplate`<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> ${renderComponent($$result, "Fragment", Fragment$1, {}, { "default": async ($$result2) => renderTemplate` <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path> <polyline points="14 2 14 8 20 8"></polyline> <line x1="16" y1="13" x2="8" y2="13"></line> <line x1="16" y1="17" x2="8" y2="17"></line> <line x1="10" y1="9" x2="8" y2="9"></line> ` })} </svg>`} ${feedType === "event" && renderTemplate`<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> ${renderComponent($$result, "Fragment", Fragment$1, {}, { "default": async ($$result2) => renderTemplate` <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect> <line x1="16" y1="2" x2="16" y2="6"></line> <line x1="8" y1="2" x2="8" y2="6"></line> <line x1="3" y1="10" x2="21" y2="10"></line> ` })} </svg>`} ${feedType === "podcast" && renderTemplate`<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> ${renderComponent($$result, "Fragment", Fragment$1, {}, { "default": async ($$result2) => renderTemplate` <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path> <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path> <line x1="12" y1="19" x2="12" y2="23"></line> <line x1="8" y1="23" x2="16" y2="23"></line> ` })} </svg>`} ${feedType === "service" && renderTemplate`<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> ${renderComponent($$result, "Fragment", Fragment$1, {}, { "default": async ($$result2) => renderTemplate` <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect> <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path> ` })} </svg>`} ${feedType === "post" && "Latest Posts"} ${feedType === "event" && "Upcoming Events"} ${feedType === "podcast" && "Recent Podcasts"} ${feedType === "service" && "Professional Services"} </h3> <span class="text-xs text-gray-500">Sorted by: <span class="font-bold text-(--text-main)">Newest</span></span> </div> <!-- Empty State --> ${data.length === 0 && renderTemplate`<div class="text-center py-16 bg-[#1A1A1A] border border-white/10 mx-4"> <div class="mb-4 opacity-20 flex justify-center"> ${feedType === "post" && renderTemplate`<svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"> <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path> <polyline points="14 2 14 8 20 8"></polyline> <line x1="16" y1="13" x2="8" y2="13"></line> <line x1="16" y1="17" x2="8" y2="17"></line> <line x1="10" y1="9" x2="8" y2="9"></line> </svg>`} ${feedType === "event" && renderTemplate`<svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"> <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect> <line x1="16" y1="2" x2="16" y2="6"></line> <line x1="8" y1="2" x2="8" y2="6"></line> <line x1="3" y1="10" x2="21" y2="10"></line> </svg>`} ${feedType === "podcast" && renderTemplate`<svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"> <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path> <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path> <line x1="12" y1="19" x2="12" y2="23"></line> <line x1="8" y1="23" x2="16" y2="23"></line> </svg>`} ${feedType === "service" && renderTemplate`<svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"> <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect> <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path> </svg>`} </div> <h3 class="text-xl font-bold text-white mb-2">
No ${feedType}s found
</h3> <p class="text-gray-400 text-sm">Be the first to create one!</p> </div>`} <!-- FEED RENDERER --> <div${addAttribute(feedType === "event" || feedType === "service" ? "grid grid-cols-1 md:grid-cols-2 gap-4 px-2" : "space-y-4 px-2 max-w-[600px] mx-auto", "class")}>  ${feedType === "post" && data.map((item) => renderTemplate`${renderComponent($$result, "PostCard", $$PostCard, { "post": item, "currentUser": Astro2.locals.user })}`)}  ${feedType === "event" && data.map((item) => renderTemplate`${renderComponent($$result, "EventCard", EventCard, { "client:load": true, "event": item, "currentUser": Astro2.locals.user, "client:component-hydration": "load", "client:component-path": "D:/zveniaproject/src/components/social/EventCard", "client:component-export": "default" })}`)}  ${feedType === "podcast" && data.map((item) => renderTemplate`${renderComponent($$result, "PodcastRow", PodcastRow, { "client:load": true, "podcast": item, "currentUser": Astro2.locals.user, "client:component-hydration": "load", "client:component-path": "D:/zveniaproject/src/components/social/PodcastRow", "client:component-export": "default" })}`)}  ${feedType === "service" && data.map((item) => renderTemplate`${renderComponent($$result, "ServiceCard", ServiceCard, { "client:load": true, "service": item, "currentUser": Astro2.locals.user, "client:component-hydration": "load", "client:component-path": "D:/zveniaproject/src/components/social/ServiceCard", "client:component-export": "default" })}`)} </div> </div>`;
}, "D:/zveniaproject/src/components/social/Feed.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "SocialLayout", $$SocialLayout, { "title": "ZVENIA Mining - Homepage" }, { "default": ($$result2) => renderTemplate`   ${renderComponent($$result2, "Feed", $$Feed, {})}  `, "left-sidebar": ($$result2) => renderTemplate`${renderComponent($$result2, "LeftSidebar", $$LeftSidebar, { "slot": "left-sidebar" })}`, "right-sidebar": ($$result2) => renderTemplate`${renderComponent($$result2, "RightSidebar", $$RightSidebar, { "slot": "right-sidebar" })}` })}`;
}, "D:/zveniaproject/src/pages/index.astro", void 0);

const $$file = "D:/zveniaproject/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

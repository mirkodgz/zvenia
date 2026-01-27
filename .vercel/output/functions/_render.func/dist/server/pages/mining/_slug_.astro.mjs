import { e as createComponent, f as createAstro, k as renderComponent, n as renderScript, r as renderTemplate, p as Fragment, al as defineScriptVars, m as maybeRenderHead } from '../../chunks/astro/server_0Ysjtq05.mjs';
import 'piccolore';
import { $ as $$SocialLayout, a as $$LeftSidebar } from '../../chunks/LeftSidebar_DwHsW1bP.mjs';
import { $ as $$RightSidebar } from '../../chunks/RightSidebar_BK4xkNnG.mjs';
import { S as ServiceCard, E as EventCard } from '../../chunks/ServiceCard_wi3Dro0O.mjs';
import { $ as $$PostCard } from '../../chunks/PostCard_B_2DrTdi.mjs';
import { P as PodcastRow } from '../../chunks/PodcastRow_BuOEXnVg.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useRef } from 'react';
import { s as supabase } from '../../chunks/supabase_DsxxBtwu.mjs';
export { renderers } from '../../renderers.mjs';

const ServiceRow = ({ title, services, currentUser }) => {
  const scrollContainerRef = useRef(null);
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };
  if (services.length === 0) return null;
  return /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6 mb-6 relative group/row transition-colors", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center mb-4", children: /* @__PURE__ */ jsxs("h3", { className: "text-xl font-bold text-[var(--text-main)] flex items-center gap-2", children: [
      title,
      /* @__PURE__ */ jsx("span", { className: "text-xs font-normal text-[var(--text-secondary)] bg-[var(--bg-surface)] px-2 py-0.5 rounded-full border border-[var(--border-color)]", children: services.length })
    ] }) }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => scroll("left"),
        className: "absolute left-2 top-1/2 z-10 p-2 bg-[var(--bg-surface)] rounded-full text-[var(--text-main)] opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-primary-600 border border-[var(--border-color)] shadow-md disabled:opacity-0",
        children: "←"
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => scroll("right"),
        className: "absolute right-2 top-1/2 z-10 p-2 bg-[var(--bg-surface)] rounded-full text-[var(--text-main)] opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-primary-600 border border-[var(--border-color)] shadow-md",
        children: "→"
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: scrollContainerRef,
        className: "flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide",
        style: { scrollbarWidth: "none", msOverflowStyle: "none" },
        children: services.map((service) => /* @__PURE__ */ jsx(ServiceCard, { service, currentUser }, service.id))
      }
    )
  ] });
};

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  if (!slug) {
    return Astro2.redirect("/404");
  }
  let topic;
  if (slug === "all" || slug === "all-topics") {
    topic = {
      id: null,
      name: "All Topics",
      slug: "all",
      description: "browse all posts from every category."
    };
  } else {
    const { data } = await supabase.from("topics").select("*").eq("slug", slug).single();
    topic = data;
  }
  if (!topic) {
    return Astro2.redirect("/404");
  }
  async function getLinkedIds(table, topicId, idCol) {
    const { data } = await supabase.from(table).select(idCol).eq("topic_id", topicId);
    return data?.map((r) => r[idCol]) || [];
  }
  console.log(
    `[TOPIC DEBUG] Fetching content for topic: ${topic.name} (${topic.id})`
  );
  const [postIds, podcastIds, talkIds, presentationIds, serviceIds, eventIds] = await Promise.all([
    // Posts: Direct FK or All
    (topic.id ? supabase.from("posts").select("id").eq("topic_id", topic.id).order("created_at", { ascending: false }).order("id", { ascending: true }) : supabase.from("posts").select("id").order("created_at", { ascending: false }).order("id", { ascending: true }).limit(2e3)).then(({ data, error }) => {
      if (error) console.error("[TOPIC DEBUG] Post Fetch Error:", error);
      return data?.map((p) => p.id) || [];
    }),
    // Podcasts: Direct FK
    (topic.id ? supabase.from("podcasts").select("id").eq("topic_id", topic.id).order("created_at", { ascending: false }) : supabase.from("podcasts").select("id").limit(20)).then(({ data }) => data?.map((p) => p.id) || []),
    topic.id ? getLinkedIds("talks_topics", topic.id, "talks_id") : Promise.resolve([]),
    topic.id ? getLinkedIds("presentations_topics", topic.id, "presentations_id") : Promise.resolve([]),
    // Services: Direct FK
    (topic.id ? supabase.from("services").select("id").eq("topic_id", topic.id).order("created_at", { ascending: false }) : supabase.from("services").select("id").limit(20)).then(({ data }) => data?.map((s) => s.id) || []),
    // Events: Direct FK
    (topic.id ? supabase.from("events").select("id").eq("topic_id", topic.id).order("created_at", { ascending: false }) : supabase.from("events").select("id").limit(100)).then(({ data }) => data?.map((e) => e.id) || [])
  ]);
  console.log(
    `[TOPIC DEBUG] Found IDs - Posts: ${postIds.length}, Events: ${eventIds.length}, Podcasts: ${podcastIds.length}, Services: ${serviceIds.length}`
  );
  const fetchContent = async (table, ids, typeLabel) => {
    if (ids.length === 0) return [];
    const safeIds = ids.slice(0, 500);
    let selectQuery = "*";
    if (table === "posts") {
      selectQuery = "*, author:profiles(full_name, avatar_url, profession, company, profile_slug)";
    } else if (table === "services") {
      selectQuery = "*, type:service_types(name, slug)";
    }
    let query = supabase.from(table).select(selectQuery).in("id", safeIds);
    if (table === "events") {
      const now = (/* @__PURE__ */ new Date()).toISOString();
      query = query.or(`end_date.gte.${now},start_date.gte.${now}`).order("start_date", { ascending: true });
    } else if (table === "services") {
      query = query.order("created_at", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false }).order("id", { ascending: true });
    }
    const limit = table === "posts" ? 15 : table === "events" ? 100 : 20;
    const { data } = await query.limit(limit);
    return data?.map((item) => ({
      ...item,
      type: typeLabel,
      collection: table
    })) || [];
  };
  const [
    postItems,
    podcastItems,
    talkItems,
    presentationItems,
    serviceItems,
    realEventItems
  ] = await Promise.all([
    fetchContent("posts", postIds, "Post"),
    fetchContent("podcasts", podcastIds, "Podcast"),
    fetchContent("talks", talkIds, "Talk"),
    fetchContent("presentations", presentationIds, "Presentation"),
    fetchContent("services", serviceIds, "Service"),
    fetchContent("events", eventIds, "Event")
  ]);
  const eventItems = realEventItems;
  return renderTemplate`${renderComponent($$result, "SocialLayout", $$SocialLayout, { "title": `${topic.name} - Mining Topic | Zvenia` }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(["    ", '<div class="max-w-4xl mx-auto space-y-6"> <!-- Topic Content (Center) --> <main class="w-full"> <!-- First Block: Header + Tabs --> <div class="mb-6"> <!-- Topic Header --> <div class="mb-4"> <h1 class="text-3xl font-bold text-dark mb-2"> ', ' </h1> <p class="text-dark text-sm" style="font-size: 15px; font-weight: 400;">\nLatest discussions, news, and insights on ', '.\n</p> </div> <!-- Functional Tabs --> <div class="flex gap-4 overflow-x-auto no-scrollbar pb-1 mb-4" id="topic-tabs"> <button class="tab-btn btn-tab btn-tab-active shrink-0" data-target="posts">\nPosts (', ')\n</button> <button class="tab-btn btn-tab shrink-0" data-target="events">\nEvents (', ')\n</button> <button class="tab-btn btn-tab shrink-0" data-target="podcasts">\nPodcasts (', ')\n</button> <button class="tab-btn btn-tab shrink-0" data-target="services">\nServices (', ')\n</button> </div> <!-- Search Bar (Subtle & Below Tabs) --> <div class="mb-4 relative group max-w-sm"> <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <svg class="h-4 w-4 text-gray-400 group-focus-within:text-primary-400 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg> </div> <input type="text" id="post-search" placeholder="Search in this topic..." class="block w-full pl-9 pr-4 py-2 bg-transparent border border-gray-200 rounded-full text-dark placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all text-xs" style="border-radius: 9999px;"> <div class="absolute inset-y-0 right-0 pr-3 flex items-center"> <div id="search-spinner" class="hidden animate-spin h-3 w-3 text-primary-400"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> </div> </div> </div> </div> <!-- Second Block: Content Sections --> <div class="space-y-4"> <!-- Content Sections --> <!-- POSTS SECTION --> <div id="tab-posts" class="tab-content space-y-8 max-w-[600px] mx-auto"> ', ' </div> <!-- Infinite Scroll Sentinel (invisible trigger for auto-loading) --> <div id="scroll-sentinel" class="h-20 flex items-center justify-center"> <div id="loading-indicator" class="hidden text-xs text-dark animate-pulse">\nLoading more posts...\n</div> </div> <!-- Load More Button (hidden by default, shown only if infinite scroll fails) --> <div class="mt-8 text-center pb-12 hidden" id="load-more-container"> <button id="load-more-btn" class="px-8 py-3 bg-white border border-(--border-color) rounded-full text-sm font-bold text-dark hover:border-primary-500 hover:bg-primary-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider" style="border-radius: 0.6666666667rem;">\nLoad More Posts\n</button> </div> </div> </main> </div> <script>(function(){', '\n        let offset = initialOffset;\n        let currentSearch = "";\n        const limit = 15; // Load 15 posts at a time for smooth infinite scroll\n        let isLoading = false;\n        let hasMorePosts = true;\n\n        const btn = document.getElementById("load-more-btn");\n        const loadMoreContainer = document.getElementById(\n            "load-more-container",\n        );\n        const sentinel = document.getElementById("scroll-sentinel");\n        const loadingIndicator = document.getElementById("loading-indicator");\n        const container = document.getElementById("tab-posts");\n        const searchInput = document.getElementById("post-search");\n        const searchSpinner = document.getElementById("search-spinner");\n\n        // Debounce Helper\n        const debounce = (func, wait) => {\n            let timeout;\n            return (...args) => {\n                clearTimeout(timeout);\n                timeout = setTimeout(() => func.apply(this, args), wait);\n            };\n        };\n\n        const loadPosts = async (isSearch = false) => {\n            // Prevent multiple simultaneous loads\n            if (isLoading) return;\n            if (!hasMorePosts && !isSearch) return;\n\n            isLoading = true;\n            if (isSearch && searchSpinner)\n                searchSpinner.classList.remove("hidden");\n            if (!isSearch && loadingIndicator)\n                loadingIndicator.classList.remove("hidden");\n            if (btn) btn.disabled = true;\n\n            try {\n                const fetchOffset = isSearch ? 0 : offset;\n                const url = `/partials/posts-partial?slug=${currentSlug}&limit=${limit}&offset=${fetchOffset}&search=${encodeURIComponent(currentSearch)}`;\n\n                const res = await fetch(url);\n                if (!res.ok) throw new Error("Fetch failed");\n\n                const html = await res.text();\n\n                if (isSearch) {\n                    // Replace Content\n                    container.innerHTML = html;\n                    offset = limit; // Next offset\n                    hasMorePosts = html.trim().length > 0;\n                    if (loadMoreContainer)\n                        loadMoreContainer.classList.add("hidden");\n                } else {\n                    // Append Content (Infinite Scroll)\n                    if (!html.trim()) {\n                        hasMorePosts = false;\n                        if (sentinel) sentinel.classList.add("hidden");\n                        if (loadMoreContainer)\n                            loadMoreContainer.classList.add("hidden");\n                        return;\n                    }\n                    const temp = document.createElement("div");\n                    temp.innerHTML = html;\n                    while (temp.firstChild) {\n                        container.appendChild(temp.firstChild);\n                    }\n                    offset += limit;\n                    hasMorePosts = true;\n                }\n\n                // Re-bind listeners\n                if (typeof window.attachListeners === "function") {\n                    window.attachListeners();\n                }\n            } catch (e) {\n                console.error(e);\n                hasMorePosts = false;\n                if (sentinel) sentinel.classList.add("hidden");\n                // Show manual load button as fallback\n                if (loadMoreContainer)\n                    loadMoreContainer.classList.remove("hidden");\n                if (btn)\n                    btn.textContent = "Error loading posts. Click to retry.";\n            } finally {\n                isLoading = false;\n                if (searchSpinner) searchSpinner.classList.add("hidden");\n                if (loadingIndicator) loadingIndicator.classList.add("hidden");\n                if (btn) btn.disabled = false;\n            }\n        };\n\n        // Intersection Observer for Infinite Scroll\n        if (sentinel && "IntersectionObserver" in window) {\n            const observer = new IntersectionObserver(\n                (entries) => {\n                    entries.forEach((entry) => {\n                        if (\n                            entry.isIntersecting &&\n                            hasMorePosts &&\n                            !isLoading &&\n                            !currentSearch\n                        ) {\n                            loadPosts(false);\n                        }\n                    });\n                },\n                {\n                    rootMargin: "200px", // Start loading 200px before reaching the sentinel\n                },\n            );\n\n            observer.observe(sentinel);\n        } else {\n            // Fallback: Show manual load button if IntersectionObserver is not supported\n            if (loadMoreContainer) loadMoreContainer.classList.remove("hidden");\n        }\n\n        // Search Listener\n        if (searchInput) {\n            searchInput.addEventListener(\n                "input",\n                debounce((e) => {\n                    currentSearch = e.target.value.trim();\n                    hasMorePosts = true; // Reset for new search\n                    loadPosts(true);\n                }, 500),\n            );\n        }\n\n        // Manual Load More Button (fallback)\n        if (btn) {\n            btn.addEventListener("click", () => loadPosts(false));\n        }\n\n        // Hide sentinel if initial load shows all posts\n        if (initialOffset < limit) {\n            if (sentinel) sentinel.classList.add("hidden");\n        }\n    })();<\/script>  <div id="tab-events" class="tab-content hidden space-y-4"> <div class="space-y-12"> ', ' </div> </div>  <div id="tab-podcasts" class="tab-content hidden space-y-4"> ', ' </div>  <div id="tab-services" class="tab-content hidden space-y-4"> ', " </div> "], ["    ", '<div class="max-w-4xl mx-auto space-y-6"> <!-- Topic Content (Center) --> <main class="w-full"> <!-- First Block: Header + Tabs --> <div class="mb-6"> <!-- Topic Header --> <div class="mb-4"> <h1 class="text-3xl font-bold text-dark mb-2"> ', ' </h1> <p class="text-dark text-sm" style="font-size: 15px; font-weight: 400;">\nLatest discussions, news, and insights on ', '.\n</p> </div> <!-- Functional Tabs --> <div class="flex gap-4 overflow-x-auto no-scrollbar pb-1 mb-4" id="topic-tabs"> <button class="tab-btn btn-tab btn-tab-active shrink-0" data-target="posts">\nPosts (', ')\n</button> <button class="tab-btn btn-tab shrink-0" data-target="events">\nEvents (', ')\n</button> <button class="tab-btn btn-tab shrink-0" data-target="podcasts">\nPodcasts (', ')\n</button> <button class="tab-btn btn-tab shrink-0" data-target="services">\nServices (', ')\n</button> </div> <!-- Search Bar (Subtle & Below Tabs) --> <div class="mb-4 relative group max-w-sm"> <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <svg class="h-4 w-4 text-gray-400 group-focus-within:text-primary-400 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg> </div> <input type="text" id="post-search" placeholder="Search in this topic..." class="block w-full pl-9 pr-4 py-2 bg-transparent border border-gray-200 rounded-full text-dark placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all text-xs" style="border-radius: 9999px;"> <div class="absolute inset-y-0 right-0 pr-3 flex items-center"> <div id="search-spinner" class="hidden animate-spin h-3 w-3 text-primary-400"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> </div> </div> </div> </div> <!-- Second Block: Content Sections --> <div class="space-y-4"> <!-- Content Sections --> <!-- POSTS SECTION --> <div id="tab-posts" class="tab-content space-y-8 max-w-[600px] mx-auto"> ', ' </div> <!-- Infinite Scroll Sentinel (invisible trigger for auto-loading) --> <div id="scroll-sentinel" class="h-20 flex items-center justify-center"> <div id="loading-indicator" class="hidden text-xs text-dark animate-pulse">\nLoading more posts...\n</div> </div> <!-- Load More Button (hidden by default, shown only if infinite scroll fails) --> <div class="mt-8 text-center pb-12 hidden" id="load-more-container"> <button id="load-more-btn" class="px-8 py-3 bg-white border border-(--border-color) rounded-full text-sm font-bold text-dark hover:border-primary-500 hover:bg-primary-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider" style="border-radius: 0.6666666667rem;">\nLoad More Posts\n</button> </div> </div> </main> </div> <script>(function(){', '\n        let offset = initialOffset;\n        let currentSearch = "";\n        const limit = 15; // Load 15 posts at a time for smooth infinite scroll\n        let isLoading = false;\n        let hasMorePosts = true;\n\n        const btn = document.getElementById("load-more-btn");\n        const loadMoreContainer = document.getElementById(\n            "load-more-container",\n        );\n        const sentinel = document.getElementById("scroll-sentinel");\n        const loadingIndicator = document.getElementById("loading-indicator");\n        const container = document.getElementById("tab-posts");\n        const searchInput = document.getElementById("post-search");\n        const searchSpinner = document.getElementById("search-spinner");\n\n        // Debounce Helper\n        const debounce = (func, wait) => {\n            let timeout;\n            return (...args) => {\n                clearTimeout(timeout);\n                timeout = setTimeout(() => func.apply(this, args), wait);\n            };\n        };\n\n        const loadPosts = async (isSearch = false) => {\n            // Prevent multiple simultaneous loads\n            if (isLoading) return;\n            if (!hasMorePosts && !isSearch) return;\n\n            isLoading = true;\n            if (isSearch && searchSpinner)\n                searchSpinner.classList.remove("hidden");\n            if (!isSearch && loadingIndicator)\n                loadingIndicator.classList.remove("hidden");\n            if (btn) btn.disabled = true;\n\n            try {\n                const fetchOffset = isSearch ? 0 : offset;\n                const url = \\`/partials/posts-partial?slug=\\${currentSlug}&limit=\\${limit}&offset=\\${fetchOffset}&search=\\${encodeURIComponent(currentSearch)}\\`;\n\n                const res = await fetch(url);\n                if (!res.ok) throw new Error("Fetch failed");\n\n                const html = await res.text();\n\n                if (isSearch) {\n                    // Replace Content\n                    container.innerHTML = html;\n                    offset = limit; // Next offset\n                    hasMorePosts = html.trim().length > 0;\n                    if (loadMoreContainer)\n                        loadMoreContainer.classList.add("hidden");\n                } else {\n                    // Append Content (Infinite Scroll)\n                    if (!html.trim()) {\n                        hasMorePosts = false;\n                        if (sentinel) sentinel.classList.add("hidden");\n                        if (loadMoreContainer)\n                            loadMoreContainer.classList.add("hidden");\n                        return;\n                    }\n                    const temp = document.createElement("div");\n                    temp.innerHTML = html;\n                    while (temp.firstChild) {\n                        container.appendChild(temp.firstChild);\n                    }\n                    offset += limit;\n                    hasMorePosts = true;\n                }\n\n                // Re-bind listeners\n                if (typeof window.attachListeners === "function") {\n                    window.attachListeners();\n                }\n            } catch (e) {\n                console.error(e);\n                hasMorePosts = false;\n                if (sentinel) sentinel.classList.add("hidden");\n                // Show manual load button as fallback\n                if (loadMoreContainer)\n                    loadMoreContainer.classList.remove("hidden");\n                if (btn)\n                    btn.textContent = "Error loading posts. Click to retry.";\n            } finally {\n                isLoading = false;\n                if (searchSpinner) searchSpinner.classList.add("hidden");\n                if (loadingIndicator) loadingIndicator.classList.add("hidden");\n                if (btn) btn.disabled = false;\n            }\n        };\n\n        // Intersection Observer for Infinite Scroll\n        if (sentinel && "IntersectionObserver" in window) {\n            const observer = new IntersectionObserver(\n                (entries) => {\n                    entries.forEach((entry) => {\n                        if (\n                            entry.isIntersecting &&\n                            hasMorePosts &&\n                            !isLoading &&\n                            !currentSearch\n                        ) {\n                            loadPosts(false);\n                        }\n                    });\n                },\n                {\n                    rootMargin: "200px", // Start loading 200px before reaching the sentinel\n                },\n            );\n\n            observer.observe(sentinel);\n        } else {\n            // Fallback: Show manual load button if IntersectionObserver is not supported\n            if (loadMoreContainer) loadMoreContainer.classList.remove("hidden");\n        }\n\n        // Search Listener\n        if (searchInput) {\n            searchInput.addEventListener(\n                "input",\n                debounce((e) => {\n                    currentSearch = e.target.value.trim();\n                    hasMorePosts = true; // Reset for new search\n                    loadPosts(true);\n                }, 500),\n            );\n        }\n\n        // Manual Load More Button (fallback)\n        if (btn) {\n            btn.addEventListener("click", () => loadPosts(false));\n        }\n\n        // Hide sentinel if initial load shows all posts\n        if (initialOffset < limit) {\n            if (sentinel) sentinel.classList.add("hidden");\n        }\n    })();<\/script>  <div id="tab-events" class="tab-content hidden space-y-4"> <div class="space-y-12"> ', ' </div> </div>  <div id="tab-podcasts" class="tab-content hidden space-y-4"> ', ' </div>  <div id="tab-services" class="tab-content hidden space-y-4"> ', " </div> "])), maybeRenderHead(), topic.name, topic.name, postIds.length, eventIds.length, podcastIds.length, serviceIds.length, postItems.length === 0 ? renderTemplate`<div class="text-center py-12 bg-white rounded-lg border border-(--border-color) flex flex-col items-center" style="border-radius: 0.6666666667rem;"> <div class="mb-4 text-gray-400"> <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"> ${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path> <polyline points="14 2 14 8 20 8"></polyline> <line x1="16" y1="13" x2="8" y2="13"></line> <line x1="16" y1="17" x2="8" y2="17"></line> <line x1="10" y1="9" x2="8" y2="9"></line> ` })} </svg> </div> <h3 class="text-xl font-bold text-dark mb-2">
No posts yet
</h3> <p class="text-dark text-sm" style="font-size: 15px;">
Be the first to post about ${topic.name}!
</p> </div>` : postItems.map((item) => renderTemplate`${renderComponent($$result2, "PostCard", $$PostCard, { "post": item, "currentUser": Astro2.locals.user })}`), defineScriptVars({ initialOffset: postItems.length, currentSlug: slug }), (() => {
    const series = eventItems.filter(
      (e) => !e.event_type || e.event_type === "event-series"
    );
    const webinars = eventItems.filter(
      (e) => e.event_type === "webinar" || e.event_type === "webinars"
    );
    const trainings = eventItems.filter(
      (e) => e.event_type === "training-course" || e.event_type === "training-courses"
    );
    const renderSection = (title, items) => {
      if (items.length === 0) return null;
      return renderTemplate`<div> <h3 class="text-xl font-bold text-dark mb-4 border-b border-(--border-color) pb-2"> ${title} </h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> ${items.map((item) => renderTemplate`${renderComponent($$result2, "EventCard", EventCard, { "client:load": true, "event": item, "currentUser": Astro2.locals.user, "client:component-hydration": "load", "client:component-path": "D:/zveniaproject/src/components/social/EventCard", "client:component-export": "default" })}`)} </div> </div>`;
    };
    return renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`${renderSection("Event Series", series)}${renderSection("Webinars", webinars)}${renderSection("Training Courses", trainings)}${series.length === 0 && webinars.length === 0 && trainings.length === 0 && renderTemplate`<div class="text-center py-12 bg-white rounded-lg border border-(--border-color) flex flex-col items-center" style="border-radius: 0.6666666667rem;"> <div class="mb-4 text-gray-400"> <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"> <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect> <line x1="16" y1="2" x2="16" y2="6"></line> <line x1="8" y1="2" x2="8" y2="6"></line> <line x1="3" y1="10" x2="21" y2="10"></line> </svg> </div> <h3 class="text-xl font-bold text-dark mb-2">
No events scheduled
</h3> </div>`}` })}`;
  })(), podcastItems.length === 0 ? renderTemplate`<div class="text-center py-12 bg-white rounded-lg border border-(--border-color) flex flex-col items-center" style="border-radius: 0.6666666667rem;"> <div class="mb-4 text-gray-400"> <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"> ${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path> <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path> <line x1="12" y1="19" x2="12" y2="23"></line> <line x1="8" y1="23" x2="16" y2="23"></line> ` })} </svg> </div> <h3 class="text-xl font-bold text-dark mb-2">
No podcasts yet
</h3> </div>` : podcastItems.map((item) => renderTemplate`${renderComponent($$result2, "PodcastRow", PodcastRow, { "client:load": true, "podcast": item, "currentUser": Astro2.locals.user, "client:component-hydration": "load", "client:component-path": "D:/zveniaproject/src/components/social/PodcastRow", "client:component-export": "default" })}`), serviceItems.length === 0 ? renderTemplate`<div class="text-center py-12 bg-white rounded-lg border border-(--border-color) flex flex-col items-center" style="border-radius: 0.6666666667rem;"> <div class="mb-4 text-gray-400"> <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"> ${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect> <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path> ` })} </svg> </div> <h3 class="text-xl font-bold text-dark mb-2">
No services found
</h3> </div>` : renderTemplate`<div class="space-y-8"> ${(() => {
    const servicesByType = {};
    const uncategorized = [];
    serviceItems.forEach((item) => {
      const typeName = item.type?.name;
      if (typeName) {
        if (!servicesByType[typeName])
          servicesByType[typeName] = [];
        servicesByType[typeName].push(item);
      } else {
        uncategorized.push(item);
      }
    });
    const order = ["Consulting", "Software", "Books"];
    const renderedTypes = Object.keys(servicesByType).sort(
      (a, b) => {
        const idxA = order.indexOf(a);
        const idxB = order.indexOf(b);
        if (idxA !== -1 && idxB !== -1)
          return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.localeCompare(b);
      }
    );
    return renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`${renderedTypes.map((type) => renderTemplate`${renderComponent($$result3, "ServiceRow", ServiceRow, { "client:load": true, "title": type, "services": servicesByType[type], "currentUser": Astro2.locals.user, "client:component-hydration": "load", "client:component-path": "D:/zveniaproject/src/components/social/ServiceRow", "client:component-export": "default" })}`)}${uncategorized.length > 0 && renderTemplate`${renderComponent($$result3, "ServiceRow", ServiceRow, { "client:load": true, "title": "Other Services", "services": uncategorized, "currentUser": Astro2.locals.user, "client:component-hydration": "load", "client:component-path": "D:/zveniaproject/src/components/social/ServiceRow", "client:component-export": "default" })}`}` })}`;
  })()} </div>`), "left-sidebar": async ($$result2) => renderTemplate`${renderComponent($$result2, "LeftSidebar", $$LeftSidebar, { "slot": "left-sidebar", "activeTopicSlug": topic.slug })}`, "right-sidebar": async ($$result2) => renderTemplate`${renderComponent($$result2, "RightSidebar", $$RightSidebar, { "slot": "right-sidebar" })}` })} ${renderScript($$result, "D:/zveniaproject/src/pages/mining/[slug].astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/zveniaproject/src/pages/mining/[slug].astro", void 0);

const $$file = "D:/zveniaproject/src/pages/mining/[slug].astro";
const $$url = "/mining/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$slug,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

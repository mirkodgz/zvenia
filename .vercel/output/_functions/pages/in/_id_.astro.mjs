import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_0Ysjtq05.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_9oJT8HrB.mjs';
import { $ as $$Header } from '../../chunks/Header_FOfAroyN.mjs';
import { $ as $$PostCard } from '../../chunks/PostCard_D5ELRwwj.mjs';
import { E as EventCard, S as ServiceCard } from '../../chunks/ServiceCard_DzMz7GPt.mjs';
import { P as PodcastRow } from '../../chunks/PodcastRow_CTffmAUw.mjs';
import { s as supabase } from '../../chunks/supabase_DsxxBtwu.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_CxJDR4Zz.mjs';

const $$Astro = createAstro();
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  if (!id) {
    return Astro2.redirect("/404");
  }
  const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", id).single();
  if (profileError || !profile) {
    console.error("Profile not found:", profileError);
    return Astro2.redirect("/404");
  }
  const role = profile.role || "Basic";
  const activeTab = Astro2.url.searchParams.get("tab") || "posts";
  const rolePermissions = {
    "Basic": ["posts"],
    "Expert": ["posts", "podcasts"],
    "Events": ["posts", "events"],
    "Ads": ["posts", "services"],
    "CountryManager": ["posts", "events", "podcasts", "services"],
    "Administrator": ["posts", "events", "podcasts", "services"]
  };
  const allowedTabs = rolePermissions[role] || rolePermissions["Basic"];
  const currentTab = allowedTabs.includes(activeTab) ? activeTab : allowedTabs[0];
  const tabCounts = {};
  await Promise.all(allowedTabs.map(async (tab) => {
    const { count } = await supabase.from(tab).select("*", { count: "exact", head: true }).eq("author_id", id);
    tabCounts[tab] = count || 0;
  }));
  let items = [];
  try {
    if (currentTab === "posts") {
      const { data } = await supabase.from("posts").select(`*, author:profiles(*), topics(*)`).eq("author_id", id).order("created_at", { ascending: false });
      items = data || [];
    } else if (currentTab === "events") {
      const { data } = await supabase.from("events").select(`*, author:profiles(*)`).eq("author_id", id).order("start_date", { ascending: false });
      items = data || [];
    } else if (currentTab === "podcasts") {
      const { data } = await supabase.from("podcasts").select(`*, author:profiles(*)`).eq("author_id", id).order("created_at", { ascending: false });
      items = data || [];
    } else if (currentTab === "services") {
      const { data } = await supabase.from("services").select(`*, author:profiles(*)`).eq("author_id", id).order("created_at", { ascending: false });
      items = data || [];
    }
  } catch (e) {
    console.error("Error fetching content:", e);
  }
  const userInitial = profile.email ? profile.email.charAt(0).toUpperCase() : "U";
  const currentUser = Astro2.locals.user;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${profile.full_name || profile.email} | Zvenia` }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24"> <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">  <div class="lg:col-span-3 space-y-6">  <div class="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-sm relative">  <div class="h-48 bg-gradient-to-r from-gray-700 to-gray-600 relative"></div>  <div class="px-6 pb-6 relative">  <div class="absolute -top-16 left-6"> <div class="w-32 h-32 rounded-full border-4 border-[var(--bg-surface)] bg-[var(--bg-surface)] overflow-hidden flex items-center justify-center text-4xl text-primary-400 font-bold shadow-md relative"> ${profile.avatar_url ? renderTemplate`<img${addAttribute(profile.avatar_url, "src")}${addAttribute(profile.email, "alt")} class="w-full h-full object-cover">` : userInitial} </div> </div>  <div class="flex justify-end pt-4 mb-2">  <button class="text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] p-2 rounded-full"> <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg> </button> </div>  <div class="mt-4"> <h1 class="text-2xl font-bold text-[var(--text-main)] flex items-center gap-2"> ${profile.full_name || profile.username || profile.email} ${role !== "Basic" && renderTemplate`<span class="text-blue-500" title="Verified"> <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg> </span>`} </h1> <p class="text-[var(--text-main)] text-lg font-medium mt-1"> ${profile.profession || `${role} Account`} </p> <p class="text-[var(--text-secondary)] text-sm mt-1 flex items-center gap-1"> <svg class="w-4 h-4 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> ${profile.country || "Location not set"} </p> </div> </div> </div>  <div class="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-sm overflow-hidden"> <div class="border-b border-[var(--border-color)] px-4"> <nav class="-mb-px flex space-x-6" aria-label="Tabs"> ${allowedTabs.map((tab) => renderTemplate`<a${addAttribute(`?tab=${tab}`, "href")}${addAttribute(`
                                        whitespace-nowrap py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors
                                        ${currentTab === tab ? "border-emerald-600 text-emerald-600" : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:border-[var(--border-color)]"}
                                    `, "class")}> ${tab} <span class="opacity-60 ml-1">(${tabCounts[tab] || 0})</span> </a>`)} </nav> </div> <div class="p-6"> ${items.length === 0 ? renderTemplate`<div class="text-center py-10"> <div class="text-4xl mb-4 opacity-50 grayscale">📭</div> <h3 class="text-lg font-bold text-[var(--text-main)] mb-1">Hasn't posted yet</h3> </div>` : renderTemplate`<div class="space-y-6"> ${currentTab === "posts" && items.map((post) => renderTemplate`${renderComponent($$result2, "PostCard", $$PostCard, { "post": post, "currentUser": currentUser })}`)} ${currentTab === "events" && items.map((event) => renderTemplate`${renderComponent($$result2, "EventCard", EventCard, { "event": event, "currentUser": currentUser, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "D:/zveniaproject/src/components/social/EventCard.tsx", "client:component-export": "default" })}`)} ${currentTab === "podcasts" && items.map((podcast) => renderTemplate`${renderComponent($$result2, "PodcastRow", PodcastRow, { "podcast": podcast, "currentUser": currentUser, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "D:/zveniaproject/src/components/social/PodcastRow.tsx", "client:component-export": "default" })}`)} ${currentTab === "services" && items.map((service) => renderTemplate`${renderComponent($$result2, "ServiceCard", ServiceCard, { "service": service, "currentUser": currentUser, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "D:/zveniaproject/src/components/social/ServiceCard.tsx", "client:component-export": "default" })}`)} </div>`} </div> </div> </div>  <div class="hidden lg:block space-y-4">  <div class="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 shadow-sm text-center"> <p class="text-[var(--text-secondary)] text-xs mb-2">Ad •</p> <div class="bg-[var(--bg-surface-hover)] h-32 rounded-lg flex items-center justify-center mb-2"> <span class="text-[var(--text-secondary)] font-bold">Zvenia Hire</span> </div> <p class="text-[var(--text-main)] text-sm font-medium">See who's hiring.</p> </div> </div> </div> </div> `, "header": async ($$result2) => renderTemplate`${renderComponent($$result2, "Header", $$Header, { "slot": "header" })}` })}`;
}, "D:/zveniaproject/src/pages/in/[id].astro", void 0);

const $$file = "D:/zveniaproject/src/pages/in/[id].astro";
const $$url = "/in/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$id,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

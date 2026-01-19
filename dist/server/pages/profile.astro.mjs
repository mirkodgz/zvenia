import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_DxclfMW8.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_7SPMbouh.mjs';
import { $ as $$Header } from '../chunks/Header_CBLD9VNM.mjs';
import { $ as $$Footer } from '../chunks/Footer_CXCkbk4v.mjs';
import { $ as $$PostCard } from '../chunks/PostCard_BgmrP_li.mjs';
import { E as EventCard, P as PodcastRow, S as ServiceCard } from '../chunks/ServiceCard_oknzWG1l.mjs';
import { s as supabase } from '../chunks/supabase_HTSrsVit.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Profile = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Profile;
  const { user } = Astro2.locals;
  if (!user) {
    return Astro2.redirect("/login");
  }
  const role = user.role || "Basic";
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
  if (!allowedTabs.includes(activeTab)) ;
  const currentTab = allowedTabs.includes(activeTab) ? activeTab : allowedTabs[0];
  const tabCounts = {};
  await Promise.all(allowedTabs.map(async (tab) => {
    const { count } = await supabase.from(tab).select("*", { count: "exact", head: true }).eq("author_id", user.id);
    tabCounts[tab] = count || 0;
  }));
  let items = [];
  try {
    if (currentTab === "posts") {
      const { data, error: err } = await supabase.from("posts").select(`
                *,
                author:profiles(*),
                topics(*)
            `).eq("author_id", user.id).order("created_at", { ascending: false });
      if (err) throw err;
      items = data || [];
    } else if (currentTab === "events") {
      const { data, error: err } = await supabase.from("events").select(`
                *,
                author:profiles(*)
            `).eq("author_id", user.id).order("start_date", { ascending: false });
      if (err) throw err;
      items = data || [];
    } else if (currentTab === "podcasts") {
      const { data, error: err } = await supabase.from("podcasts").select(`
                *,
                author:profiles(*)
            `).eq("author_id", user.id).order("created_at", { ascending: false });
      if (err) throw err;
      items = data || [];
    } else if (currentTab === "services") {
      const { data, error: err } = await supabase.from("services").select(`
                *,
                author:profiles(*)
            `).eq("author_id", user.id).order("created_at", { ascending: false });
      if (err) throw err;
      items = data || [];
    }
  } catch (e) {
    console.error("Error fetching profile content:", e);
    e.message;
  }
  const userInitial = user.email ? user.email.charAt(0).toUpperCase() : "U";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Your Profile | Zvenia" }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24"> <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">  <div class="lg:col-span-3 space-y-6">  <div class="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-sm relative">  <div class="h-48 bg-gradient-to-r from-blue-700 to-cyan-500 relative">  </div>  <div class="px-6 pb-6 relative">  <div class="absolute -top-16 left-6"> <div class="w-32 h-32 rounded-full border-4 border-[var(--bg-surface)] bg-[var(--bg-surface)] overflow-hidden flex items-center justify-center text-4xl text-primary-400 font-bold shadow-md relative"> ${user.user_metadata?.avatar_url || user.user_metadata?.picture ? renderTemplate`<img${addAttribute(user.user_metadata.avatar_url || user.user_metadata.picture, "src")}${addAttribute(user.email, "alt")} class="w-full h-full object-cover">` : userInitial} </div> </div>  <div class="flex justify-end pt-4 mb-2"> <a href="/settings" class="p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] rounded-full transition-colors" title="Edit Profile"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"> <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.654a4.5 4.5 0 01-1.13-1.897l-1.352 4.09 4.09-1.352a4.5 4.5 0 011.897-1.13L16.863 4.487zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path> </svg> </a> </div>  <div class="mt-4"> <h1 class="text-2xl font-bold text-[var(--text-main)] flex items-center gap-2"> ${user.email} ${role !== "Basic" && renderTemplate`<span class="text-blue-500" title="Verified Type"> <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg> </span>`} </h1> <p class="text-[var(--text-main)] text-lg font-medium mt-1"> ${role} Account
</p> <p class="text-[var(--text-secondary)] text-sm mt-1 flex items-center gap-1"> <svg class="w-4 h-4 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> ${user.user_metadata?.country || "Location not set"} </p>  <div class="flex gap-4 mt-4 text-sm font-semibold text-blue-500 cursor-pointer hover:underline"> <span>500+ connections</span> </div>  <div class="flex gap-3 mt-4"> <button class="bg-primary-600 text-white px-6 py-1.5 rounded-full font-semibold hover:bg-primary-500 transition-colors">
Open to
</button> <button class="border border-primary-500 text-primary-500 px-6 py-1.5 rounded-full font-semibold hover:bg-primary-500/10 transition-colors">
Add profile section
</button> <button class="border border-[var(--border-color)] text-[var(--text-secondary)] px-6 py-1.5 rounded-full font-semibold hover:bg-[var(--bg-surface-hover)] transition-colors">
More
</button> </div> </div> </div> </div>  <div class="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-sm overflow-hidden">  <div class="border-b border-[var(--border-color)] px-4"> <nav class="-mb-px flex space-x-6" aria-label="Tabs"> ${allowedTabs.map((tab) => renderTemplate`<a${addAttribute(`?tab=${tab}`, "href")}${addAttribute(`
                                        whitespace-nowrap py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors
                                        ${currentTab === tab ? "border-emerald-600 text-emerald-600" : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:border-[var(--border-color)]"}
                                    `, "class")}> ${tab} <span class="opacity-60 ml-1">(${tabCounts[tab] || 0})</span> </a>`)} </nav> </div>  <div class="p-6"> ${items.length === 0 ? renderTemplate`<div class="text-center py-10"> <div class="text-4xl mb-4 opacity-50 grayscale">📝</div> <h3 class="text-lg font-bold text-[var(--text-main)] mb-1">Hasn't posted yet</h3> <p class="text-[var(--text-secondary)] text-sm">Posts you create will appear here.</p> </div>` : renderTemplate`<div class="space-y-6">  ${currentTab === "posts" && items.map((post) => renderTemplate`${renderComponent($$result2, "PostCard", $$PostCard, { "post": post, "currentUser": user })}`)} ${currentTab === "events" && items.map((event) => renderTemplate`${renderComponent($$result2, "EventCard", EventCard, { "event": event, "currentUser": user, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "D:/zvenia/astro-frontend/src/components/social/EventCard.tsx", "client:component-export": "default" })}`)} ${currentTab === "podcasts" && items.map((podcast) => renderTemplate`${renderComponent($$result2, "PodcastRow", PodcastRow, { "podcast": podcast, "currentUser": user, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "D:/zvenia/astro-frontend/src/components/social/PodcastRow.tsx", "client:component-export": "default" })}`)} ${currentTab === "services" && items.map((service) => renderTemplate`${renderComponent($$result2, "ServiceCard", ServiceCard, { "service": service, "currentUser": user, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "D:/zvenia/astro-frontend/src/components/social/ServiceCard.tsx", "client:component-export": "default" })}`)} </div>`} </div> </div> </div>  <div class="hidden lg:block space-y-4">  <div class="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 shadow-sm"> <div class="flex justify-between items-center mb-2 border-b border-[var(--border-color)] pb-2"> <span class="text-md font-bold text-[var(--text-main)]">Profile language</span> <svg class="w-5 h-5 text-[var(--text-secondary)] cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg> </div> <p class="text-[var(--text-secondary)] text-sm mb-4">English</p> <div class="flex justify-between items-center mb-2 border-b border-[var(--border-color)] pb-2 pt-2"> <span class="text-md font-bold text-[var(--text-main)]">Public profile & URL</span> <svg class="w-5 h-5 text-[var(--text-secondary)] cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg> </div> <p class="text-[var(--text-secondary)] text-sm truncate">www.zvenia.com/in/${user.email?.split("@")[0]}</p> </div>  <div class="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 shadow-sm text-center"> <p class="text-[var(--text-secondary)] text-xs mb-2">Ad •</p> <div class="bg-[var(--bg-surface-hover)] h-32 rounded-lg flex items-center justify-center mb-2"> <span class="text-[var(--text-secondary)] font-bold">Zvenia Hire</span> </div> <p class="text-[var(--text-main)] text-sm font-medium">See who's hiring on internal mining networks.</p> </div> </div> </div> </div> `, "header": async ($$result2) => renderTemplate`${renderComponent($$result2, "Header", $$Header, { "slot": "header" })}` })} ${renderComponent($$result, "Footer", $$Footer, { "slot": "footer" })} `;
}, "D:/zvenia/astro-frontend/src/pages/profile.astro", void 0);

const $$file = "D:/zvenia/astro-frontend/src/pages/profile.astro";
const $$url = "/profile";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
   __proto__: null,
   default: $$Profile,
   file: $$file,
   url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

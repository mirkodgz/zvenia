import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CNOy-_Bn.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../chunks/AdminLayout_H94Cvfdh.mjs';
import { c as createSupabaseServerClient } from '../chunks/supabase_HTSrsVit.mjs';
import { i as isAdministrator } from '../chunks/roles_DL-H1sB4.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const user = Astro2.locals.user;
  const profile = Astro2.locals.profile;
  const userRole = profile?.role || user?.role || "Basic";
  if (!user || !isAdministrator(userRole)) {
    return Astro2.redirect("/");
  }
  const supabase = createSupabaseServerClient({ req: Astro2.request, cookies: Astro2.cookies });
  const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
  const { count: postCount } = await supabase.from("posts").select("*", { count: "exact", head: true });
  const { count: eventCount } = await supabase.from("events").select("*", { count: "exact", head: true });
  const { data: roleCounts } = await supabase.from("profiles").select("role");
  const roles = roleCounts?.reduce((acc, curr) => {
    acc[curr.role || "Basic"] = (acc[curr.role || "Basic"] || 0) + 1;
    return acc;
  }, {}) || {};
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Dashboard" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="text-2xl font-bold text-white tracking-tight mb-8">Dashboard Overview</h1>  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"> <!-- Total Users --> <div class="bg-[#111111] border border-white/5 rounded-xl p-6 relative overflow-hidden group hover:border-primary-500/30 transition-colors"> <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"> <svg class="w-16 h-16 text-primary-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg> </div> <p class="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Users</p> <p class="text-3xl font-bold text-white mt-2">${userCount}</p> <div class="mt-4 flex items-center text-xs text-green-400"> <span class="flex items-center gap-1 font-bold">+12% <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg></span> <span class="text-gray-500 ml-2">from last month</span> </div> </div> <!-- Posts --> <div class="bg-[#111111] border border-white/5 rounded-xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors"> <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"> <svg class="w-16 h-16 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"></path></svg> </div> <p class="text-sm font-medium text-gray-400 uppercase tracking-wider">Published Posts</p> <p class="text-3xl font-bold text-white mt-2">${postCount}</p> </div> <!-- Events --> <div class="bg-[#111111] border border-white/5 rounded-xl p-6 relative overflow-hidden group hover:border-purple-500/30 transition-colors"> <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"> <svg class="w-16 h-16 text-purple-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"></path></svg> </div> <p class="text-sm font-medium text-gray-400 uppercase tracking-wider">Upcoming Events</p> <p class="text-3xl font-bold text-white mt-2">${eventCount}</p> </div> <!-- Roles Info --> <div class="bg-[#111111] border border-white/5 rounded-xl p-6 relative overflow-hidden"> <p class="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">User Distribution</p> <div class="space-y-2"> ${Object.entries(roles).slice(0, 3).map(([role, count]) => renderTemplate`<div class="flex justify-between items-center text-sm"> <span class="text-gray-300">${role}</span> <span class="font-bold text-white bg-white/10 px-2 py-0.5 rounded">${String(count)}</span> </div>`)} </div> </div> </div>  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"> <div class="bg-[#111111] border border-white/5 rounded-xl p-6 h-80 flex flex-col items-center justify-center text-gray-500"> <svg class="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg> <p>Activity Chart (Coming Soon)</p> </div> <div class="bg-[#111111] border border-white/5 rounded-xl p-6 h-80 flex flex-col items-center justify-center text-gray-500"> <svg class="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <p>Geographic Distribution (Coming Soon)</p> </div> </div> ` })}`;
}, "D:/zveniaproject/src/pages/admin/index.astro", void 0);

const $$file = "D:/zveniaproject/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

import { e as createComponent, f as createAstro, l as renderHead, k as renderComponent, h as addAttribute, o as renderSlot, p as Fragment, r as renderTemplate } from './astro/server_0Ysjtq05.mjs';
import 'piccolore';
/* empty css                         */
import { $ as $$Header } from './Header_C4uP1oNu.mjs';

const $$Astro = createAstro();
const $$AdminLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AdminLayout;
  const { title, activePage } = Astro2.props;
  const profile = Astro2.locals.profile;
  if (!profile) {
    return Astro2.redirect("/admin/login");
  }
  const getLinkClass = (page) => {
    const baseClass = "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors";
    const inactiveClass = "text-gray-700 hover:bg-gray-100";
    const activeClass = "bg-primary-50 text-primary-700 font-medium";
    return `${baseClass} ${activePage === page ? activeClass : inactiveClass}`;
  };
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex, nofollow"><title>${title} - Admin ZVENIA</title><!-- Fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"><!-- Material Icons --><link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">${renderHead()}</head> <body class="bg-gray-50"> <!-- Layout: Header + Sidebar + Main --> <div class="min-h-screen"> <!-- Header Principal (mismo que el resto del sitio) --> ${renderComponent($$result, "Header", $$Header, {})} <!-- Sidebar --> <aside class="fixed top-[70px] left-0 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto"> <nav class="p-4 space-y-1"> <!-- Dashboard --> <a href="/admin"${addAttribute(getLinkClass("dashboard"), "class")}> <span class="material-icons text-[20px]">dashboard</span> <span class="font-medium">Dashboard</span> </a> <!-- Posts --> <a href="/admin/posts"${addAttribute(getLinkClass("posts"), "class")}> <span class="material-icons text-[20px]">article</span> <span class="font-medium">Posts</span> </a> <!-- Events --> <a href="/admin/events"${addAttribute(getLinkClass("events"), "class")}> <span class="material-icons text-[20px]">event</span> <span class="font-medium">Events</span> </a> <!-- Podcasts --> <a href="/admin/podcasts"${addAttribute(getLinkClass("podcasts"), "class")}> <span class="material-icons text-[20px]">podcasts</span> <span class="font-medium">Podcasts</span> </a> <!-- Services --> <a href="/admin/services"${addAttribute(getLinkClass("services"), "class")}> <span class="material-icons text-[20px]">business_center</span> <span class="font-medium">Services</span> </a> <hr class="my-4 border-gray-200"> <!-- Topics --> <a href="/admin/topics"${addAttribute(getLinkClass("topics"), "class")}> <span class="material-icons text-[20px]">category</span> <span class="font-medium">Topics</span> </a> <!-- Media --> <a href="/admin/media"${addAttribute(getLinkClass("media"), "class")}> <span class="material-icons text-[20px]">perm_media</span> <span class="font-medium">Media</span> </a> ${profile?.role === "Administrator" && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <hr class="my-4 border-gray-200">  <a href="/admin/users"${addAttribute(getLinkClass("users"), "class")}> <span class="material-icons text-[20px]">people</span> <span class="font-medium">Users</span> </a>  <a href="/admin/settings"${addAttribute(getLinkClass("settings"), "class")}> <span class="material-icons text-[20px]">settings</span> <span class="font-medium">Settings</span> </a> ` })}`} </nav> </aside> <!-- Main Content --> <main class="ml-64 mt-[70px] p-8"> ${renderSlot($$result, $$slots["default"])} </main> </div> </body></html>`;
}, "D:/zveniaproject/src/layouts/AdminLayout.astro", void 0);

export { $$AdminLayout as $ };

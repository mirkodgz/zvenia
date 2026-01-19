import { e as createComponent, f as createAstro, r as renderTemplate, k as renderComponent, l as renderSlot, n as renderHead, h as addAttribute } from './astro/server_DxclfMW8.mjs';
import 'piccolore';
/* empty css                         */
import { $ as $$Header } from './Header_CBLD9VNM.mjs';
import { $ as $$Footer } from './Footer_CXCkbk4v.mjs';
/* empty css                         */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$SocialLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SocialLayout;
  const { title, description = "Zvenia - Community for Mining Professionals" } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-dzqexri3> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"', '><meta name="description"', "><title>", `</title><!-- Fonts: Outfit --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet"><script>
            const theme = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', theme);
        <\/script>`, '</head> <body class="min-h-screen font-sans selection:bg-primary-500 selection:text-white" data-astro-cid-dzqexri3> <!-- Fixed Header --> ', ' <div class="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto" data-astro-cid-dzqexri3> <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 relative" data-astro-cid-dzqexri3> <!-- LEFT COLUMN (Sticky Sidebar) --> <!-- Hidden on mobile, visible on LG screens --> <aside class="hidden lg:block lg:col-span-3 xl:col-span-3 sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar" data-astro-cid-dzqexri3> ', ' </aside> <!-- CENTER COLUMN (Feed) --> <main class="col-span-1 lg:col-span-6 xl:col-span-6 min-h-screen" data-astro-cid-dzqexri3> ', ' </main> <!-- RIGHT COLUMN (Sticky Widgets) --> <aside class="hidden lg:block lg:col-span-3 xl:col-span-3 sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar" data-astro-cid-dzqexri3> ', " </aside> </div> </div> <!-- Footer only on bottom, arguably invisible in infinite scroll, but good to have --> ", " </body></html>"])), addAttribute(Astro2.generator, "content"), addAttribute(description, "content"), title, renderHead(), renderComponent($$result, "Header", $$Header, { "data-astro-cid-dzqexri3": true }), renderSlot($$result, $$slots["left-sidebar"]), renderSlot($$result, $$slots["default"]), renderSlot($$result, $$slots["right-sidebar"]), renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-dzqexri3": true }));
}, "D:/zvenia/astro-frontend/src/layouts/SocialLayout.astro", void 0);

export { $$SocialLayout as $ };

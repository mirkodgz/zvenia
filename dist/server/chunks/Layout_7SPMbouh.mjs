import { e as createComponent, f as createAstro, r as renderTemplate, l as renderSlot, n as renderHead, h as addAttribute } from './astro/server_DxclfMW8.mjs';
import 'piccolore';
import 'clsx';
/* empty css                         */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title, description = "Zvenia - Community for Mining Professionals" } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"', '><meta name="description"', "><title>", `</title><!-- Fonts: Outfit --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet"><script>
            // Theme Initialization
            const theme = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', theme);
        <\/script>`, '</head> <body class="bg-[var(--bg-body)] text-[var(--text-main)] min-h-screen flex flex-col font-sans selection:bg-primary-500 selection:text-white"> ', ' <main class="flex-grow w-full"> ', " </main> ", " </body></html>"])), addAttribute(Astro2.generator, "content"), addAttribute(description, "content"), title, renderHead(), renderSlot($$result, $$slots["header"]), renderSlot($$result, $$slots["default"]), renderSlot($$result, $$slots["footer"]));
}, "D:/zvenia/astro-frontend/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };

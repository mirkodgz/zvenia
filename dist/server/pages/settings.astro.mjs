import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DxclfMW8.mjs';
import 'piccolore';
import { $ as $$SocialLayout } from '../chunks/SocialLayout_CmNf_1R7.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Settings = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Settings;
  const user = Astro2.locals.user;
  if (!user) {
    return Astro2.redirect("/login");
  }
  return renderTemplate`${renderComponent($$result, "SocialLayout", $$SocialLayout, { "title": "Settings" }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", `<div class="max-w-2xl mx-auto py-8"> <h1 class="text-3xl font-bold mb-8">Settings</h1> <!-- Appearance Section --> <div class="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-6 mb-6 transition-colors"> <h2 class="text-xl font-semibold mb-4 flex items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path> </svg>
Appearance
</h2> <div class="flex items-center justify-between"> <div> <p class="font-medium">Theme Preference</p> <p class="text-sm text-[var(--text-secondary)]">Choose how Zvenia looks to you.</p> </div> <div class="flex bg-[var(--bg-body)] rounded-lg p-1 border border-[var(--border-color)]"> <button id="theme-dark" class="px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2"> <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
Dark
</button> <button id="theme-light" class="px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2"> <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
Light
</button> </div> </div> </div> </div>  <script>
        const btnDark = document.getElementById('theme-dark');
        const btnLight = document.getElementById('theme-light');
        const root = document.documentElement;

        // Helper to update UI
        function updateUI(theme) {
            if (theme === 'light') {
                btnLight.classList.add('bg-white', 'text-black', 'shadow-sm');
                btnLight.classList.remove('text-gray-500');
                btnDark.classList.remove('bg-gray-800', 'text-white', 'shadow-sm');
                btnDark.classList.add('text-gray-500');
            } else {
                btnDark.classList.add('bg-gray-800', 'text-white', 'shadow-sm');
                btnDark.classList.remove('text-gray-500');
                btnLight.classList.remove('bg-white', 'text-black', 'shadow-sm');
                btnLight.classList.add('text-gray-500');
            }
            root.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        }

        // Init
        const protectedTheme = localStorage.getItem('theme') || 'dark';
        updateUI(protectedTheme);

        // Events
        btnDark.addEventListener('click', () => updateUI('dark'));
        btnLight.addEventListener('click', () => updateUI('light'));
    <\/script> `])), maybeRenderHead()) })}`;
}, "D:/zvenia/astro-frontend/src/pages/settings.astro", void 0);

const $$file = "D:/zvenia/astro-frontend/src/pages/settings.astro";
const $$url = "/settings";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Settings,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

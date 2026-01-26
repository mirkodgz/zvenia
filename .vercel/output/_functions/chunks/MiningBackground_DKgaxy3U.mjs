import { e as createComponent, m as maybeRenderHead, ak as renderScript, r as renderTemplate } from './astro/server_CNOy-_Bn.mjs';
import 'piccolore';
import 'clsx';

const $$ThemeToggle = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<button id="theme-toggle" type="button" class="fixed top-6 right-6 z-50 p-2.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-all shadow-lg backdrop-blur-sm cursor-pointer" aria-label="Toggle Theme"> <!-- Sun Icon (for Dark Mode -> show Sun to switch to Light) --> <svg class="w-5 h-5 hidden dark:block" id="sun-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path> </svg> <!-- Moon Icon (for Light Mode -> show Moon to switch to Dark) --> <svg class="w-5 h-5 block dark:hidden" id="moon-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path> </svg> </button> ${renderScript($$result, "D:/zveniaproject/src/components/ThemeToggle.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/zveniaproject/src/components/ThemeToggle.astro", void 0);

const $$MiningBackground = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="mining-bg-container" class="absolute inset-0 z-0 overflow-hidden pointer-events-none"> <canvas id="mining-canvas" class="w-full h-full opacity-60 dark:opacity-40"></canvas> </div> ${renderScript($$result, "D:/zveniaproject/src/components/MiningBackground.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/zveniaproject/src/components/MiningBackground.astro", void 0);

export { $$ThemeToggle as $, $$MiningBackground as a };

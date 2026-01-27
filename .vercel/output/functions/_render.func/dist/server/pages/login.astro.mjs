import { e as createComponent, k as renderComponent, n as renderScript, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_0Ysjtq05.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_9oJT8HrB.mjs';
import { $ as $$ThemeToggle, a as $$MiningBackground } from '../chunks/MiningBackground_DC608TxJ.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_CxJDR4Zz.mjs';

const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Zvenia - Iniciar Sesi\xF3n" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-[var(--bg-body)] flex flex-col justify-center lg:grid lg:grid-cols-2 relative overflow-hidden"> ${renderComponent($$result2, "ThemeToggle", $$ThemeToggle, {})} <!-- Animated Mining Background (Global) --> ${renderComponent($$result2, "MiningBackground", $$MiningBackground, {})} <!-- LEFT COLUMN: Branding & Value Prop (Centered content) --> <!-- LEFT COLUMN: Branding & Value Prop (Centered content) --> <div class="hidden lg:flex flex-col justify-center items-end px-16 relative z-10"> <div class="max-w-md text-right"> <!-- Zvenia Logo / Title --> <h1 class="text-6xl font-extrabold tracking-tighter text-primary-500 mb-6 drop-shadow-sm">
zvenia
</h1> <h2 class="text-3xl font-medium text-[var(--text-main)] leading-tight mb-8">
Connect with mining professionals and shape the future of the industry.
</h2> <!-- Abstract Mining Visualization (CSS Animation) --> <div class="relative w-64 h-64 ml-auto opacity-80"> <div class="absolute inset-0 border-2 border-primary-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div> <div class="absolute inset-4 border-2 border-dashed border-primary-400/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div> <div class="absolute inset-16 bg-primary-500/10 rounded-full blur-xl animate-pulse"></div> <!-- Central Icon --> <div class="absolute inset-0 flex items-center justify-center"> <svg class="w-16 h-16 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path> </svg> </div> </div> </div> </div> <!-- RIGHT COLUMN: Login Card (Centered) --> <div class="flex flex-col justify-center items-center lg:items-start px-6 lg:px-16 relative z-10"> <!-- Logo mobile only --> <h1 class="lg:hidden text-5xl font-extrabold tracking-tighter text-primary-500 mb-8 drop-shadow-sm">
zvenia
</h1> <div class="w-full max-w-md bg-[var(--bg-card)] p-8 rounded-xl border border-[var(--border-color)] shadow-2xl backdrop-blur-sm"> <form id="login-form" class="space-y-4" action="/api/auth/signin" method="POST"> <input type="hidden" name="remember" value="true"> <!-- Error Message --> <div id="error-message" class="hidden bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm"> <p id="error-text"></p> </div> <div> <input id="email-address" name="email" type="email" autocomplete="email" required class="block w-full rounded-lg border-0 bg-[var(--bg-surface-hover)] py-3.5 px-4 text-[var(--text-main)] ring-1 ring-inset ring-[var(--border-color)] placeholder:text-[var(--text-secondary)] focus:ring-2 focus:ring-primary-500 text-lg transition-all" placeholder="Email or phone number"> </div> <div> <input id="password" name="password" type="password" autocomplete="current-password" required class="block w-full rounded-lg border-0 bg-[var(--bg-surface-hover)] py-3.5 px-4 text-[var(--text-main)] ring-1 ring-inset ring-[var(--border-color)] placeholder:text-[var(--text-secondary)] focus:ring-2 focus:ring-primary-500 text-lg transition-all" placeholder="Password"> </div> <button type="submit" class="w-full justify-center rounded-lg bg-[#42b72a] px-4 py-3.5 text-lg font-bold text-white hover:bg-[#36a420] focus:outline-none focus:ring-2 focus:ring-[#42b72a] focus:ring-offset-2 transition-all shadow-lg transform active:scale-[0.98]">
Log In
</button> <div class="flex items-center justify-center pt-2"> <a href="/forgot-password" class="text-sm font-medium text-primary-500 hover:text-primary-400 hover:underline">
Forgot password?
</a> </div> <!-- Social Login Mini --> <div class="mt-6 border-t border-[var(--border-color)] pt-6 flex justify-center"> <button id="google-login" type="button" class="flex items-center justify-center w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] transition-colors gap-2 cursor-pointer"> <svg class="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg>
Continue with Google
</button> </div> </form> <div class="mt-6 text-center"> <p class="text-sm text-[var(--text-secondary)]">
Don't have an account? <a href="/join" class="font-bold text-primary-500 hover:text-primary-400 hover:underline">Sign up for Zvenia</a> </p> </div> </div> </div> </div> ` })} ${renderScript($$result, "D:/zveniaproject/src/pages/login.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/zveniaproject/src/pages/login.astro", void 0);

const $$file = "D:/zveniaproject/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

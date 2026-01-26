import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CNOy-_Bn.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_qnXHG_8x.mjs';
export { renderers } from '../renderers.mjs';

const $$VerificationSuccess = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Email Verified | Zvenia" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">  <div class="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none"> <div class="absolute -bottom-1/2 -right-1/4 w-full h-full bg-accent-900/10 blur-[120px] rounded-full"></div> </div> <div class="max-w-md w-full space-y-8 relative z-10 bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-color)] backdrop-blur-sm shadow-2xl text-center"> <div class="flex justify-center mb-6"> <div class="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center"> <svg class="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg> </div> </div> <div> <h2 class="mt-2 text-center text-3xl font-bold tracking-tight text-[var(--text-main)]">
Email Verified!
</h2> <p class="mt-4 text-center text-sm text-[var(--text-secondary)] leading-relaxed">
Your account has been successfully activated. <br>
You are now logged in and ready to access your professional profile.
</p> </div> <div class="mt-8 border-t border-white/10 pt-6"> <a href="/login" class="flex w-full justify-center rounded-md bg-white px-3 py-3 text-sm font-bold text-black hover:bg-gray-200 transition-all shadow-lg">
Log In to Account
</a> </div> </div> </div> ` })}`;
}, "D:/zveniaproject/src/pages/verification-success.astro", void 0);

const $$file = "D:/zveniaproject/src/pages/verification-success.astro";
const $$url = "/verification-success";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$VerificationSuccess,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CNOy-_Bn.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_qnXHG_8x.mjs';
export { renderers } from '../renderers.mjs';

const $$VerifyEmail = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Verify Your Email | Zvenia" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">  <div class="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none"> <div class="absolute -bottom-1/2 -right-1/4 w-full h-full bg-accent-900/10 blur-[120px] rounded-full"></div> </div> <div class="max-w-md w-full space-y-8 relative z-10 bg-neutral-900/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm shadow-2xl text-center"> <div class="flex justify-center mb-6"> <div class="w-16 h-16 bg-primary-900/30 rounded-full flex items-center justify-center"> <svg class="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path> </svg> </div> </div> <div> <h2 class="mt-2 text-center text-3xl font-bold tracking-tight text-white">
Check your inbox!
</h2> <p class="mt-4 text-center text-sm text-gray-400 leading-relaxed">
We've sent a verification link to your email address. <br>
Please click the link to activate your account and access your profile.
</p> </div> <div class="mt-8 border-t border-white/10 pt-6"> <p class="text-xs text-gray-500">
Didn't receive the email? <span class="text-gray-400">Check your spam folder or try logging in to resend.</span> </p> <div class="mt-6"> <a href="/login" class="text-sm font-semibold text-primary-400 hover:text-primary-300 transition-colors">
Return to Login
</a> </div> </div> </div> </div> ` })}`;
}, "D:/zveniaproject/src/pages/verify-email.astro", void 0);

const $$file = "D:/zveniaproject/src/pages/verify-email.astro";
const $$url = "/verify-email";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$VerifyEmail,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

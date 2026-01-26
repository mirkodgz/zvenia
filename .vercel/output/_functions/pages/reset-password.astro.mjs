import { e as createComponent, k as renderComponent, ak as renderScript, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CNOy-_Bn.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_qnXHG_8x.mjs';
export { renderers } from '../renderers.mjs';

const $$ResetPassword = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Set New Password - ZVENIA" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-[var(--bg-body)] flex flex-col justify-center px-6"> <div class="max-w-md mx-auto w-full"> <div class="bg-[var(--bg-card)] p-8 rounded-xl border border-[var(--border-color)] shadow-2xl"> <h1 class="text-2xl font-bold text-[var(--text-main)] mb-2">Set New Password</h1> <p class="text-sm text-[var(--text-secondary)] mb-6">
Enter your new password below.
</p> <form id="reset-form" class="space-y-4"> <div> <label for="password" class="block text-sm font-medium text-[var(--text-main)] mb-2">
New Password
</label> <input id="password" name="password" type="password" autocomplete="new-password" required minlength="6" class="block w-full rounded-lg border-0 bg-[var(--bg-surface-hover)] py-3.5 px-4 text-[var(--text-main)] ring-1 ring-inset ring-[var(--border-color)] placeholder:text-[var(--text-secondary)] focus:ring-2 focus:ring-primary-500 text-lg transition-all" placeholder="Enter new password"> </div> <div> <label for="confirm-password" class="block text-sm font-medium text-[var(--text-main)] mb-2">
Confirm Password
</label> <input id="confirm-password" name="confirm-password" type="password" autocomplete="new-password" required minlength="6" class="block w-full rounded-lg border-0 bg-[var(--bg-surface-hover)] py-3.5 px-4 text-[var(--text-main)] ring-1 ring-inset ring-[var(--border-color)] placeholder:text-[var(--text-secondary)] focus:ring-2 focus:ring-primary-500 text-lg transition-all" placeholder="Confirm new password"> </div> <button type="submit" class="w-full justify-center rounded-lg bg-[#00c44b] px-4 py-3.5 text-lg font-bold text-white hover:bg-[#00a03d] focus:outline-none focus:ring-2 focus:ring-[#00c44b] focus:ring-offset-2 transition-all shadow-lg transform active:scale-[0.98]">
Update Password
</button> <div id="message" class="hidden mt-4 p-4 rounded-lg text-sm"></div> <div class="text-center pt-4"> <a href="/login" class="text-sm font-medium text-primary-500 hover:text-primary-400 hover:underline">
Back to Login
</a> </div> </form> </div> </div> </div> ` })} ${renderScript($$result, "D:/zveniaproject/src/pages/reset-password.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/zveniaproject/src/pages/reset-password.astro", void 0);

const $$file = "D:/zveniaproject/src/pages/reset-password.astro";
const $$url = "/reset-password";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ResetPassword,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

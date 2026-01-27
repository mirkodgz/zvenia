import { e as createComponent, f as createAstro, k as renderComponent, n as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../../chunks/astro/server_0Ysjtq05.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../../chunks/AdminLayout_kIrHDt3T.mjs';
import { R as ROLES } from '../../../chunks/roles_C8ezOKbC.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const $$Create = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Create;
  const user = Astro2.locals.user;
  const profile = Astro2.locals.profile;
  if (!user || !profile || profile.role !== "Administrator") {
    return Astro2.redirect("/");
  }
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Add User", "activePage": "users" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-2xl mx-auto"> <div class="mb-6 flex items-center justify-between"> <h1 class="text-2xl font-bold text-white">Create New User</h1> <a href="/admin/users" class="text-gray-400 hover:text-white transition-colors text-sm">
← Back to Users
</a> </div> <div class="bg-white rounded-lg p-8 shadow-sm"> <form id="create-user-form" class="space-y-6"> <!-- Name --> <div> <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label> <input type="text" id="fullName" name="fullName" required class="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" placeholder="John Doe"> </div> <!-- Email --> <div> <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label> <input type="email" id="email" name="email" required class="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" placeholder="john@example.com"> </div> <!-- Password --> <div> <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label> <input type="password" id="password" name="password" required minlength="6" class="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" placeholder="••••••••"> <p class="text-xs text-gray-500 mt-1">Min. 6 characters</p> </div> <!-- Role --> <div> <label for="role" class="block text-sm font-medium text-gray-700 mb-1">Role</label> <select id="role" name="role" class="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"> ${Object.values(ROLES).map((role) => renderTemplate`<option${addAttribute(role, "value")}>${role}</option>`)} </select> </div> <!-- Submit Button --> <div class="pt-4"> <button type="submit" id="submit-btn" class="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-2.5 px-4 rounded-lg transition-colors flex justify-center items-center">
Create User
</button> <p id="error-msg" class="text-red-600 text-sm mt-3 text-center hidden"></p> </div> </form> </div> </div> ` })} ${renderScript($$result, "D:/zveniaproject/src/pages/admin/users/create.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/zveniaproject/src/pages/admin/users/create.astro", void 0);

const $$file = "D:/zveniaproject/src/pages/admin/users/create.astro";
const $$url = "/admin/users/create";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Create,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

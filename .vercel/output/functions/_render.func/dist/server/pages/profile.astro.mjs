import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_0Ysjtq05.mjs';
import 'piccolore';
import { $ as $$SocialLayout, a as $$LeftSidebar } from '../chunks/LeftSidebar_DEdUkq9E.mjs';
import { $ as $$RightSidebar } from '../chunks/RightSidebar_ChM3M26l.mjs';
export { renderers } from '../renderers.mjs';

const $$Profile = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "SocialLayout", $$SocialLayout, { "title": "Profile - ZVENIA Mining" }, { "default": ($$result2) => renderTemplate`   ${maybeRenderHead()}<div class="h-full flex flex-col gap-6"> <div class="bg-white p-6 rounded-sm border border-gray-200"> <h1 class="text-2xl font-bold text-[var(--text-main)] mb-4">
Profile Page
</h1> <p class="text-[var(--text-secondary)]">
Structure update: Using SocialLayout with fixed sidebars. Stats
                and user details will be re-implemented here.
</p> </div> <!-- Placeholder for Profile Card --> <div class="h-48 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded flex items-center justify-center text-gray-400 font-bold uppercase tracking-wider">
Profile Header Components
</div> </div>  `, "left-sidebar": ($$result2) => renderTemplate`${renderComponent($$result2, "LeftSidebar", $$LeftSidebar, { "slot": "left-sidebar" })}`, "right-sidebar": ($$result2) => renderTemplate`${renderComponent($$result2, "RightSidebar", $$RightSidebar, { "slot": "right-sidebar" })}` })}`;
}, "D:/zveniaproject/src/pages/profile.astro", void 0);

const $$file = "D:/zveniaproject/src/pages/profile.astro";
const $$url = "/profile";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Profile,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

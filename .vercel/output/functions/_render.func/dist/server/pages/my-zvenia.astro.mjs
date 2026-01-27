import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_0Ysjtq05.mjs';
import 'piccolore';
import { $ as $$SocialLayout, a as $$LeftSidebar } from '../chunks/LeftSidebar_DEdUkq9E.mjs';
import { $ as $$RightSidebar } from '../chunks/RightSidebar_DDFO6qYz.mjs';
export { renderers } from '../renderers.mjs';

const $$MyZvenia = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "SocialLayout", $$SocialLayout, { "title": "My Zvenia - ZVENIA Mining" }, { "default": ($$result2) => renderTemplate`   ${maybeRenderHead()}<div class="h-full flex flex-col gap-6"> <div class="bg-white p-6 rounded-sm border border-gray-200"> <h1 class="text-2xl font-bold text-[var(--text-main)] mb-4">
My Zvenia Workspace
</h1> <p class="text-[var(--text-secondary)]">
Welcome to your personal workspace. This area will contain your
                saved posts, drafts, and specific widgets.
</p> </div> <!-- Placeholder for future content blocks --> <div class="h-64 bg-gray-50 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400">
Internal Block Placeholder (Center)
</div> </div>  `, "left-sidebar": ($$result2) => renderTemplate`${renderComponent($$result2, "LeftSidebar", $$LeftSidebar, { "slot": "left-sidebar" })}`, "right-sidebar": ($$result2) => renderTemplate`${renderComponent($$result2, "RightSidebar", $$RightSidebar, { "slot": "right-sidebar" })}` })}`;
}, "D:/zveniaproject/src/pages/my-zvenia.astro", void 0);

const $$file = "D:/zveniaproject/src/pages/my-zvenia.astro";
const $$url = "/my-zvenia";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$MyZvenia,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CNOy-_Bn.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_qnXHG_8x.mjs';
import { $ as $$Header } from '../chunks/Header_B5wuk95l.mjs';
import { $ as $$Footer } from '../chunks/Footer_Coz3Vdx5.mjs';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "404 - P\xE1gina no encontrada | ZVENIA" }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<main class="min-h-screen flex items-center justify-center bg-[#f3f3f3] px-4"> <div class="text-center max-w-md w-full"> <!-- Logo ZVENIA --> <div class="mb-8 flex justify-center"> <a href="/" class="inline-block"> <img src="/zvenia-Logo.svg" alt="ZVENIA Logo" class="h-12 w-auto mx-auto"> </a> </div> <!-- Error 404 --> <h1 class="text-6xl font-bold text-[#0d241b] mb-4">404</h1> <h2 class="text-2xl font-semibold text-[#0d241b] mb-4">
Página no encontrada
</h2> <p class="text-gray-600 mb-8">
Lo sentimos, la página que buscas no existe o ha sido movida.
</p> <!-- Botón para volver al Homepage --> <a href="/" class="inline-block bg-[#0d241b] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#0d241b]/90 transition-colors duration-200">
Volver al Inicio
</a> </div> </main>  `, "footer": ($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer" })}`, "header": ($$result2) => renderTemplate`${renderComponent($$result2, "Header", $$Header, { "slot": "header" })}` })}`;
}, "D:/zveniaproject/src/pages/404.astro", void 0);

const $$file = "D:/zveniaproject/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$404,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

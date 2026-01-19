import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_DxclfMW8.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../../chunks/Layout_7SPMbouh.mjs';
import { S as ServiceForm } from '../../../chunks/ServiceForm_aC2BHNIm.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  if (!id) {
    return Astro2.redirect("/404");
  }
  const user = Astro2.locals.user;
  if (!user) {
    return Astro2.redirect("/login");
  }
  const { data: service, error } = await Astro2.locals.supabase.from("services").select(`
        *,
        topic:topics (
            slug,
            name
        )
    `).eq("id", id).single();
  if (error || !service) {
    console.error("Error fetching service for edit:", error);
    return Astro2.redirect("/404");
  }
  if (service.author_id !== user.id) {
    return Astro2.redirect("/");
  }
  const topicSlug = service.topic?.slug || "";
  const initialData = {
    ...service,
    topic_id: topicSlug,
    // Map fetched topic to the form's expected topic_id (which is a slug)
    description: service.content
    // Map DB 'content' to Form 'description'
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Edit Service: ${service.title}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-8"> <h1 class="text-3xl font-bold text-white mb-8 text-center">Edit Service</h1> ${renderComponent($$result2, "ServiceForm", ServiceForm, { "client:load": true, "currentUser": user, "initialData": initialData, "client:component-hydration": "load", "client:component-path": "D:/zvenia/astro-frontend/src/components/dashboard/forms/ServiceForm", "client:component-export": "default" })} </div> ` })}`;
}, "D:/zvenia/astro-frontend/src/pages/service/edit/[id].astro", void 0);

const $$file = "D:/zvenia/astro-frontend/src/pages/service/edit/[id].astro";
const $$url = "/service/edit/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$id,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../../chunks/astro/server_0Ysjtq05.mjs';
import 'piccolore';
import { $ as $$SocialLayout, a as $$LeftSidebar } from '../../../../chunks/LeftSidebar_DwHsW1bP.mjs';
import { S as ServiceForm } from '../../../../chunks/ServiceForm_pf2IIQJd.mjs';
export { renderers } from '../../../../renderers.mjs';

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
  return renderTemplate`${renderComponent($$result, "SocialLayout", $$SocialLayout, { "title": `Edit Service: ${service.title}`, "hideRightSidebar": true }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="max-w-5xl mx-auto px-4 py-8"> <h1 class="text-2xl font-bold text-[#202124] mb-6">Edit Service</h1> ${renderComponent($$result2, "ServiceForm", ServiceForm, { "client:load": true, "currentUser": user, "initialData": initialData, "client:component-hydration": "load", "client:component-path": "D:/zveniaproject/src/components/dashboard/forms/ServiceForm", "client:component-export": "default" })} </div> `, "left-sidebar": async ($$result2) => renderTemplate`${renderComponent($$result2, "LeftSidebar", $$LeftSidebar, { "slot": "left-sidebar" })}` })}`;
}, "D:/zveniaproject/src/pages/dashboard/services/edit/[id].astro", void 0);

const $$file = "D:/zveniaproject/src/pages/dashboard/services/edit/[id].astro";
const $$url = "/dashboard/services/edit/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$id,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

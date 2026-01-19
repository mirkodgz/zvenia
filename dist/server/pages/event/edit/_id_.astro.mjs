import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_DxclfMW8.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../../chunks/Layout_7SPMbouh.mjs';
import { E as EventForm } from '../../../chunks/EventForm_B0_D9QHP.mjs';
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
  const { data: event, error } = await Astro2.locals.supabase.from("events").select(`
        *,
        topic:topics (
            slug,
            name
        )
    `).eq("id", id).single();
  if (error || !event) {
    console.error("Error fetching event for edit:", error);
    return Astro2.redirect("/404");
  }
  if (event.author_id !== user.id) {
    return Astro2.redirect("/");
  }
  const topicSlug = event.topic?.slug || "";
  const initialData = {
    ...event,
    topic_slug: topicSlug
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Edit Event: ${event.title}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-8"> <h1 class="text-3xl font-bold text-white mb-8 text-center">Edit Event</h1> ${renderComponent($$result2, "EventForm", EventForm, { "client:load": true, "currentUser": user, "initialData": initialData, "client:component-hydration": "load", "client:component-path": "D:/zvenia/astro-frontend/src/components/dashboard/forms/EventForm", "client:component-export": "default" })} </div> ` })}`;
}, "D:/zvenia/astro-frontend/src/pages/event/edit/[id].astro", void 0);

const $$file = "D:/zvenia/astro-frontend/src/pages/event/edit/[id].astro";
const $$url = "/event/edit/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$id,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

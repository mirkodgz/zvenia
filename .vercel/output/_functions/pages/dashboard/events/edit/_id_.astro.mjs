import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../../chunks/astro/server_0Ysjtq05.mjs';
import 'piccolore';
import { $ as $$SocialLayout, a as $$LeftSidebar } from '../../../../chunks/LeftSidebar_DwHsW1bP.mjs';
import { E as EventForm } from '../../../../chunks/EventForm_C1mvzP9r.mjs';
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
  const { data: event, error } = await Astro2.locals.supabase.from("events").select(
    `
        *,
        topic:topics (
            slug,
            name
        )
    `
  ).eq("id", id).single();
  if (error || !event) {
    console.error("Error fetching event for edit:", error);
    return Astro2.redirect("/404");
  }
  const userRole = user.role || "Basic";
  const isModerator = ["Administrator", "CountryManager"].includes(userRole);
  const eventData = event;
  if (eventData.author_id !== user.id && !isModerator) {
    return Astro2.redirect("/");
  }
  const topicSlug = eventData.topic?.slug || "";
  const initialData = {
    ...eventData,
    topic_slug: topicSlug
  };
  return renderTemplate`${renderComponent($$result, "SocialLayout", $$SocialLayout, { "title": `Edit Event: ${eventData.title}`, "hideRightSidebar": true }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="max-w-5xl mx-auto px-4 py-8"> <h1 class="text-2xl font-bold text-dark mb-6">Edit Event</h1> ${renderComponent($$result2, "EventForm", EventForm, { "client:load": true, "currentUser": user, "initialData": initialData, "client:component-hydration": "load", "client:component-path": "D:/zveniaproject/src/components/dashboard/forms/EventForm", "client:component-export": "default" })} </div> `, "left-sidebar": async ($$result2) => renderTemplate`${renderComponent($$result2, "LeftSidebar", $$LeftSidebar, { "slot": "left-sidebar" })}` })}`;
}, "D:/zveniaproject/src/pages/dashboard/events/edit/[id].astro", void 0);

const $$file = "D:/zveniaproject/src/pages/dashboard/events/edit/[id].astro";
const $$url = "/dashboard/events/edit/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$id,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

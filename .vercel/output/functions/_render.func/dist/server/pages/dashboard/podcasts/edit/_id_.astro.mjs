import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../../chunks/astro/server_0Ysjtq05.mjs';
import 'piccolore';
import { $ as $$SocialLayout, a as $$LeftSidebar } from '../../../../chunks/LeftSidebar_PEEkwiet.mjs';
import { P as PodcastForm } from '../../../../chunks/PodcastForm_DqGi5qaW.mjs';
import { c as createSupabaseServerClient } from '../../../../chunks/supabase_DsxxBtwu.mjs';
export { r as renderers } from '../../../../chunks/_@astro-renderers_CxJDR4Zz.mjs';

const $$Astro = createAstro();
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const supabase = createSupabaseServerClient({ req: Astro2.request, cookies: Astro2.cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Astro2.redirect("/login");
  const { data: podcast, error } = await supabase.from("podcasts").select(`
        *,
        podcasts_topics:topic_id (
            slug
        )
    `).eq("id", id).single();
  if (error || !podcast) {
    return Astro2.redirect("/404");
  }
  const { data: userProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const userRole = userProfile?.role || "Basic";
  const isModerator = ["Administrator", "CountryManager"].includes(userRole);
  if (podcast.author_id !== user.id && !isModerator) {
    return Astro2.redirect("/403");
  }
  let topicSlug = "";
  if (podcast.topic_id) {
    const { data: t } = await supabase.from("topics").select("slug").eq("id", podcast.topic_id).single();
    if (t) topicSlug = t.slug;
  }
  const initialData = {
    ...podcast,
    topic_slug: topicSlug
    // Inject slug for form
  };
  return renderTemplate`${renderComponent($$result, "SocialLayout", $$SocialLayout, { "title": `Edit ${podcast.title}`, "hideRightSidebar": true }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="max-w-5xl mx-auto px-4 py-8"> <div class="mb-6"> <h1 class="text-2xl font-bold text-[#202124] mb-2">Edit Podcast</h1> <p class="text-gray-600">Update your show details and episodes.</p> </div> ${renderComponent($$result2, "PodcastForm", PodcastForm, { "client:load": true, "currentUser": user, "initialData": initialData, "client:component-hydration": "load", "client:component-path": "D:/zveniaproject/src/components/dashboard/forms/PodcastForm", "client:component-export": "default" })} </div> `, "left-sidebar": async ($$result2) => renderTemplate`${renderComponent($$result2, "LeftSidebar", $$LeftSidebar, { "slot": "left-sidebar" })}` })}`;
}, "D:/zveniaproject/src/pages/dashboard/podcasts/edit/[id].astro", void 0);

const $$file = "D:/zveniaproject/src/pages/dashboard/podcasts/edit/[id].astro";
const $$url = "/dashboard/podcasts/edit/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$id,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

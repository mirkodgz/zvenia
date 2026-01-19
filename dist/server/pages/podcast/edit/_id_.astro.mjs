import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_DxclfMW8.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../../chunks/Layout_7SPMbouh.mjs';
import { P as PodcastForm } from '../../../chunks/PodcastForm_W7_T3Sme.mjs';
import { c as createSupabaseServerClient } from '../../../chunks/supabase_HTSrsVit.mjs';
export { renderers } from '../../../renderers.mjs';

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
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Edit ${podcast.title}`, "currentUrl": Astro2.url.pathname }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8"> <div class="mb-8"> <a href="/" class="text-sm text-gray-400 hover:text-white mb-4 block">&larr; Back to Dashboard</a> <h1 class="text-3xl font-bold text-white">Edit Podcast</h1> <p class="text-gray-400 mt-2">Update your show details and episodes.</p> </div> ${renderComponent($$result2, "PodcastForm", PodcastForm, { "client:load": true, "currentUser": user, "initialData": initialData, "client:component-hydration": "load", "client:component-path": "D:/zvenia/astro-frontend/src/components/dashboard/forms/PodcastForm", "client:component-export": "default" })} </main> ` })}`;
}, "D:/zvenia/astro-frontend/src/pages/podcast/edit/[id].astro", void 0);

const $$file = "D:/zvenia/astro-frontend/src/pages/podcast/edit/[id].astro";
const $$url = "/podcast/edit/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$id,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

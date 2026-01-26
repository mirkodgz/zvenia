import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_CNOy-_Bn.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../../chunks/AdminLayout_H94Cvfdh.mjs';
import { P as PostFormAdmin } from '../../../chunks/PostFormAdmin_B_D6FzoU.mjs';
import { c as createSupabaseServerClient } from '../../../chunks/supabase_HTSrsVit.mjs';
import { i as isAdministrator } from '../../../chunks/roles_DL-H1sB4.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const $$Create = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Create;
  const user = Astro2.locals.user;
  const profile = Astro2.locals.profile;
  const userRole = profile?.role || user?.role || "Basic";
  if (!user || !isAdministrator(userRole)) {
    return Astro2.redirect("/");
  }
  const supabase = createSupabaseServerClient({ req: Astro2.request, cookies: Astro2.cookies });
  const { data: topics } = await supabase.from("topics").select("id, name, slug").order("name");
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Create Post", "activePage": "posts" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-6"> <h1 class="text-2xl font-bold text-white tracking-tight">Create New Post</h1> <p class="text-gray-400 text-sm mt-1">Add a new post to the platform.</p> </div>  ${renderComponent($$result2, "PostFormAdmin", PostFormAdmin, { "client:load": true, "currentUser": user, "topics": topics || [], "client:component-hydration": "load", "client:component-path": "D:/zveniaproject/src/components/admin/forms/PostFormAdmin", "client:component-export": "default" })} ` })}`;
}, "D:/zveniaproject/src/pages/admin/posts/create.astro", void 0);

const $$file = "D:/zveniaproject/src/pages/admin/posts/create.astro";
const $$url = "/admin/posts/create";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Create,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

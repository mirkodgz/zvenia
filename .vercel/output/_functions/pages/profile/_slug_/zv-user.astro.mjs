import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../../chunks/astro/server_0Ysjtq05.mjs';
import 'piccolore';
import { $ as $$SocialLayout, a as $$LeftSidebar } from '../../../chunks/LeftSidebar_DEdUkq9E.mjs';
import { c as createSupabaseServerClient } from '../../../chunks/supabase_DZBRYQhj.mjs';
import { $ as $$RightSidebar } from '../../../chunks/RightSidebar_ChM3M26l.mjs';
import { n as normalizeProfileSlug } from '../../../chunks/utils_C0eazIxq.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const $$ZvUser = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ZvUser;
  const { slug } = Astro2.params;
  if (!slug) {
    return Astro2.redirect("/");
  }
  const normalizedSlug = normalizeProfileSlug(slug);
  const supabase = createSupabaseServerClient({ req: Astro2.request, cookies: Astro2.cookies });
  const { data: profile, error } = await supabase.from("profiles").select("*").eq("profile_slug", normalizedSlug).single();
  if (error || !profile) {
    return Astro2.redirect("/");
  }
  const metadata = profile.metadata || {};
  const othersLanguages = Array.isArray(metadata.others_languages) ? metadata.others_languages : [];
  const othersAreas = Array.isArray(metadata.others_areas_of_expertise) ? metadata.others_areas_of_expertise : [];
  const privacy = metadata.privacy || {};
  const isFieldVisible = (field, defaultValue = true) => {
    if (privacy[field] === void 0) return defaultValue;
    return privacy[field] === true;
  };
  let nationalityName = profile.nationality || null;
  let workCountryName = profile.work_country || null;
  let mainLanguageName = profile.main_language || null;
  let mainAreaName = profile.main_area_of_expertise || null;
  if (profile.nationality && !isNaN(Number(profile.nationality))) {
    const { data: country } = await supabase.from("countries").select("display_name").eq("id", parseInt(profile.nationality)).single();
    nationalityName = country?.display_name || profile.nationality;
  }
  if (profile.work_country && !isNaN(Number(profile.work_country))) {
    const { data: country } = await supabase.from("countries").select("display_name").eq("id", parseInt(profile.work_country)).single();
    workCountryName = country?.display_name || profile.work_country;
  }
  if (profile.main_language && !isNaN(Number(profile.main_language))) {
    const { data: language } = await supabase.from("languages").select("display_name").eq("id", parseInt(profile.main_language)).single();
    mainLanguageName = language?.display_name || profile.main_language;
  }
  if (profile.main_area_of_expertise && !isNaN(Number(profile.main_area_of_expertise))) {
    const { data: topic } = await supabase.from("topics").select("name").eq("id", parseInt(profile.main_area_of_expertise)).single();
    if (topic) {
      mainAreaName = topic.name;
    } else {
      const { data: miningTopic } = await supabase.from("mining_topics").select("display_name").eq("id", parseInt(profile.main_area_of_expertise)).single();
      mainAreaName = miningTopic?.display_name || profile.main_area_of_expertise;
    }
  }
  if (othersAreas.length > 0) {
    const areaIds = othersAreas.map((a) => {
      const num = parseInt(String(a));
      return isNaN(num) ? null : num;
    }).filter((id) => id !== null);
    if (areaIds.length > 0) {
      const { data: topics } = await supabase.from("topics").select("name").in("id", areaIds);
      if (topics && topics.length > 0) {
        topics.map((t) => t.name);
      } else {
        const { data: miningTopics } = await supabase.from("mining_topics").select("display_name").in("id", areaIds);
        if (miningTopics) {
          miningTopics.map((t) => t.display_name);
        }
      }
    }
  }
  if (othersLanguages.length > 0) {
    const langIds = othersLanguages.map((l) => {
      const num = parseInt(String(l));
      return isNaN(num) ? null : num;
    }).filter((id) => id !== null);
    if (langIds.length > 0) {
      const { data: languages } = await supabase.from("languages").select("display_name").in("id", langIds);
      if (languages) {
        languages.map((l) => l.display_name);
      }
    }
  }
  const currentUser = Astro2.locals.user;
  const isOwnProfile = currentUser?.id === profile.id;
  return renderTemplate`${renderComponent($$result, "SocialLayout", $$SocialLayout, { "title": `${profile.full_name || profile.email} - Public Profile` }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="max-w-4xl mx-auto space-y-6"> <!-- Card 1: Personal Details --> <div class="bg-white rounded-sm border border-gray-200 overflow-hidden" style="box-shadow: 1px 2px 2px 2px #22232633;"> <!-- Banner con imagen de fondo --> <div class="h-48 relative" style="background-image: url('https://res.cloudinary.com/dun3slcfg/images/v1691587336/cloud-files/Background-Default-/Background-Default-.jpg'); background-position: right center; background-size: 200% auto; background-repeat: no-repeat;"> <div class="absolute top-4 right-4"> <img src="/zvenia-Logo.svg" alt="ZVENIA" class="h-16 opacity-30"> </div> </div> <!-- Profile Header --> <div class="px-6 pb-6 relative"> <!-- Avatar superpuesto al banner --> <div class="absolute -top-20 left-6"> <div class="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden shadow-lg"> ${profile.avatar_url ? renderTemplate`<img${addAttribute(profile.avatar_url, "src")}${addAttribute(profile.full_name || "User", "alt")} class="w-full h-full object-cover">` : renderTemplate`<span class="text-4xl font-bold text-gray-400"> ${(profile.full_name || profile.email || "U")[0].toUpperCase()} </span>`} </div> </div> <!-- Name and Badge --> <div class="pt-20"> <div class="flex items-center gap-3 mb-3"> <h1 class="text-2xl font-bold text-[#202124]"> ${profile.full_name || profile.email} </h1> ${(profile.role === "Expert" || profile.role === "CountryManager" || profile.role === "Administrator") && renderTemplate`<span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1"> <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg>
Verified user
</span>`} </div> <!-- Bio/Summary --> ${profile.headline_user && renderTemplate`<p class="text-[#202124] mb-4" style="font-size: 15px; font-weight: 400; line-height: 1.5;"> ${profile.headline_user} </p>`} <!-- Contact Information --> <div class="border-t border-gray-200 pt-4 mt-4"> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <span class="text-xs uppercase block mb-1 font-bold" style="color: #0d241b;">E-mail</span> <p class="text-[#202124]" style="font-size: 15px;">${profile.email}</p> </div> ${profile.phone_number && isFieldVisible("phone_number", false) && renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold" style="color: #0d241b;">Phone number</span> <p class="text-[#202124]" style="font-size: 15px;">${profile.phone_number}</p> </div>`} </div> ${nationalityName && isFieldVisible("nationality", true) && renderTemplate`<div class="mt-4"> <span class="text-xs uppercase block mb-1 font-bold" style="color: #0d241b;">Nationality</span> <p class="text-[#202124]" style="font-size: 15px;">${nationalityName}</p> </div>`} </div> </div> </div> </div> <!-- Card 2: Professional Info --> <div class="bg-white rounded-sm border border-gray-200 overflow-hidden" style="box-shadow: 1px 2px 2px 2px #22232633;"> <div class="p-6"> <h2 class="text-lg font-bold text-[#202124] mb-6">Professional info</h2> <div class="space-y-4"> ${workCountryName && isFieldVisible("work_country", true) && renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold" style="color: #0d241b;">Work country</span> <p class="text-[#202124]" style="font-size: 15px;">${workCountryName}</p> </div>`} ${profile.profession && isFieldVisible("profession", true) && renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold" style="color: #0d241b;">Profession</span> <p class="text-[#202124]" style="font-size: 15px;">${profile.profession}</p> </div>`} ${profile.company && isFieldVisible("company", true) && renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold" style="color: #0d241b;">Current company</span> <p class="text-[#202124]" style="font-size: 15px;">${profile.company}</p> </div>`} ${profile.position && isFieldVisible("position", true) && renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold" style="color: #0d241b;">Current position</span> <p class="text-[#202124]" style="font-size: 15px;">${profile.position}</p> </div>`} ${profile.linkedin_url && isFieldVisible("linkedin_url", true) && renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold" style="color: #0d241b;">Linkedin URL</span> <a${addAttribute(profile.linkedin_url.startsWith("http") ? profile.linkedin_url : `https://${profile.linkedin_url}`, "href")} target="_blank" rel="noopener noreferrer" class="text-[#00c44b] hover:underline break-all" style="font-size: 15px;"> ${profile.linkedin_url} </a> </div>`} ${mainLanguageName && isFieldVisible("main_language", true) && renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold" style="color: #0d241b;">Main language</span> <p class="text-[#202124]" style="font-size: 15px;">${mainLanguageName}</p> </div>`} ${mainAreaName && isFieldVisible("main_area_of_expertise", true) && renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold" style="color: #0d241b;">Main area of expertise</span> <p class="text-[#202124]" style="font-size: 15px;">${mainAreaName}</p> </div>`} </div> </div> </div> <!-- Edit Profile Link (solo si es el propio perfil) --> ${isOwnProfile && renderTemplate`<div class="bg-white rounded-sm border border-gray-200 p-6" style="box-shadow: 1px 2px 2px 2px #22232633;"> <a href="/dashboard/profile/edit" class="inline-flex items-center gap-2 px-4 py-2 bg-[#00c44b] text-white rounded-lg hover:bg-[#00a33f] transition-colors"> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path> </svg>
Edit Profile
</a> </div>`} </div>  `, "left-sidebar": async ($$result2) => renderTemplate`${renderComponent($$result2, "LeftSidebar", $$LeftSidebar, { "slot": "left-sidebar" })}`, "right-sidebar": async ($$result2) => renderTemplate`${renderComponent($$result2, "RightSidebar", $$RightSidebar, { "slot": "right-sidebar" })}` })}`;
}, "D:/zveniaproject/src/pages/profile/[slug]/zv-user.astro", void 0);

const $$file = "D:/zveniaproject/src/pages/profile/[slug]/zv-user.astro";
const $$url = "/profile/[slug]/zv-user";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$ZvUser,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

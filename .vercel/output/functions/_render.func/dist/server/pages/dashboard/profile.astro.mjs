import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_0Ysjtq05.mjs';
import 'piccolore';
import { $ as $$SocialLayout, a as $$LeftSidebar } from '../../chunks/LeftSidebar_PEEkwiet.mjs';
import { c as createSupabaseServerClient } from '../../chunks/supabase_DsxxBtwu.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_CxJDR4Zz.mjs';

const $$Astro = createAstro();
const $$Profile = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Profile;
  let user = Astro2.locals.user;
  if (!user) {
    const supabaseUrl = "https://ddgdtdhgaqeqnoigmfrh.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZ2R0ZGhnYXFlcW5vaWdtZnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNDE3NjMsImV4cCI6MjA4MjYxNzc2M30.aSW3Ds1z-8ta1sx-22P3NGyx4jzaY0aGNPPB9PsFcs0";
    const { createServerClient } = await import('@supabase/ssr');
    const supabaseAuth = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        get(key) {
          return Astro2.cookies.get(key)?.value;
        },
        set(key, value, options) {
          Astro2.cookies.set(key, value, options);
        },
        remove(key, options) {
          Astro2.cookies.delete(key, options);
        }
      }
    });
    const { data: { user: authUser }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !authUser) {
      console.error("[user-area] User not authenticated:", authError?.message);
      console.error("[user-area] Available cookies:", Object.keys(Astro2.cookies.getAll()));
      return Astro2.redirect("/login");
    }
    console.log("[user-area] User found via direct Supabase call:", authUser.email);
    user = authUser;
  } else {
    console.log("[user-area] User found in locals:", user.email);
  }
  const supabase = createSupabaseServerClient({ req: Astro2.request, cookies: Astro2.cookies });
  console.log("[user-area] Fetching profile for user:", user.id);
  const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (profileError) {
    console.error("[user-area] Profile error:", profileError.message);
  }
  if (profileError || !profile) {
    console.error("[user-area] Profile not found, redirecting to login");
    return Astro2.redirect("/login");
  }
  console.log("[user-area] Profile found:", profile.email || profile.full_name);
  const metadata = profile.metadata || {};
  const othersLanguages = Array.isArray(metadata.others_languages) ? metadata.others_languages : [];
  const othersAreas = Array.isArray(metadata.others_areas_of_expertise) ? metadata.others_areas_of_expertise : [];
  let nationalityName = profile.nationality || null;
  let workCountryName = profile.work_country || null;
  let mainLanguageName = profile.main_language || null;
  let mainAreaName = profile.main_area_of_expertise || null;
  let othersAreasNames = [];
  let othersLanguagesNames = [];
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
        othersAreasNames = topics.map((t) => t.name);
      } else {
        const { data: miningTopics } = await supabase.from("mining_topics").select("display_name").in("id", areaIds);
        if (miningTopics) {
          othersAreasNames = miningTopics.map((t) => t.display_name);
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
        othersLanguagesNames = languages.map((l) => l.display_name);
      }
    }
  }
  return renderTemplate`${renderComponent($$result, "SocialLayout", $$SocialLayout, { "title": "My ZVENIA - User Area", "hideRightSidebar": true }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="w-full px-4 sm:px-6"> <div class="max-w-4xl mx-auto"> <!-- Header --> <div class="bg-white rounded-sm border border-[var(--border-color)] p-6 mb-6" style="box-shadow: 1px 2px 2px 2px #22232633;"> <div class="flex items-start justify-between gap-4"> <div class="flex-1"> <h1 class="text-3xl font-bold text-[#202124] mb-2">
Hi, ${profile.first_name && profile.last_name ? `${profile.first_name} ${profile.last_name}` : profile.full_name || profile.email} </h1> <p class="text-[#202124]" style="font-size: 15px; font-weight: 400;">Private Profile</p> <p class="text-sm text-[#202124] mt-4" style="font-size: 15px; font-weight: 400;">
Please take a moment to complete your profile information. Your participation enriches our community.
<a href="/dashboard/profile/edit" class="text-[#00c44b] hover:underline font-medium">Edit Profile</a> </p> </div> ${(profile.role === "Administrator" || profile.role === "CountryManager") && renderTemplate`<div class="flex-shrink-0"> <a href="/admin" class="inline-flex items-center gap-2 px-4 py-2 bg-[#0d241b] text-white rounded-sm hover:bg-[#0d241b]/90 transition-colors font-medium text-sm" style="font-size: 14px; font-weight: 600;"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path> </svg>
Admin Dashboard
</a> </div>`} </div> </div> <!-- Profile Card --> <div class="bg-white rounded-sm border border-[var(--border-color)] overflow-hidden" style="box-shadow: 1px 2px 2px 2px #22232633;"> <!-- Banner with Robotic Hand Background --> <div class="h-40 relative bg-cover bg-no-repeat"${addAttribute(`background-image: url('https://res.cloudinary.com/dun3slcfg/images/v1691587336/cloud-files/Background-Default-/Background-Default-.jpg'); background-position: right center; background-size: 200% auto;`, "style")}> <div class="absolute top-4 right-4"> <img src="/zvenia-Logo.svg" alt="ZVENIA" class="h-16 opacity-20"> </div> </div> <!-- Profile Content --> <div class="px-6 pb-6 relative"> <!-- Avatar superpuesto al banner --> <div class="absolute -top-20 left-6"> <div class="w-32 h-32 rounded-full border-4 border-white bg-[#00c44b] flex items-center justify-center overflow-hidden shadow-lg"> ${profile.avatar_url ? renderTemplate`<img${addAttribute(profile.avatar_url, "src")}${addAttribute(profile.full_name || "User", "alt")} class="w-full h-full object-cover">` : renderTemplate`<img src="https://res.cloudinary.com/dun3slcfg/image/upload/v1767656237/migrated_profiles_v2/mirkodgzbusiness_gmail_com_avatar.jpg"${addAttribute(profile.full_name || "User", "alt")} class="w-full h-full object-cover">`} </div> </div> <!-- Name and Badge --> <div class="pt-20"> <div class="flex items-center gap-3 mb-3 flex-wrap"> <h1 class="text-2xl font-bold text-[#202124]"> ${profile.first_name && profile.last_name ? `${profile.first_name} ${profile.last_name}` : profile.full_name || profile.email} </h1> ${(profile.role === "Expert" || profile.role === "Administrator") && renderTemplate`<span class="px-3 py-1 bg-[#00c44b] text-white rounded-full text-xs font-bold flex items-center gap-1"> <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg>
Verified user
</span>`} </div> ${profile.headline_user && renderTemplate`<p class="text-[#202124] mb-2" style="font-size: 15px; font-weight: 400;">${profile.headline_user}</p>`} ${profile.role && renderTemplate`<p class="text-sm text-[#202124] uppercase tracking-wide mb-4" style="font-size: 12px; font-weight: 500;">${profile.role}</p>`} </div> <!-- Contact Information --> <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"> <div> <h3 class="text-sm font-semibold text-[#202124] uppercase tracking-wide mb-4" style="font-size: 14px; font-weight: 600;">Contact Information</h3> <div class="space-y-3"> <div> <span class="text-xs uppercase block mb-1 font-bold" style="color: #0d241b;">E-mail</span> <p class="text-[#202124]" style="font-size: 15px; font-weight: 400;">${profile.email}</p> </div> ${profile.phone_number && renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold" style="color: #0d241b;">Phone number</span> <p class="text-[#202124]" style="font-size: 15px; font-weight: 400;">${profile.phone_number}</p> </div>`} ${nationalityName && renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold" style="color: #0d241b;">Nationality</span> <p class="text-[#202124]" style="font-size: 15px; font-weight: 400;">${nationalityName}</p> </div>`} </div> </div> <div> <h3 class="text-sm font-semibold text-[#202124] uppercase tracking-wide mb-4" style="font-size: 14px; font-weight: 600;">Professional Information</h3> <div class="space-y-3"> ${workCountryName && renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold" style="color: #0d241b;">Work country</span> <p class="text-[#202124]" style="font-size: 15px; font-weight: 400;">${workCountryName}</p> </div>`} ${profile.profession && renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold" style="color: #0d241b;">Profession</span> <p class="text-[#202124]" style="font-size: 15px; font-weight: 400;">${profile.profession}</p> </div>`} ${profile.company && renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold" style="color: #0d241b;">Current company</span> <p class="text-[#202124]" style="font-size: 15px; font-weight: 400;">${profile.company}</p> </div>`} ${profile.position && renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold" style="color: #0d241b;">Current position</span> <p class="text-[#202124]" style="font-size: 15px; font-weight: 400;">${profile.position}</p> </div>`} ${profile.linkedin_url && renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold" style="color: #0d241b;">Linkedin URL</span> <a${addAttribute(profile.linkedin_url.startsWith("http") ? profile.linkedin_url : `https://${profile.linkedin_url}`, "href")} target="_blank" rel="noopener noreferrer" class="text-[#00c44b] hover:underline break-all" style="font-size: 15px; font-weight: 400;"> ${profile.linkedin_url} </a> </div>`} </div> </div> </div> <!-- Language & Expertise --> <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"> <div> <h3 class="text-sm font-semibold text-[#202124] uppercase tracking-wide mb-4" style="font-size: 14px; font-weight: 600;">Language</h3> <div class="space-y-3"> ${mainLanguageName && renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold" style="color: #0d241b;">Main language</span> <p class="text-[#202124]" style="font-size: 15px; font-weight: 400;">${mainLanguageName}</p> </div>`} ${othersLanguagesNames.length > 0 ? renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold" style="color: #0d241b;">Others languages</span> <p class="text-[#202124]" style="font-size: 15px; font-weight: 400;">${othersLanguagesNames.join(", ")}</p> </div>` : renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold" style="color: #0d241b;">Others languages</span> <p class="text-gray-400 italic">Not provided</p> </div>`} </div> </div> <div> <h3 class="text-sm font-semibold text-[#202124] uppercase tracking-wide mb-4" style="font-size: 14px; font-weight: 600;">Expertise</h3> <div class="space-y-3"> ${mainAreaName && renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold" style="color: #0d241b;">Main area of expertise</span> <p class="text-[#202124]" style="font-size: 15px; font-weight: 400;">${mainAreaName}</p> </div>`} ${othersAreasNames.length > 0 ? renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold" style="color: #0d241b;">Others areas of expertise</span> <div class="flex flex-wrap gap-2 mt-2"> ${othersAreasNames.map((area) => renderTemplate`<span class="px-3 py-1 bg-[#e0e0e0] text-[#202124] rounded-full text-sm" style="font-size: 12px; font-weight: 500;"> ${area} </span>`)} </div> </div>` : renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold" style="color: #0d241b;">Others areas of expertise</span> <p class="text-gray-400 italic">Not provided</p> </div>`} </div> </div> </div> <!-- Z-PROMOTER & Z-ADS Sections (si aplica) --> ${(metadata.z_promoter || metadata.z_ads) && renderTemplate`<div class="mt-8 space-y-4"> ${metadata.z_promoter && renderTemplate`<details class="bg-[#f3f3f3] rounded-sm p-4" style="border-radius: var(--radius-s);"> <summary class="font-semibold text-[#202124] cursor-pointer" style="font-size: 15px; font-weight: 600;">
Z-PROMOTER (for potential promoters)
</summary> <div class="mt-4 space-y-3 text-sm text-[#202124]" style="font-size: 15px; font-weight: 400;"> ${metadata.z_promoter.why && renderTemplate`<div> <span class="font-medium">Why do you want to be a ZVENIA Promoter?</span> <p class="mt-1">${metadata.z_promoter.why}</p> </div>`} ${metadata.z_promoter.contribute && renderTemplate`<div> <span class="font-medium">How can you contribute to ZVENIA's growth?</span> <p class="mt-1">${metadata.z_promoter.contribute}</p> </div>`} </div> </details>`} ${metadata.z_ads && renderTemplate`<details class="bg-[#f3f3f3] rounded-sm p-4" style="border-radius: var(--radius-s);"> <summary class="font-semibold text-[#202124] cursor-pointer" style="font-size: 15px; font-weight: 600;">
Z-ADS (for potential advertisers)
</summary> <div class="mt-4 text-sm text-[#202124]" style="font-size: 15px; font-weight: 400;">  </div> </details>`} </div>`} <!-- Profile Completion Reminder --> <div class="mt-8 pt-6 border-t border-[var(--border-color)]"> <p class="text-sm text-[#202124]" style="font-size: 15px; font-weight: 400;">
Please ensure your profile is complete in the <a href="/dashboard/profile/edit" class="text-[#00c44b] hover:underline font-medium">Edit Profile</a>.
</p> </div> </div> </div> </div> </div> `, "left-sidebar": async ($$result2) => renderTemplate`${renderComponent($$result2, "LeftSidebar", $$LeftSidebar, { "slot": "left-sidebar" })}` })}`;
}, "D:/zveniaproject/src/pages/dashboard/profile.astro", void 0);
const $$file = "D:/zveniaproject/src/pages/dashboard/profile.astro";
const $$url = "/dashboard/profile";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Profile,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

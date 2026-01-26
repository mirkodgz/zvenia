import { e as createComponent, f as createAstro, k as renderComponent, n as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_0Ysjtq05.mjs';
import 'piccolore';
import { $ as $$SocialLayout, a as $$LeftSidebar } from '../../chunks/LeftSidebar_DEdUkq9E.mjs';
import { c as createSupabaseServerClient } from '../../chunks/supabase_DZBRYQhj.mjs';
import { $ as $$RightSidebar } from '../../chunks/RightSidebar_ChM3M26l.mjs';
import { n as normalizeProfileSlug } from '../../chunks/utils_C0eazIxq.mjs';
import { $ as $$PostCard } from '../../chunks/PostCard_CkbnP1Ya.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import 'react';
import { P as PodcastOptions, E as EventCard, S as ServiceCard } from '../../chunks/ServiceCard_wi3Dro0O.mjs';
export { renderers } from '../../renderers.mjs';

const PodcastCard = ({ podcast, currentUser }) => {
  const eps = Array.isArray(podcast.episodes) ? podcast.episodes : [];
  const episodeCount = eps.length;
  const latestEpisode = episodeCount > 0 ? eps[eps.length - 1] : null;
  return /* @__PURE__ */ jsxs("div", { className: "bg-[#1A1A1A] rounded-lg border border-white/10 overflow-hidden hover:border-primary-500/30 transition-all group flex flex-col h-full relative", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-3 right-3 z-30", children: /* @__PURE__ */ jsx(PodcastOptions, { podcastId: podcast.id, authorId: podcast.author_id, currentUserId: currentUser?.id }) }),
    /* @__PURE__ */ jsxs("div", { className: "relative h-48 w-full bg-black border-b border-white/5 overflow-hidden", children: [
      podcast.cover_image_url ? /* @__PURE__ */ jsx(
        "img",
        {
          src: podcast.cover_image_url,
          alt: podcast.title,
          className: "w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        }
      ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center bg-neutral-900", children: /* @__PURE__ */ jsx("span", { className: "text-4xl", children: "🎙️" }) }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-3 left-3 bg-purple-600/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg border border-white/20", children: "Podcast" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col flex-grow", children: [
      podcast.host && /* @__PURE__ */ jsxs("div", { className: "text-purple-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1", children: [
        /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" }) }),
        "HOST: ",
        podcast.host
      ] }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-purple-400 transition-colors", children: podcast.title }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxs("span", { className: "bg-white/5 px-2 py-1 rounded text-xs text-gray-400 border border-white/5", children: [
          episodeCount,
          " Episodes"
        ] }),
        latestEpisode && /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500 line-clamp-1 italic", children: [
          "Latest: ",
          latestEpisode.title
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-grow" }),
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: `/podcast/${podcast.slug}`,
          className: "mt-4 w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-md text-sm font-bold text-center text-white transition-all flex items-center justify-center gap-2 group-hover:bg-purple-600/20",
          children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M8 5v14l11-7z" }) }),
            "Listen Now"
          ]
        }
      )
    ] })
  ] });
};

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const { slug } = Astro2.params;
  if (!slug) {
    return Astro2.redirect("/");
  }
  const normalizedSlug = normalizeProfileSlug(slug);
  const supabase = createSupabaseServerClient({
    req: Astro2.request,
    cookies: Astro2.cookies
  });
  const { data: profileData, error } = await supabase.from("profiles").select("*").eq("profile_slug", normalizedSlug).single();
  const profile = profileData;
  if (error || !profile) {
    return Astro2.redirect("/");
  }
  const { data: posts } = await supabase.from("posts").select("*, author:profiles(*), topic:topics(*)").eq("author_id", profile.id).order("created_at", { ascending: false });
  const { data: podcasts } = await supabase.from("podcasts").select("*").eq("author_id", profile.id).order("created_at", { ascending: false });
  const { data: events } = await supabase.from("events").select("*").eq("organizer_id", profile.id).order("start_date", { ascending: false });
  const { data: services } = await supabase.from("services").select("*").eq("provider_id", profile.id).order("created_at", { ascending: false });
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
    const { data } = await supabase.from("countries").select("display_name").eq("id", parseInt(profile.nationality)).single();
    const countryData = data;
    if (countryData) nationalityName = countryData.display_name;
  }
  if (profile.work_country && !isNaN(Number(profile.work_country))) {
    const { data } = await supabase.from("countries").select("display_name").eq("id", parseInt(profile.work_country)).single();
    const workCountryData = data;
    if (workCountryData) workCountryName = workCountryData.display_name;
  }
  if (profile.main_language && !isNaN(Number(profile.main_language))) {
    const { data } = await supabase.from("languages").select("display_name").eq("id", parseInt(profile.main_language)).single();
    const langData = data;
    if (langData) mainLanguageName = langData.display_name;
  }
  if (profile.main_area_of_expertise && !isNaN(Number(profile.main_area_of_expertise))) {
    const { data: topic } = await supabase.from("topics").select("name").eq("id", parseInt(profile.main_area_of_expertise)).single();
    const topicData = topic;
    if (topicData) mainAreaName = topicData.name;
    else {
      const { data: miningTopic } = await supabase.from("mining_topics").select("display_name").eq("id", parseInt(profile.main_area_of_expertise)).single();
      const miningTopicData = miningTopic;
      if (miningTopicData) mainAreaName = miningTopicData.display_name;
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
          miningTopics.map(
            (t) => t.display_name
          );
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
        languages.map(
          (l) => l.display_name
        );
      }
    }
  }
  const currentUser = Astro2.locals.user;
  const isOwnProfile = currentUser?.id === profile.id;
  return renderTemplate`${renderComponent($$result, "SocialLayout", $$SocialLayout, { "title": `${profile.full_name || profile.email} - Public Profile` }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="max-w-4xl mx-auto space-y-6"> <div class="bg-white rounded-sm border border-gray-200 overflow-hidden shadow-[1px_2px_2px_2px_#22232633]"> <!-- Banner --> <div class="h-48 relative" style="background-image: url('https://res.cloudinary.com/dun3slcfg/images/v1691587336/cloud-files/Background-Default-/Background-Default-.jpg'); background-position: right center; background-size: 200% auto; background-repeat: no-repeat;"> <div class="absolute top-4 right-4"> <img src="/zvenia-Logo.svg" alt="ZVENIA" class="h-16 opacity-30"> </div> </div> <div class="px-6 pb-6 relative"> <!-- Avatar --> <div class="absolute -top-20 left-6"> <div class="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden shadow-lg"> ${profile.avatar_url ? renderTemplate`<img${addAttribute(profile.avatar_url, "src")}${addAttribute(profile.full_name || "User", "alt")} class="w-full h-full object-cover">` : renderTemplate`<span class="text-4xl font-bold text-gray-400"> ${(profile.full_name || profile.email || "U")[0].toUpperCase()} </span>`} </div> </div> <!-- Header Actions --> <div class="flex justify-end pt-4 min-h-[60px]"> ${isOwnProfile && renderTemplate`<a href="/dashboard/profile/edit" class="inline-flex items-center gap-2 px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-[#00a33f] transition-colors font-medium text-sm"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path> </svg>
Edit Profile
</a>`} </div> <!-- Basic Info --> <div class="mt-2 mb-6"> <div class="flex items-center gap-3 mb-2"> <h1 class="text-2xl font-bold text-dark"> ${profile.full_name || profile.email} </h1> ${(profile.role === "Expert" || profile.role === "CountryManager" || profile.role === "Administrator") && renderTemplate`<span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1"> <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg>
Verified user
</span>`} </div> ${profile.headline_user && renderTemplate`<p class="text-dark mb-2 text-[15px] font-normal leading-relaxed"> ${profile.headline_user} </p>`} <div class="text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1"> ${workCountryName && renderTemplate`<span>${workCountryName}</span>`} ${workCountryName && (profile.company || profile.position) && renderTemplate`<span>•</span>`} ${profile.position && renderTemplate`<span>${profile.position}</span>`} ${profile.position && profile.company && renderTemplate`<span>at</span>`} ${profile.company && renderTemplate`<span>${profile.company}</span>`} </div> </div> <!-- Tabs Navigation --> <div class="border-b border-gray-200 mb-6"> <nav class="-mb-px flex space-x-8" aria-label="Tabs" id="profile-tabs"> <button data-tab="overview" class="tab-btn whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors border-accent-500 text-accent-500">
Overview
</button> <button data-tab="posts" class="tab-btn whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
Posts <span class="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">${posts?.length || 0}</span> </button> <button data-tab="podcasts" class="tab-btn whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
Podcasts <span class="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">${podcasts?.length || 0}</span> </button> <button data-tab="events" class="tab-btn whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
Events <span class="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">${events?.length || 0}</span> </button> <button data-tab="services" class="tab-btn whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
Services <span class="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">${services?.length || 0}</span> </button> </nav> </div> <!-- Tab Contents --> <div id="tab-contents"> <!-- Overview Tab --> <div id="overview" class="tab-content animate-in fade-in duration-300"> <!-- Contact Info --> <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"> <div> <span class="text-xs uppercase block mb-1 font-bold text-primary-500">E-mail</span> <p class="text-dark text-[15px]"> ${profile.email} </p> </div> ${profile.phone_number && isFieldVisible("phone_number", false) && renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold text-primary-500">
Phone number
</span> <p class="text-dark text-[15px]"> ${profile.phone_number} </p> </div>`} ${nationalityName && isFieldVisible("nationality", true) && renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold text-primary-500">
Nationality
</span> <p class="text-dark text-[15px]"> ${nationalityName} </p> </div>`} </div> <div class="border-t border-gray-200 my-6"></div> <!-- Professional Info --> <h3 class="text-lg font-bold text-dark mb-4">
Professional info
</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> ${workCountryName && isFieldVisible("work_country", true) && renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold text-primary-500">
Work country
</span> <p class="text-dark text-[15px]"> ${workCountryName} </p> </div>`} ${profile.profession && isFieldVisible("profession", true) && renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold text-primary-500">
Profession
</span> <p class="text-dark text-[15px]"> ${profile.profession} </p> </div>`} ${profile.company && isFieldVisible("company", true) && renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold text-primary-500">
Current company
</span> <p class="text-dark text-[15px]"> ${profile.company} </p> </div>`} ${profile.position && isFieldVisible("position", true) && renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold text-primary-500">
Current position
</span> <p class="text-dark text-[15px]"> ${profile.position} </p> </div>`} ${profile.linkedin_url && isFieldVisible("linkedin_url", true) && renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold text-primary-500">
Linkedin URL
</span> <a${addAttribute(
    profile.linkedin_url.startsWith(
      "http"
    ) ? profile.linkedin_url : `https://${profile.linkedin_url}`,
    "href"
  )} target="_blank" rel="noopener noreferrer" class="text-accent-500 hover:underline break-all text-[15px]"> ${profile.linkedin_url} </a> </div>`} ${mainLanguageName && isFieldVisible("main_language", true) && renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold text-primary-500">
Main language
</span> <p class="text-dark text-[15px]"> ${mainLanguageName} </p> </div>`} ${mainAreaName && isFieldVisible(
    "main_area_of_expertise",
    true
  ) && renderTemplate`<div> <span class="text-xs uppercase block mb-1 font-bold text-primary-500">
Main area of expertise
</span> <p class="text-dark text-[15px]"> ${mainAreaName} </p> </div>`} </div> </div> <!-- Posts Tab --> <div id="posts" class="tab-content hidden animate-in fade-in duration-300"> ${posts && posts.length > 0 ? renderTemplate`<div class="space-y-6"> ${posts.map((post) => renderTemplate`${renderComponent($$result2, "PostCard", $$PostCard, { "post": post, "currentUser": currentUser })}`)} </div>` : renderTemplate`<div class="py-12 text-center text-gray-500"> <span class="text-4xl block mb-2">📝</span> <p>No posts published yet.</p> </div>`} </div> <!-- Podcasts Tab --> <div id="podcasts" class="tab-content hidden animate-in fade-in duration-300"> ${podcasts && podcasts.length > 0 ? renderTemplate`<div class="grid grid-cols-1 md:grid-cols-2 gap-6"> ${podcasts.map((podcast) => renderTemplate`${renderComponent($$result2, "PodcastCard", PodcastCard, { "client:visible": true, "podcast": podcast, "currentUser": currentUser, "client:component-hydration": "visible", "client:component-path": "D:/zveniaproject/src/components/social/PodcastCard", "client:component-export": "default" })}`)} </div>` : renderTemplate`<div class="py-12 text-center text-gray-500"> <span class="text-4xl block mb-2">🎙️</span> <p>No podcasts available.</p> </div>`} </div> <!-- Events Tab --> <div id="events" class="tab-content hidden animate-in fade-in duration-300"> ${events && events.length > 0 ? renderTemplate`<div class="space-y-4"> ${events.map((event) => renderTemplate`${renderComponent($$result2, "EventCard", EventCard, { "client:visible": true, "event": event, "currentUser": currentUser, "client:component-hydration": "visible", "client:component-path": "D:/zveniaproject/src/components/social/EventCard", "client:component-export": "default" })}`)} </div>` : renderTemplate`<div class="py-12 text-center text-gray-500"> <span class="text-4xl block mb-2">📅</span> <p>No upcoming events.</p> </div>`} </div> <!-- Services Tab --> <div id="services" class="tab-content hidden animate-in fade-in duration-300"> ${services && services.length > 0 ? renderTemplate`<div class="grid grid-cols-1 md:grid-cols-2 gap-6"> ${services.map((service) => renderTemplate`${renderComponent($$result2, "ServiceCard", ServiceCard, { "client:visible": true, "service": service, "currentUser": currentUser, "client:component-hydration": "visible", "client:component-path": "D:/zveniaproject/src/components/social/ServiceCard", "client:component-export": "default" })}`)} </div>` : renderTemplate`<div class="py-12 text-center text-gray-500"> <span class="text-4xl block mb-2">💼</span> <p>No services listed.</p> </div>`} </div> </div> </div> </div> </div>  `, "left-sidebar": async ($$result2) => renderTemplate`${renderComponent($$result2, "LeftSidebar", $$LeftSidebar, { "slot": "left-sidebar" })}`, "right-sidebar": async ($$result2) => renderTemplate`${renderComponent($$result2, "RightSidebar", $$RightSidebar, { "slot": "right-sidebar" })}` })} ${renderScript($$result, "D:/zveniaproject/src/pages/profile/[slug]/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/zveniaproject/src/pages/profile/[slug]/index.astro", void 0);

const $$file = "D:/zveniaproject/src/pages/profile/[slug]/index.astro";
const $$url = "/profile/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

import { j as jsxRuntimeExports } from './jsx-runtime_BO5PFvLt.mjs';
import { a as reactExports } from './_@astro-renderers_CxJDR4Zz.mjs';
import { P as PodcastOptions } from './ServiceCard_DzMz7GPt.mjs';

const getYoutubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};
const EpisodeCard = ({ episode, podcastTitle, coverImage, index }) => {
  const videoId = getYoutubeId(episode.video_url);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : coverImage;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "a",
    {
      href: episode.video_url,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "flex-shrink-0 w-72 group relative block bg-[var(--bg-card)] rounded-lg overflow-hidden border border-[var(--border-color)] hover:border-primary-500/50 transition-all scroll-snap-align-start",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-40 w-full overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: thumbnailUrl,
              alt: episode.title,
              className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 left-2 bg-black/80 backdrop-blur text-[10px] font-bold text-white px-2 py-0.5 rounded uppercase tracking-wider", children: podcastTitle.split(" ").slice(0, 2).join(" ") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6 text-white ml-1", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M8 5v14l11-7z" }) }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-2 left-2 bg-blue-600 text-[10px] font-bold text-white px-2 py-0.5 rounded", children: [
            "EPISODE #",
            index + 1
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[var(--text-main)] font-bold text-sm leading-tight line-clamp-2 group-hover:text-primary-400 transition-colors", children: episode.title }) })
      ]
    }
  );
};

const PodcastRow = ({ podcast, currentUser }) => {
  const scrollContainerRef = reactExports.useRef(null);
  const episodes = Array.isArray(podcast.episodes) ? podcast.episodes : [];
  const reversedEpisodes = [...episodes].reverse();
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };
  if (episodes.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[var(--bg-card)] border border-[var(--border-color)] p-6 mb-6 relative group/row transition-colors", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `/podcast/${podcast.slug}`, className: "text-xl font-bold text-[var(--text-main)] flex items-center gap-2 hover:text-primary-400 transition-colors cursor-pointer block", children: podcast.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PodcastOptions, { podcastId: podcast.id, authorId: podcast.author_id, currentUserId: currentUser?.id, slug: podcast.slug })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => scroll("left"),
        className: "absolute left-2 top-1/2 z-10 p-2 bg-[var(--bg-surface-hover)] rounded-full text-[var(--text-main)] opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-primary-600 shadow-md border border-[var(--border-color)] disabled:opacity-0",
        children: "←"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => scroll("right"),
        className: "absolute right-2 top-1/2 z-10 p-2 bg-[var(--bg-surface-hover)] rounded-full text-[var(--text-main)] opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-primary-600 shadow-md border border-[var(--border-color)]",
        children: "→"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref: scrollContainerRef,
        className: "flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide",
        style: { scrollbarWidth: "none", msOverflowStyle: "none" },
        children: reversedEpisodes.map((ep, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          EpisodeCard,
          {
            episode: ep,
            index: episodes.length - 1 - index,
            podcastTitle: podcast.title,
            coverImage: podcast.cover_image_url || ""
          },
          index
        ))
      }
    )
  ] });
};

export { PodcastRow as P };

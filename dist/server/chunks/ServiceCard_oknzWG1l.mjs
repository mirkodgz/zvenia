import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { S as ServiceOptions } from './ServiceOptions_BRfo11F-.mjs';

function EventOptions({ eventId, authorId, currentUserId, slug }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);
  const isAuthor = currentUserId === authorId;
  const linkSlug = slug || eventId;
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleCopyLink = () => {
    const url = `${window.location.origin}/event/${linkSlug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
      setIsOpen(false);
    });
  };
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event? This cannot be undone.")) return;
    try {
      const response = await fetch("/api/content/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId })
        // Polymorphic expectation
      });
      if (response.ok) {
        alert("Event deleted.");
        window.location.reload();
      } else {
        const res = await response.json();
        alert(res.error || "Failed to delete event.");
      }
    } catch (e) {
      console.error("Delete error", e);
      alert("Error deleting event.");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative z-20", ref: menuRef, children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        },
        className: "text-[var(--text-secondary)] hover:text-[var(--text-main)] p-1 rounded-full hover:bg-[var(--bg-card)] transition-colors bg-[var(--bg-surface)] backdrop-blur-sm",
        title: "Options",
        children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" }) })
      }
    ),
    isOpen && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 mt-2 w-48 bg-[var(--bg-card)] rounded-md shadow-lg py-1 border border-[var(--border-color)] overflow-hidden animate-fade-in", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCopyLink();
          },
          className: "block px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-main)] w-full text-left flex items-center gap-2 group transition-colors",
          children: copied ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-green-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M5 13l4 4L19 7" }) }),
            /* @__PURE__ */ jsx("span", { className: "text-green-500 font-bold", children: "Copied!" })
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 group-hover:text-primary-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" }) }),
            "Copy Link"
          ] })
        }
      ),
      isAuthor && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "h-px bg-[var(--border-color)] my-1" }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              setIsOpen(false);
              window.location.href = `/event/edit/${eventId}`;
            },
            className: "block px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-main)] w-full text-left flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" }) }),
              "Edit Event"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDelete();
            },
            className: "block px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full text-left flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }),
              "Delete Event"
            ]
          }
        )
      ] })
    ] })
  ] });
}

const EventCard = ({ event, currentUser }) => {
  const formatDateRange = (start, end) => {
    if (!start) return "";
    const s = new Date(start);
    const startYear = s.getFullYear();
    const options = { month: "short", day: "numeric" };
    const startStr = s.toLocaleDateString("en-US", options);
    if (!end) return `${startStr}, ${startYear}`;
    const e = new Date(end);
    const endYear = e.getFullYear();
    const endStr = e.toLocaleDateString("en-US", options);
    if (startYear !== endYear) {
      return `${startStr}, ${startYear} - ${endStr}, ${endYear}`;
    }
    return `${startStr} - ${endStr}, ${endYear}`;
  };
  const dateDisplay = formatDateRange(event.start_date, event.end_date);
  return /* @__PURE__ */ jsxs("div", { className: "bg-[#1A1A1A] rounded-lg border border-white/10 overflow-hidden hover:border-primary-500/30 transition-all group flex flex-col h-full relative", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-3 right-3 z-30", children: /* @__PURE__ */ jsx(EventOptions, { eventId: event.id, authorId: event.author_id, currentUserId: currentUser?.id, slug: event.slug }) }),
    /* @__PURE__ */ jsxs("div", { className: "relative h-48 w-full bg-black border-b border-white/5 overflow-hidden", children: [
      event.featured_image_url ? /* @__PURE__ */ jsx(
        "img",
        {
          src: event.featured_image_url,
          alt: event.title,
          className: "w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        }
      ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center bg-neutral-900", children: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", className: "w-12 h-12 text-gray-700", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ jsx("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }),
        /* @__PURE__ */ jsx("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
        /* @__PURE__ */ jsx("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
        /* @__PURE__ */ jsx("line", { x1: "3", y1: "10", x2: "21", y2: "10" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg", children: "Event" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col flex-grow", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-primary-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
        dateDisplay
      ] }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors", children: event.title }),
      event.location && /* @__PURE__ */ jsxs("div", { className: "text-gray-400 text-sm mb-4 flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxs("svg", { className: "w-4 h-4 text-gray-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [
          /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" }),
          /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z" })
        ] }),
        event.location
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-grow" }),
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: `/event/${event.slug}`,
          className: "mt-4 w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary-500/50 rounded-md text-sm font-bold text-center text-white transition-all flex items-center justify-center gap-2",
          children: [
            "View Details",
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" }) })
          ]
        }
      )
    ] })
  ] });
};

function PodcastOptions({ podcastId, authorId, currentUserId, slug }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);
  const isAuthor = currentUserId === authorId;
  const linkSlug = slug || podcastId;
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleCopyLink = () => {
    const url = `${window.location.origin}/podcast/${linkSlug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
      setIsOpen(false);
    });
  };
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this podcast? This cannot be undone.")) return;
    try {
      const response = await fetch("/api/content/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ podcastId })
      });
      if (response.ok) {
        alert("Podcast deleted.");
        window.location.reload();
      } else {
        const res = await response.json();
        alert(res.error || "Failed to delete podcast.");
      }
    } catch (e) {
      console.error("Delete error", e);
      alert("Error deleting podcast.");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative z-20", ref: menuRef, children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        },
        className: "text-[var(--text-secondary)] hover:text-[var(--text-main)] p-1 rounded-full hover:bg-[var(--bg-card)] transition-colors bg-[var(--bg-surface)] backdrop-blur-sm",
        title: "Options",
        children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" }) })
      }
    ),
    isOpen && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 mt-2 w-48 bg-[var(--bg-card)] rounded-md shadow-lg py-1 border border-[var(--border-color)] overflow-hidden animate-fade-in", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCopyLink();
          },
          className: "block px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-main)] w-full text-left flex items-center gap-2 group transition-colors",
          children: copied ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-green-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M5 13l4 4L19 7" }) }),
            /* @__PURE__ */ jsx("span", { className: "text-green-500 font-bold", children: "Copied!" })
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 group-hover:text-primary-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" }) }),
            "Copy Link"
          ] })
        }
      ),
      isAuthor && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "h-px bg-[var(--border-color)] my-1" }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              setIsOpen(false);
              window.location.href = `/podcast/edit/${podcastId}`;
            },
            className: "block px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-main)] w-full text-left flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" }) }),
              "Edit Podcast"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDelete();
            },
            className: "block px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full text-left flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }),
              "Delete Podcast"
            ]
          }
        )
      ] })
    ] })
  ] });
}

const getYoutubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};
const EpisodeCard = ({ episode, podcastTitle, coverImage, index }) => {
  const videoId = getYoutubeId(episode.video_url);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : coverImage;
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href: episode.video_url,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "flex-shrink-0 w-72 group relative block bg-[var(--bg-card)] rounded-lg overflow-hidden border border-[var(--border-color)] hover:border-primary-500/50 transition-all scroll-snap-align-start",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative h-40 w-full overflow-hidden", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: thumbnailUrl,
              alt: episode.title,
              className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" }),
          /* @__PURE__ */ jsx("div", { className: "absolute top-2 left-2 bg-black/80 backdrop-blur text-[10px] font-bold text-white px-2 py-0.5 rounded uppercase tracking-wider", children: podcastTitle.split(" ").slice(0, 2).join(" ") }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-white ml-1", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M8 5v14l11-7z" }) }) }) }),
          /* @__PURE__ */ jsxs("div", { className: "absolute bottom-2 left-2 bg-blue-600 text-[10px] font-bold text-white px-2 py-0.5 rounded", children: [
            "EPISODE #",
            index + 1
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "p-3", children: /* @__PURE__ */ jsx("h4", { className: "text-[var(--text-main)] font-bold text-sm leading-tight line-clamp-2 group-hover:text-primary-400 transition-colors", children: episode.title }) })
      ]
    }
  );
};

const PodcastRow = ({ podcast, currentUser }) => {
  const scrollContainerRef = useRef(null);
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
  return /* @__PURE__ */ jsxs("div", { className: "bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6 mb-6 relative group/row transition-colors", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsx("a", { href: `/podcast/${podcast.slug}`, className: "text-xl font-bold text-[var(--text-main)] flex items-center gap-2 hover:text-primary-400 transition-colors cursor-pointer block", children: podcast.title }),
      /* @__PURE__ */ jsx(PodcastOptions, { podcastId: podcast.id, authorId: podcast.author_id, currentUserId: currentUser?.id, slug: podcast.slug })
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => scroll("left"),
        className: "absolute left-2 top-1/2 z-10 p-2 bg-[var(--bg-surface-hover)] rounded-full text-[var(--text-main)] opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-primary-600 shadow-md border border-[var(--border-color)] disabled:opacity-0",
        children: "←"
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => scroll("right"),
        className: "absolute right-2 top-1/2 z-10 p-2 bg-[var(--bg-surface-hover)] rounded-full text-[var(--text-main)] opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-primary-600 shadow-md border border-[var(--border-color)]",
        children: "→"
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: scrollContainerRef,
        className: "flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide",
        style: { scrollbarWidth: "none", msOverflowStyle: "none" },
        children: reversedEpisodes.map((ep, index) => /* @__PURE__ */ jsx(
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

const ServiceCard = ({ service, currentUser }) => {
  const image = service.quick_view_image_url || service.featured_image_url || "https://via.placeholder.com/300x200?text=Service";
  const linkUrl = `/service/${service.slug}`;
  const rawDescription = service.description || service.content || "";
  const description = rawDescription.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]*>/g, "").trim();
  return /* @__PURE__ */ jsxs("div", { className: "flex-shrink-0 w-full group relative block bg-[var(--bg-card)] rounded-lg overflow-hidden border border-[var(--border-color)] hover:border-primary-500/50 transition-all scroll-snap-align-start h-full flex flex-col", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2 z-20", children: /* @__PURE__ */ jsx(ServiceOptions, { serviceId: service.id, authorId: service.author_id, currentUserId: currentUser?.id, slug: service.slug }) }),
    /* @__PURE__ */ jsxs(
      "a",
      {
        href: linkUrl,
        className: "block h-full w-full flex flex-col",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "relative h-40 w-full overflow-hidden bg-[var(--bg-surface)]", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: image,
                alt: service.title,
                className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" }),
            service.price && /* @__PURE__ */ jsxs("div", { className: "absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm border border-white/10", children: [
              "$",
              service.price
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 flex flex-col flex-grow", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-[var(--text-main)] font-bold text-sm leading-tight line-clamp-2 group-hover:text-primary-400 transition-colors mb-2", children: service.title }),
            description && /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--text-secondary)] line-clamp-2 mb-2", children: description }),
            !service.price && /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--text-secondary)] mb-2", children: "Contact for pricing" }),
            service.organizer_company && /* @__PURE__ */ jsx("div", { className: "mt-auto pt-2 flex items-center gap-2", children: /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase font-bold text-[var(--text-secondary)] bg-[var(--bg-surface)] border border-[var(--border-color)] px-2 py-0.5 rounded truncate max-w-full", children: service.organizer_company }) })
          ] })
        ]
      }
    )
  ] });
};

export { EventCard as E, PodcastRow as P, ServiceCard as S };

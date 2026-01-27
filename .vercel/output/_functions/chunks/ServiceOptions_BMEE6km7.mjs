import { j as jsxRuntimeExports } from './jsx-runtime_BO5PFvLt.mjs';
import { a as reactExports } from './_@astro-renderers_CxJDR4Zz.mjs';

function ServiceOptions({ serviceId, authorId, currentUserId, slug }) {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [copied, setCopied] = reactExports.useState(false);
  const menuRef = reactExports.useRef(null);
  const isAuthor = authorId ? currentUserId === authorId : false;
  const linkSlug = slug || serviceId;
  reactExports.useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleCopyLink = () => {
    const url = `${window.location.origin}/service/${linkSlug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
      setIsOpen(false);
    });
  };
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this service? This cannot be undone.")) return;
    try {
      const response = await fetch("/api/content/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId })
      });
      if (response.ok) {
        alert("Service deleted.");
        window.location.reload();
      } else {
        const res = await response.json();
        alert(res.error || "Failed to delete service.");
      }
    } catch (e) {
      console.error("Delete error", e);
      alert("Error deleting service.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-30", ref: menuRef, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        },
        className: "text-[var(--text-secondary)] hover:text-[var(--text-main)] p-1 rounded-full hover:bg-[var(--bg-card)] transition-colors bg-[var(--bg-surface)] backdrop-blur-sm shadow-sm border border-[var(--border-color)]",
        title: "Options",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" }) })
      }
    ),
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-0 mt-2 w-48 bg-[var(--bg-card)] rounded-md shadow-lg py-1 border border-[var(--border-color)] overflow-hidden animate-fade-in", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCopyLink();
          },
          className: "block px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-main)] w-full text-left flex items-center gap-2 group transition-colors",
          children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4 text-green-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M5 13l4 4L19 7" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-500 font-bold", children: "Copied!" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4 group-hover:text-primary-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" }) }),
            "Copy Link"
          ] })
        }
      ),
      isAuthor && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-[var(--border-color)] my-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              setIsOpen(false);
              window.location.href = `/dashboard/services/edit/${serviceId}`;
            },
            className: "block px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-main)] w-full text-left flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" }) }),
              "Edit Service"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDelete();
            },
            className: "block px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full text-left flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }),
              "Delete Service"
            ]
          }
        )
      ] })
    ] })
  ] });
}

export { ServiceOptions as S };

import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_0Ysjtq05.mjs';
import 'piccolore';
import { $ as $$SocialLayout, a as $$LeftSidebar } from '../chunks/LeftSidebar_DEdUkq9E.mjs';
import { $ as $$RightSidebar } from '../chunks/RightSidebar_ChM3M26l.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { Search, Filter, Globe } from 'lucide-react';
export { renderers } from '../renderers.mjs';

const UserCard = ({ user }) => {
  const profileLink = user.profile_slug ? `/profile/${user.profile_slug}` : `/profile/${user.id}`;
  const memberSince = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const displayName = user.full_name || user.email.split("@")[0];
  const initial = displayName[0].toUpperCase();
  const isVerified = user.role === "Expert" || user.role === "CountryManager" || user.role === "Administrator";
  return /* @__PURE__ */ jsx("a", { href: profileLink, className: "block group", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: "bg-white rounded-lg p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md h-full",
      style: { border: "1px solid rgba(13, 36, 27, 0.2)" },
      children: [
        /* @__PURE__ */ jsx("div", { className: "relative mb-4 group-hover:scale-105 transition-transform duration-300", children: /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm", children: user.avatar_url ? /* @__PURE__ */ jsx(
          "img",
          {
            src: user.avatar_url,
            alt: displayName,
            className: "w-full h-full object-cover"
          }
        ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-3xl font-bold", children: initial }) }) }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-green-600 font-medium mb-1 line-clamp-1", children: memberSince }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-1.5 mb-1 group-hover:text-primary-600 transition-colors", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-dark font-bold text-lg line-clamp-1", children: displayName }),
          isVerified && /* @__PURE__ */ jsx("div", { title: "Verified User", className: "shrink-0", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-blue-500", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }) }) })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm mb-3 h-5", children: user.profession || "N/A" }),
        /* @__PURE__ */ jsx("div", { className: "mt-auto pt-4 w-12 border-b-2 border-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" })
      ]
    }
  ) });
};

const ROLES = ["Expert", "CountryManager", "Administrator", "User"];
const UserGrid = () => {
  const [users, setUsers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("All");
  const [role, setRole] = useState("All");
  const loaderRef = useRef(null);
  const debounceRef = useRef(null);
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("/api/countries");
        if (res.ok) {
          const data = await res.json();
          setCountries(data);
        }
      } catch (err) {
        console.error("Failed to load countries", err);
      }
    };
    fetchCountries();
  }, []);
  const loadUsers = async (pageNum, isNewFilter = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pageNum.toString(),
        limit: "12",
        ...search && { search },
        ...country !== "All" && { country },
        ...role !== "All" && { role }
      });
      const res = await fetch(`/api/users?${queryParams}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      if (isNewFilter || pageNum === 1) {
        setUsers(data.users);
      } else {
        setUsers((prev) => {
          const existingIds = new Set(prev.map((u) => u.id));
          const newUsers = data.users.filter((u) => !existingIds.has(u.id));
          return [...prev, ...newUsers];
        });
      }
      setTotal(data.total);
      setHasMore(data.page < data.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      setUsers([]);
      setHasMore(true);
      loadUsers(1, true);
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search, country, role]);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && hasMore && !loading && users.length > 0) {
        loadUsers(page + 1);
      }
    }, { threshold: 0.1 });
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasMore, loading, page, users.length]);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8 animate-in fade-in slide-in-from-top-4 duration-500", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Search by name...",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "w-full pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all",
            style: { paddingLeft: "3rem" }
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Filter, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: role,
            onChange: (e) => setRole(e.target.value),
            className: "w-full pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-white cursor-pointer",
            style: { paddingLeft: "3rem" },
            children: [
              /* @__PURE__ */ jsx("option", { value: "All", children: "All Roles" }),
              ROLES.map((r) => /* @__PURE__ */ jsx("option", { value: r, children: r }, r))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Globe, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: country,
            onChange: (e) => setCountry(e.target.value),
            className: "w-full pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-white cursor-pointer",
            style: { paddingLeft: "3rem" },
            children: [
              /* @__PURE__ */ jsx("option", { value: "All", children: "All Countries" }),
              countries.map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.name }, c.id))
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "text-center mb-6", children: /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-dark inline-flex items-center gap-2", children: [
      "Total Users: ",
      /* @__PURE__ */ jsx("span", { className: "text-green-600", children: total })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: users.map((user) => /* @__PURE__ */ jsx("div", { className: "animate-in fade-in zoom-in-95 duration-300", children: /* @__PURE__ */ jsx(UserCard, { user }) }, user.id)) }),
    /* @__PURE__ */ jsxs("div", { ref: loaderRef, className: "py-12 text-center w-full", children: [
      loading && /* @__PURE__ */ jsx("div", { className: "inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" }),
      !hasMore && users.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-gray-400 text-sm", children: [
        /* @__PURE__ */ jsx("span", { children: "✓" }),
        " All users loaded"
      ] }),
      !loading && users.length === 0 && /* @__PURE__ */ jsxs("div", { className: "py-12 flex flex-col items-center justify-center text-gray-400", children: [
        /* @__PURE__ */ jsx(Search, { className: "w-12 h-12 mb-4 opacity-20" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg font-medium", children: "No users found matching filters." }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setSearch("");
              setCountry("All");
              setRole("All");
            },
            className: "mt-4 text-green-600 hover:underline text-sm font-semibold",
            children: "Clear filters"
          }
        )
      ] })
    ] })
  ] });
};

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "SocialLayout", $$SocialLayout, { "title": "Z-NETWORK | Zvenia Mining" }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="max-w-7xl mx-auto space-y-6"> ${renderComponent($$result2, "UserGrid", UserGrid, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "D:/zveniaproject/src/components/social/UserGrid", "client:component-export": "default" })} </div>  `, "left-sidebar": ($$result2) => renderTemplate`${renderComponent($$result2, "LeftSidebar", $$LeftSidebar, { "slot": "left-sidebar" })}`, "right-sidebar": ($$result2) => renderTemplate`${renderComponent($$result2, "RightSidebar", $$RightSidebar, { "slot": "right-sidebar" })}` })}`;
}, "D:/zveniaproject/src/pages/z-network/index.astro", void 0);

const $$file = "D:/zveniaproject/src/pages/z-network/index.astro";
const $$url = "/z-network";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DxclfMW8.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_D6VGdPOL.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
export { renderers } from '../../renderers.mjs';

const ROLES = ["Administrator", "CountryManager", "Ads", "Events", "Expert", "Basic"];
function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ role: "Basic", country: "" });
  const supabase = createBrowserClient(
    "https://ddgdtdhgaqeqnoigmfrh.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZ2R0ZGhnYXFlcW5vaWdtZnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNDE3NjMsImV4cCI6MjA4MjYxNzc2M30.aSW3Ds1z-8ta1sx-22P3NGyx4jzaY0aGNPPB9PsFcs0"
  );
  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(100);
    if (error) {
      console.error("Error fetching users:", error);
      alert("Error fetching users");
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.from("profiles").select("*").ilike("email", `%${searchTerm}%`).order("created_at", { ascending: false });
    if (error) {
      console.error("Error searching users:", error);
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };
  const startEdit = (user) => {
    setEditingId(user.id);
    setEditForm({ role: user.role || "Basic", country: user.country || "" });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ role: "Basic", country: "" });
  };
  const saveEdit = async (id) => {
    const { error } = await supabase.from("profiles").update({
      role: editForm.role,
      country: editForm.country || null
    }).eq("id", id);
    if (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update user: " + error.message);
    } else {
      setUsers(users.map((u) => u.id === id ? { ...u, role: editForm.role, country: editForm.country || null } : u));
      setEditingId(null);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-[#1A1A1A] rounded-lg border border-white/10 p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white", children: "User Management" }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Search email...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "bg-black/20 border border-white/10 rounded px-3 py-1 text-white text-sm focus:border-primary-500 outline-none"
          }
        ),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-1 rounded text-sm transition-colors", children: "Search" }),
        searchTerm && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setSearchTerm("");
              fetchUsers();
            },
            className: "text-gray-400 hover:text-white text-sm",
            children: "Clear"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-sm text-gray-400", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-white/5 uppercase font-bold text-xs", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "p-3", children: "User" }),
        /* @__PURE__ */ jsx("th", { className: "p-3", children: "Email" }),
        /* @__PURE__ */ jsx("th", { className: "p-3", children: "Role" }),
        /* @__PURE__ */ jsx("th", { className: "p-3", children: "Country" }),
        /* @__PURE__ */ jsx("th", { className: "p-3 text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-white/5", children: loading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "p-8 text-center", children: "Loading users..." }) }) : users.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "p-8 text-center", children: "No users found." }) }) : users.map((user) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-white/5 transition-colors", children: [
        /* @__PURE__ */ jsxs("td", { className: "p-3 font-medium text-white flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs overflow-hidden", children: user.avatar_url ? /* @__PURE__ */ jsx("img", { src: user.avatar_url, className: "w-full h-full object-cover" }) : user.email?.[0].toUpperCase() }),
          user.full_name || "N/A"
        ] }),
        /* @__PURE__ */ jsx("td", { className: "p-3", children: user.email }),
        editingId === user.id ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("td", { className: "p-3", children: /* @__PURE__ */ jsx(
            "select",
            {
              value: editForm.role,
              onChange: (e) => setEditForm({ ...editForm, role: e.target.value }),
              className: "bg-black border border-primary-500 rounded px-2 py-1 text-white outline-none w-full",
              children: ROLES.map((r) => /* @__PURE__ */ jsx("option", { value: r, children: r }, r))
            }
          ) }),
          /* @__PURE__ */ jsx("td", { className: "p-3", children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: editForm.country,
              onChange: (e) => setEditForm({ ...editForm, country: e.target.value }),
              placeholder: "Country...",
              className: "bg-black border border-primary-500 rounded px-2 py-1 text-white outline-none w-full"
            }
          ) }),
          /* @__PURE__ */ jsxs("td", { className: "p-3 text-right flex justify-end gap-2", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => saveEdit(user.id), className: "text-green-400 hover:text-green-300", children: "Save" }),
            /* @__PURE__ */ jsx("button", { onClick: cancelEdit, className: "text-gray-500 hover:text-gray-400", children: "Cancel" })
          ] })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("td", { className: "p-3", children: /* @__PURE__ */ jsx("span", { className: `px-2 py-1 rounded text-xs border ${user.role === "Administrator" ? "border-red-500/30 bg-red-500/10 text-red-400" : user.role === "CountryManager" ? "border-blue-500/30 bg-blue-500/10 text-blue-400" : user.role === "Expert" ? "border-purple-500/30 bg-purple-500/10 text-purple-400" : "border-gray-500/30 bg-gray-500/10 text-gray-400"}`, children: user.role }) }),
          /* @__PURE__ */ jsx("td", { className: "p-3", children: user.country || "-" }),
          /* @__PURE__ */ jsx("td", { className: "p-3 text-right", children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => startEdit(user),
              className: "text-primary-400 hover:text-primary-300 font-medium",
              children: "Edit"
            }
          ) })
        ] })
      ] }, user.id)) })
    ] }) })
  ] });
}

const $$Astro = createAstro();
const $$Users = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Users;
  const user = Astro2.locals.user;
  if (!user || user.role !== "Administrator") {
    return Astro2.redirect("/");
  }
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Users", "activePage": "users" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-6 flex justify-between items-end"> <div> <h1 class="text-2xl font-bold text-white tracking-tight">User Management</h1> <p class="text-gray-400 text-sm mt-1">Manage platform access, roles, and country assignments.</p> </div> <button class="bg-primary-600 hover:bg-primary-500 text-black font-bold py-2 px-4 rounded-lg text-sm transition-colors flex items-center gap-2"> <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
Add User
</button> </div>  ${renderComponent($$result2, "UserManagement", UserManagement, { "client:load": true, "client:component-hydration": "load", "client:component-path": "D:/zvenia/astro-frontend/src/components/admin/UserManagement", "client:component-export": "default" })} ` })}`;
}, "D:/zvenia/astro-frontend/src/pages/admin/users.astro", void 0);

const $$file = "D:/zvenia/astro-frontend/src/pages/admin/users.astro";
const $$url = "/admin/users";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Users,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

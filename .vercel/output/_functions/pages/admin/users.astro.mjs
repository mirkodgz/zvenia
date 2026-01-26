import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_CNOy-_Bn.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_H94Cvfdh.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect, useMemo } from 'react';
import { useReactTable, getSortedRowModel, getPaginationRowModel, getFilteredRowModel, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { createBrowserClient } from '@supabase/ssr';
import { format } from 'date-fns';
export { renderers } from '../../renderers.mjs';

const ROLES = ["Administrator", "CountryManager", "Ads", "Events", "Expert", "Basic"];
function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    role: "Basic",
    work_country: ""
  });
  const supabase = createBrowserClient(
    "https://ddgdtdhgaqeqnoigmfrh.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZ2R0ZGhnYXFlcW5vaWdtZnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNDE3NjMsImV4cCI6MjA4MjYxNzc2M30.aSW3Ds1z-8ta1sx-22P3NGyx4jzaY0aGNPPB9PsFcs0"
  );
  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    setLoading(true);
    let allUsers = [];
    let page = 0;
    const pageSize = 1e3;
    let hasMore = true;
    while (hasMore) {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false }).range(page * pageSize, (page + 1) * pageSize - 1);
      if (error) {
        console.error("Error fetching users:", error);
        alert("Error fetching users");
        break;
      }
      if (data && data.length > 0) {
        allUsers = [...allUsers, ...data];
        hasMore = data.length === pageSize;
        page++;
      } else {
        hasMore = false;
      }
    }
    setUsers(allUsers);
    setLoading(false);
  };
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user");
    } else {
      setUsers(users.filter((u) => u.id !== id));
    }
  };
  const startEdit = (user) => {
    setEditingId(user.id);
    setEditForm({
      role: user.role || "Basic",
      work_country: user.work_country || ""
    });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ role: "Basic", work_country: "" });
  };
  const saveEdit = async (id) => {
    const { error } = await supabase.from("profiles").update({
      role: editForm.role,
      work_country: editForm.work_country || null
    }).eq("id", id);
    if (error) {
      console.error("Error updating user:", error);
      alert("Error updating user: " + error.message);
    } else {
      setUsers(users.map(
        (u) => u.id === id ? { ...u, role: editForm.role, work_country: editForm.work_country || null } : u
      ));
      setEditingId(null);
    }
  };
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "Administrator":
        return "border-red-500/30 bg-red-500/10 text-red-400";
      case "CountryManager":
        return "border-blue-500/30 bg-blue-500/10 text-blue-400";
      case "Expert":
        return "border-purple-500/30 bg-purple-500/10 text-purple-400";
      case "Ads":
        return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";
      case "Events":
        return "border-green-500/30 bg-green-500/10 text-green-400";
      default:
        return "border-gray-500/30 bg-gray-500/10 text-gray-400";
    }
  };
  const columns = useMemo(
    () => [
      {
        accessorKey: "full_name",
        header: "User",
        cell: ({ row }) => {
          const user = row.original;
          const displayName = user.full_name || (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : null) || user.email?.split("@")[0] || "N/A";
          return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            user.avatar_url ? /* @__PURE__ */ jsx(
              "img",
              {
                src: user.avatar_url,
                alt: displayName,
                className: "w-8 h-8 rounded-full object-cover"
              }
            ) : /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-700 font-medium", children: displayName[0]?.toUpperCase() || "?" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium text-gray-900", children: displayName }),
              user.username && /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500", children: [
                "@",
                user.username
              ] })
            ] })
          ] });
        }
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => /* @__PURE__ */ jsx("span", { className: "text-gray-700 text-sm", children: row.original.email })
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
          const user = row.original;
          if (editingId === user.id) {
            return /* @__PURE__ */ jsx(
              "select",
              {
                value: editForm.role,
                onChange: (e) => setEditForm({ ...editForm, role: e.target.value }),
                className: "bg-white border border-primary-500 rounded px-2 py-1 text-gray-900 outline-none text-sm",
                onClick: (e) => e.stopPropagation(),
                children: ROLES.map((r) => /* @__PURE__ */ jsx("option", { value: r, children: r }, r))
              }
            );
          }
          return /* @__PURE__ */ jsx("span", { className: `px-2 py-1 rounded text-xs border ${getRoleBadgeColor(user.role)}`, children: user.role || "Basic" });
        }
      },
      {
        accessorKey: "company",
        header: "Company",
        cell: ({ row }) => /* @__PURE__ */ jsx("span", { className: "text-gray-600 text-sm", children: row.original.company || "-" })
      },
      {
        accessorKey: "position",
        header: "Position",
        cell: ({ row }) => /* @__PURE__ */ jsx("span", { className: "text-gray-600 text-sm", children: row.original.position || "-" })
      },
      {
        accessorKey: "work_country",
        header: "Country",
        cell: ({ row }) => {
          const user = row.original;
          if (editingId === user.id) {
            return /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: editForm.work_country,
                onChange: (e) => setEditForm({ ...editForm, work_country: e.target.value }),
                placeholder: "Country...",
                className: "bg-white border border-primary-500 rounded px-2 py-1 text-gray-900 outline-none text-sm w-32",
                onClick: (e) => e.stopPropagation()
              }
            );
          }
          return /* @__PURE__ */ jsx("span", { className: "text-gray-600 text-sm", children: user.work_country || user.nationality || "-" });
        }
      },
      {
        accessorKey: "profession",
        header: "Profession",
        cell: ({ row }) => /* @__PURE__ */ jsx("span", { className: "text-gray-600 text-sm", children: row.original.profession || "-" })
      },
      {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) => /* @__PURE__ */ jsx("span", { className: "text-gray-600 text-sm", children: format(new Date(row.original.created_at), "dd/MM/yyyy") })
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const user = row.original;
          if (editingId === user.id) {
            return /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => saveEdit(user.id),
                  className: "text-green-600 hover:text-green-700 text-sm",
                  children: "Save"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: cancelEdit,
                  className: "text-gray-500 hover:text-gray-600 text-sm",
                  children: "Cancel"
                }
              )
            ] });
          }
          return /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            user.profile_slug && /* @__PURE__ */ jsx(
              "a",
              {
                href: `/profile/${user.profile_slug}/zv-user`,
                target: "_blank",
                className: "text-blue-600 hover:text-blue-700 text-sm",
                children: "View"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => startEdit(user),
                className: "text-primary-600 hover:text-primary-700 text-sm",
                children: "Edit"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleDelete(user.id),
                className: "text-red-600 hover:text-red-700 text-sm",
                children: "Delete"
              }
            )
          ] });
        }
      }
    ],
    [users, editingId, editForm]
  );
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      globalFilter: searchTerm
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearchTerm,
    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase();
      const user = row.original;
      return user.email?.toLowerCase().includes(search) || user.full_name?.toLowerCase().includes(search) || user.first_name?.toLowerCase().includes(search) || user.last_name?.toLowerCase().includes(search) || user.company?.toLowerCase().includes(search) || user.position?.toLowerCase().includes(search) || user.profession?.toLowerCase().includes(search) || user.work_country?.toLowerCase().includes(search) || user.nationality?.toLowerCase().includes(search) || user.role?.toLowerCase().includes(search) || user.username?.toLowerCase().includes(search) || false;
    },
    initialState: {
      pagination: {
        pageSize: 20
      }
    }
  });
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-6 shadow-sm", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "User Management" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600 mt-1", children: [
          "Total: ",
          users.length,
          " users"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Search users...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "bg-gray-50 border border-gray-200 rounded px-3 py-1 text-gray-900 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 w-64"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: fetchUsers,
            className: "bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 px-4 py-1 rounded text-sm transition-colors",
            title: "Refresh list",
            children: "↻"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-sm text-gray-600", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 uppercase font-bold text-xs text-gray-700", children: table.getHeaderGroups().map((headerGroup) => /* @__PURE__ */ jsx("tr", { children: headerGroup.headers.map((header) => /* @__PURE__ */ jsx(
        "th",
        {
          className: "p-3 cursor-pointer hover:bg-gray-100",
          onClick: header.column.getToggleSortingHandler(),
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            flexRender(header.column.columnDef.header, header.getContext()),
            {
              asc: " ↑",
              desc: " ↓"
            }[header.column.getIsSorted()] ?? null
          ] })
        },
        header.id
      )) }, headerGroup.id)) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: loading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: columns.length, className: "p-8 text-center text-gray-500", children: "Loading users..." }) }) : table.getRowModel().rows.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: columns.length, className: "p-8 text-center text-gray-500", children: "No users found." }) }) : table.getRowModel().rows.map((row) => /* @__PURE__ */ jsx("tr", { className: "hover:bg-gray-50 transition-colors", children: row.getVisibleCells().map((cell) => /* @__PURE__ */ jsx("td", { className: "p-3", children: flexRender(cell.column.columnDef.cell, cell.getContext()) }, cell.id)) }, row.id)) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-600", children: [
        "Mostrando ",
        table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1,
        " a",
        " ",
        Math.min(
          (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
          table.getFilteredRowModel().rows.length
        ),
        " ",
        "of ",
        table.getFilteredRowModel().rows.length,
        " users"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => table.previousPage(),
            disabled: !table.getCanPreviousPage(),
            className: "bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
            children: "Previous"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => table.nextPage(),
            disabled: !table.getCanNextPage(),
            className: "bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
            children: "Next"
          }
        )
      ] })
    ] })
  ] });
}

const $$Astro = createAstro();
const $$Users = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Users;
  const user = Astro2.locals.user;
  const profile = Astro2.locals.profile;
  if (!user || !profile || profile.role !== "Administrator") {
    return Astro2.redirect("/");
  }
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Users", "activePage": "users" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-6 flex justify-between items-end"> <div> <h1 class="text-2xl font-bold text-white tracking-tight">User Management</h1> <p class="text-gray-400 text-sm mt-1">Manage users, roles, companies and work countries.</p> </div> <button class="bg-primary-600 hover:bg-primary-500 text-black font-bold py-2 px-4 rounded-lg text-sm transition-colors flex items-center gap-2"> <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
Add User
</button> </div>  ${renderComponent($$result2, "UsersTable", UsersTable, { "client:load": true, "client:component-hydration": "load", "client:component-path": "D:/zveniaproject/src/components/admin/tables/UsersTable", "client:component-export": "default" })} ` })}`;
}, "D:/zveniaproject/src/pages/admin/users.astro", void 0);

const $$file = "D:/zveniaproject/src/pages/admin/users.astro";
const $$url = "/admin/users";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Users,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_0Ysjtq05.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_kIrHDt3T.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect, useMemo } from 'react';
import { useReactTable, getSortedRowModel, getPaginationRowModel, getFilteredRowModel, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { createBrowserClient } from '@supabase/ssr';
import { format } from 'date-fns';
import { i as isAdministrator } from '../../chunks/roles_C8ezOKbC.mjs';
export { renderers } from '../../renderers.mjs';

function PostsTable() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState([]);
  const supabase = createBrowserClient(
    "https://ddgdtdhgaqeqnoigmfrh.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZ2R0ZGhnYXFlcW5vaWdtZnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNDE3NjMsImV4cCI6MjA4MjYxNzc2M30.aSW3Ds1z-8ta1sx-22P3NGyx4jzaY0aGNPPB9PsFcs0"
  );
  useEffect(() => {
    fetchPosts();
  }, []);
  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("posts").select("*, author:profiles(full_name, avatar_url)").order("created_at", { ascending: false }).limit(1e3);
    if (error) {
      console.error("Error fetching posts:", error);
      alert("Error fetching posts");
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      console.error("Error deleting post:", error);
      alert("Error deleting post");
    } else {
      setPosts(posts.filter((p) => p.id !== id));
    }
  };
  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => /* @__PURE__ */ jsxs("div", { className: "max-w-xs", children: [
          /* @__PURE__ */ jsx("div", { className: "font-medium text-gray-900 truncate", children: row.original.title }),
          row.original.excerpt && /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-600 truncate mt-1", children: row.original.excerpt })
        ] })
      },
      {
        accessorKey: "author",
        header: "Author",
        cell: ({ row }) => {
          const author = row.original.author;
          return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            author?.avatar_url ? /* @__PURE__ */ jsx(
              "img",
              {
                src: author.avatar_url,
                alt: author.full_name || "",
                className: "w-6 h-6 rounded-full"
              }
            ) : /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-700 font-medium", children: author?.full_name?.[0] || "?" }),
            /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: author?.full_name || "N/A" })
          ] });
        }
      },
      {
        accessorKey: "published_at",
        header: "Published",
        cell: ({ row }) => {
          const date = row.original.published_at || row.original.created_at;
          return /* @__PURE__ */ jsx("span", { className: "text-gray-600 text-sm", children: date ? format(new Date(date), "dd/MM/yyyy") : "-" });
        }
      },
      {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) => /* @__PURE__ */ jsx("span", { className: "text-gray-600 text-sm", children: format(new Date(row.original.created_at), "dd/MM/yyyy") })
      },
      {
        id: "media",
        header: "Media",
        cell: ({ row }) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          row.original.featured_image_url && /* @__PURE__ */ jsx("span", { className: "text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded", children: "Image" }),
          row.original.document_url && /* @__PURE__ */ jsx("span", { className: "text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded", children: "PDF" })
        ] })
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `/post/${row.original.slug}`,
              target: "_blank",
              className: "text-blue-600 hover:text-blue-700 text-sm",
              children: "View"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `/admin/posts/edit/${row.original.id}`,
              className: "text-primary-600 hover:text-primary-700 text-sm",
              children: "Edit"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleDelete(row.original.id),
              className: "text-red-600 hover:text-red-700 text-sm",
              children: "Delete"
            }
          )
        ] })
      }
    ],
    [posts]
  );
  const table = useReactTable({
    data: posts,
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
      return row.original.title.toLowerCase().includes(search) || row.original.excerpt?.toLowerCase().includes(search) || row.original.author?.full_name?.toLowerCase().includes(search) || row.original.slug.toLowerCase().includes(search);
    },
    initialState: {
      pagination: {
        pageSize: 20
      }
    }
  });
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-6 shadow-sm", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Posts Management" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Search posts...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "bg-gray-50 border border-gray-200 rounded px-3 py-1 text-gray-900 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "/admin/posts/create",
            className: "bg-primary-500 hover:bg-primary-600 text-white px-4 py-1 rounded text-sm transition-colors",
            children: "+ New Post"
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
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: loading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: columns.length, className: "p-8 text-center text-gray-500", children: "Loading posts..." }) }) : table.getRowModel().rows.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: columns.length, className: "p-8 text-center text-gray-500", children: "No posts found." }) }) : table.getRowModel().rows.map((row) => /* @__PURE__ */ jsx("tr", { className: "hover:bg-gray-50 transition-colors", children: row.getVisibleCells().map((cell) => /* @__PURE__ */ jsx("td", { className: "p-3", children: flexRender(cell.column.columnDef.cell, cell.getContext()) }, cell.id)) }, row.id)) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-600", children: [
        "Showing ",
        table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1,
        " to",
        " ",
        Math.min(
          (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
          table.getFilteredRowModel().rows.length
        ),
        " ",
        "of ",
        table.getFilteredRowModel().rows.length,
        " posts"
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
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const user = Astro2.locals.user;
  const profile = Astro2.locals.profile;
  const userRole = profile?.role || user?.role || "Basic";
  if (!user || !isAdministrator(userRole)) {
    return Astro2.redirect("/");
  }
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Posts" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PostsTable", PostsTable, { "client:load": true, "client:component-hydration": "load", "client:component-path": "D:/zveniaproject/src/components/admin/tables/PostsTable", "client:component-export": "default" })} ` })}`;
}, "D:/zveniaproject/src/pages/admin/posts/index.astro", void 0);

const $$file = "D:/zveniaproject/src/pages/admin/posts/index.astro";
const $$url = "/admin/posts";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

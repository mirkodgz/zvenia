import React, { useState, useEffect, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
} from '@tanstack/react-table';
import { createBrowserClient } from '@supabase/ssr';
import { format } from 'date-fns';

interface Post {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    published_at: string | null;
    featured_image_url: string | null;
    document_url: string | null;
    created_at: string;
    updated_at: string;
    author: {
        full_name: string | null;
        avatar_url: string | null;
    } | null;
}

export default function PostsTable() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);

    const supabase = createBrowserClient(
        import.meta.env.PUBLIC_SUPABASE_URL!,
        import.meta.env.PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('posts')
            .select('*, author:profiles(full_name, avatar_url)')
            .order('created_at', { ascending: false })
            .limit(1000); // Pagination can be improved later

        if (error) {
            console.error('Error fetching posts:', error);
            alert('Error fetching posts');
        } else {
            setPosts(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting post:', error);
            alert('Error deleting post');
        } else {
            setPosts(posts.filter(p => p.id !== id));
        }
    };

    const columns = useMemo<ColumnDef<Post>[]>(
        () => [
            {
                accessorKey: 'title',
                header: 'Title',
                cell: ({ row }) => (
                    <div className="max-w-xs">
                        <div className="font-medium text-gray-900 truncate">{row.original.title}</div>
                        {row.original.excerpt && (
                            <div className="text-xs text-gray-600 truncate mt-1">{row.original.excerpt}</div>
                        )}
                    </div>
                ),
            },
            {
                accessorKey: 'author',
                header: 'Author',
                cell: ({ row }) => {
                    const author = row.original.author;
                    return (
                        <div className="flex items-center gap-2">
                            {author?.avatar_url ? (
                                <img
                                    src={author.avatar_url}
                                    alt={author.full_name || ''}
                                    className="w-6 h-6 rounded-full"
                                />
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-700 font-medium">
                                    {author?.full_name?.[0] || '?'}
                                </div>
                            )}
                            <span className="text-gray-700">{author?.full_name || 'N/A'}</span>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'published_at',
                header: 'Published',
                cell: ({ row }) => {
                    const date = row.original.published_at || row.original.created_at;
                    return (
                        <span className="text-gray-600 text-sm">
                            {date ? format(new Date(date), 'dd/MM/yyyy') : '-'}
                        </span>
                    );
                },
            },
            {
                accessorKey: 'created_at',
                header: 'Created',
                cell: ({ row }) => (
                    <span className="text-gray-600 text-sm">
                        {format(new Date(row.original.created_at), 'dd/MM/yyyy')}
                    </span>
                ),
            },
            {
                id: 'media',
                header: 'Media',
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        {row.original.featured_image_url && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Image</span>
                        )}
                        {row.original.document_url && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">PDF</span>
                        )}
                    </div>
                ),
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <a
                            href={`/post/${row.original.slug}`}
                            target="_blank"
                            className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                            View
                        </a>
                        <a
                            href={`/admin/posts/edit/${row.original.id}`}
                            className="text-primary-600 hover:text-primary-700 text-sm"
                        >
                            Edit
                        </a>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="text-red-600 hover:text-red-700 text-sm"
                        >
                            Delete
                        </button>
                    </div>
                ),
            },
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
            globalFilter: searchTerm,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setSearchTerm,
        globalFilterFn: (row, columnId, filterValue) => {
            const search = filterValue.toLowerCase();
            return (
                row.original.title.toLowerCase().includes(search) ||
                row.original.excerpt?.toLowerCase().includes(search) ||
                row.original.author?.full_name?.toLowerCase().includes(search) ||
                row.original.slug.toLowerCase().includes(search)
            );
        },
        initialState: {
            pagination: {
                pageSize: 20,
            },
        },
    });

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Posts Management</h2>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded px-3 py-1 text-gray-900 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    <a
                        href="/admin/posts/create"
                        className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-1 rounded text-sm transition-colors"
                    >
                        + New Post
                    </a>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 uppercase font-bold text-xs text-gray-700">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="p-3 cursor-pointer hover:bg-gray-100"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center gap-2">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {{
                                                asc: ' ↑',
                                                desc: ' ↓',
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length} className="p-8 text-center text-gray-500">
                                    Loading posts...
                                </td>
                            </tr>
                        ) : table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="p-8 text-center text-gray-500">
                                    No posts found.
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="p-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                    Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                    {Math.min(
                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                        table.getFilteredRowModel().rows.length
                    )}{' '}
                    of {table.getFilteredRowModel().rows.length} posts
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}


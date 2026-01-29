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

interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    first_name: string | null;
    last_name: string | null;
    role: string | null;
    avatar_url: string | null;
    company: string | null;
    position: string | null;
    linkedin_url: string | null;
    phone_number: string | null;
    nationality: string | null;
    profession: string | null;
    work_country: string | null;
    current_location: string | null;
    headline_user: string | null;
    main_language: string | null;
    main_area_of_expertise: string | null;
    username: string | null;
    profile_slug: string | null;
    metadata: any;
    created_at: string;
    updated_at: string;
}

const ROLES_FALLBACK = ['Administrator', 'CountryManager', 'Ads', 'Events', 'Expert', 'Basic'];

export default function UsersTable() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [roles, setRoles] = useState<string[]>([]); // Dynamic Roles State
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<{ role: string; work_country: string }>({
        role: 'Basic',
        work_country: ''
    });

    const supabase = createBrowserClient(
        import.meta.env.PUBLIC_SUPABASE_URL!,
        import.meta.env.PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchUsers();
        fetchRoles(); // Fetch roles on mount
    }, []);

    const fetchRoles = async () => {
        const { data, error } = await supabase
            .from('user_roles')
            .select('role_name')
            .order('role_name');

        if (data) {
            setRoles(data.map(r => r.role_name));
        } else {
            console.error("Error fetching roles:", error);
            // Fallback just in case
            setRoles(['Administrator', 'CountryManager', 'Ads', 'Events', 'Expert', 'Basic']);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const page = 0; // Currently simplified to single page fetch or we can implement pagination state
            // Ideally we use table state for pagination, but let's stick to the simpler logic first or reset it
            // Logic: The original code fetched ALL users in a loop. With the API, we can fetch paginated or increase limit.
            // For now, let's fetch a large chunk or implement server-side pagination properly.
            // Let's implement server-side pagination integration.

            const limit = 50; // Fetch 50 per page for UI
            const pageIndex = table.getState().pagination.pageIndex;

            // NOTE: Search is handled client side in current UI but server side in new API
            // For now, let's fetch 'all' (up to limit) or refactor UI to be server-side driven.
            // To match previous loop behavior (fetching all), we might want to increase limit or just rely on API pagination.
            // Let's fetch 100 recent users for initial load speed fix.

            const response = await fetch(`/api/admin/users/list?page=${pageIndex}&pageSize=1000`);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to fetch users');
            }

            setUsers(result.users);
            // Note: Total count handling needs UI update if we want exact server count

        } catch (err: any) {
            console.error('Error fetching users:', err);
            // alert('Error fetching users: ' + err.message); // Silent fail preferred on load
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        // Use API endpoint for full deletion (Auth + Profile)
        try {
            const response = await fetch(`/api/admin/users/action?id=${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete');
            }

            // Update UI on success
            setUsers(users.filter(u => u.id !== id));

        } catch (err: any) {
            console.error('Error deleting user:', err);
            alert('Error deleting user: ' + err.message);
        }
    };

    const startEdit = (user: Profile) => {
        setEditingId(user.id);
        setEditForm({
            role: user.role || 'Basic',
            work_country: user.work_country || ''
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ role: 'Basic', work_country: '' });
    };

    const saveEdit = async (id: string) => {
        try {
            const response = await fetch('/api/admin/users/action', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    role: editForm.role,
                    country: editForm.work_country || null // Note: API expects 'country', component uses 'work_country'
                }),
            });

            const result = await response.json();

            // DEBUG: Log result
            console.log("Admin Update Result:", result);

            if (!response.ok) {
                throw new Error(result.error || 'Failed to update user');
            }

            alert("Success! User updated.");

            // Update UI on success
            setUsers(users.map(u =>
                u.id === id
                    ? { ...u, role: editForm.role, work_country: editForm.work_country || null }
                    : u
            ));
            setEditingId(null);

        } catch (err: any) {
            console.error('Error updating user:', err);
            alert('Error updating user: ' + err.message);
        }
    };

    const getRoleBadgeColor = (role: string | null) => {
        switch (role) {
            case 'Administrator':
                return 'border-red-500/30 bg-red-500/10 text-red-400';
            case 'CountryManager':
                return 'border-blue-500/30 bg-blue-500/10 text-blue-400';
            case 'Expert':
                return 'border-purple-500/30 bg-purple-500/10 text-purple-400';
            case 'Ads':
                return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400';
            case 'Events':
                return 'border-green-500/30 bg-green-500/10 text-green-400';
            default:
                return 'border-gray-500/30 bg-gray-500/10 text-gray-400';
        }
    };

    const columns = useMemo<ColumnDef<Profile>[]>(
        () => [
            {
                accessorKey: 'full_name',
                header: 'User',
                cell: ({ row }) => {
                    const user = row.original;
                    const displayName = user.full_name ||
                        (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : null) ||
                        user.email?.split('@')[0] ||
                        'N/A';
                    return (
                        <div className="flex items-center gap-2">
                            {user.avatar_url ? (
                                <img
                                    src={user.avatar_url}
                                    alt={displayName}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-700 font-medium">
                                    {displayName[0]?.toUpperCase() || '?'}
                                </div>
                            )}
                            <div>
                                <div className="font-medium text-gray-900">{displayName}</div>
                                {user.username && (
                                    <div className="text-xs text-gray-500">@{user.username}</div>
                                )}
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'email',
                header: 'Email',
                cell: ({ row }) => (
                    <span className="text-gray-700 text-sm">{row.original.email}</span>
                ),
            },
            {
                accessorKey: 'role',
                header: 'Role',
                cell: ({ row }) => {
                    const user = row.original;
                    if (editingId === user.id) {
                        return (
                            <select
                                value={editForm.role}
                                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                className="bg-white border border-primary-500 rounded px-2 py-1 text-gray-900 outline-none text-sm"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {roles.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        );
                    }
                    return (
                        <span className={`px-2 py-1 rounded text-xs border ${getRoleBadgeColor(user.role)}`}>
                            {user.role || 'Basic'}
                        </span>
                    );
                },
            },
            {
                accessorKey: 'company',
                header: 'Company',
                cell: ({ row }) => (
                    <span className="text-gray-600 text-sm">
                        {row.original.company || '-'}
                    </span>
                ),
            },
            {
                accessorKey: 'position',
                header: 'Position',
                cell: ({ row }) => (
                    <span className="text-gray-600 text-sm">
                        {row.original.position || '-'}
                    </span>
                ),
            },
            {
                accessorKey: 'work_country',
                header: 'Country',
                cell: ({ row }) => {
                    const user = row.original;
                    if (editingId === user.id) {
                        return (
                            <input
                                type="text"
                                value={editForm.work_country}
                                onChange={(e) => setEditForm({ ...editForm, work_country: e.target.value })}
                                placeholder="Country..."
                                className="bg-white border border-primary-500 rounded px-2 py-1 text-gray-900 outline-none text-sm w-32"
                                onClick={(e) => e.stopPropagation()}
                            />
                        );
                    }
                    return (
                        <span className="text-gray-600 text-sm">
                            {user.work_country || user.nationality || '-'}
                        </span>
                    );
                },
            },
            {
                accessorKey: 'profession',
                header: 'Profession',
                cell: ({ row }) => (
                    <span className="text-gray-600 text-sm">
                        {row.original.profession || '-'}
                    </span>
                ),
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
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    const user = row.original;
                    if (editingId === user.id) {
                        return (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => saveEdit(user.id)}
                                    className="text-green-600 hover:text-green-700 text-sm cursor-pointer"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={cancelEdit}
                                    className="text-gray-500 hover:text-gray-600 text-sm cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        );
                    }
                    return (
                        <div className="flex gap-2">
                            {user.profile_slug && (
                                <a
                                    href={`/profile/${user.profile_slug}/zv-user`}
                                    target="_blank"
                                    className="text-blue-600 hover:text-blue-700 text-sm"
                                >
                                    View
                                </a>
                            )}
                            <button
                                onClick={() => startEdit(user)}
                                className="text-primary-600 hover:text-primary-700 text-sm cursor-pointer"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(user.id)}
                                className="text-red-600 hover:text-red-700 text-sm cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    );
                },
            },
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
            globalFilter: searchTerm,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setSearchTerm,
        globalFilterFn: (row, columnId, filterValue) => {
            const search = filterValue.toLowerCase();
            const user = row.original;
            return (
                user.email?.toLowerCase().includes(search) ||
                user.full_name?.toLowerCase().includes(search) ||
                user.first_name?.toLowerCase().includes(search) ||
                user.last_name?.toLowerCase().includes(search) ||
                user.company?.toLowerCase().includes(search) ||
                user.position?.toLowerCase().includes(search) ||
                user.profession?.toLowerCase().includes(search) ||
                user.work_country?.toLowerCase().includes(search) ||
                user.nationality?.toLowerCase().includes(search) ||
                user.role?.toLowerCase().includes(search) ||
                user.username?.toLowerCase().includes(search) ||
                false
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
                <div>
                    <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Total: {users.length} users
                    </p>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded px-3 py-1 text-gray-900 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 w-64"
                    />
                    <button
                        onClick={fetchUsers}
                        className="bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 px-4 py-1 rounded text-sm transition-colors"
                        title="Refresh list"
                    >
                        ↻
                    </button>
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
                                    Loading users...
                                </td>
                            </tr>
                        ) : table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="p-8 text-center text-gray-500">
                                    No users found.
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
                    Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{' '}
                    {Math.min(
                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                        table.getFilteredRowModel().rows.length
                    )}{' '}
                    of {table.getFilteredRowModel().rows.length} users
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


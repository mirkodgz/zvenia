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
    country: string | null; // Added country
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
    const [roles, setRoles] = useState<string[]>([]);
    const [countries, setCountries] = useState<{ id: number; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalUsers, setTotalUsers] = useState(0); // Added totalUsers
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 }); // Lifted pagination state
    const [sorting, setSorting] = useState<SortingState>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<{ role: string; country: string }>({
        role: 'Basic',
        country: ''
    });

    const supabase = createBrowserClient(
        import.meta.env.PUBLIC_SUPABASE_URL!,
        import.meta.env.PUBLIC_SUPABASE_ANON_KEY!
    );

    // Initial load
    useEffect(() => {
        fetchRoles();
        fetchCountries();
    }, []);

    // Debounced Search and Pagination Effect
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, pagination.pageIndex, pagination.pageSize]);

    const fetchCountries = async () => {
        try {
            const response = await fetch('/api/countries');
            if (response.ok) {
                const data = await response.json();
                setCountries(data);
            }
        } catch (error) {
            console.error("Error fetching countries:", error);
        }
    };

    const fetchRoles = async () => {
        const { data, error } = await supabase
            .from('user_roles')
            .select('role_name')
            .order('role_name');

        if (data) {
            setRoles(data.map(r => r.role_name));
        } else {
            console.error("Error fetching roles:", error);
            setRoles(ROLES_FALLBACK);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Use current state values
            const queryParams = new URLSearchParams({
                page: pagination.pageIndex.toString(),
                pageSize: pagination.pageSize.toString(),
                search: searchTerm // Pass search term to API
            });

            const response = await fetch(`/api/admin/users/list?${queryParams}`, {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to fetch users');

            setUsers(result.users);
            setTotalUsers(result.total); // Update total count
        } catch (err: any) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            const response = await fetch(`/api/admin/users/action?id=${id}`, { method: 'DELETE' });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete');
            }
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
            country: user.country || ''
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ role: 'Basic', country: '' });
    };

    const saveEdit = async (id: string) => {
        try {
            const response = await fetch('/api/admin/users/action', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: id,
                    role: editForm.role,
                    country: editForm.country || null
                }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to update user');

            alert("Success! User updated.");
            setUsers(users.map(u =>
                u.id === id
                    ? { ...u, role: editForm.role, country: editForm.country || null }
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
            case 'Administrator': return 'border-red-500/30 bg-red-500/10 text-red-400';
            case 'CountryManager': return 'border-blue-500/30 bg-blue-500/10 text-blue-400';
            case 'Expert': return 'border-purple-500/30 bg-purple-500/10 text-purple-400';
            case 'Ads': return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400';
            case 'Events': return 'border-green-500/30 bg-green-500/10 text-green-400';
            default: return 'border-gray-500/30 bg-gray-500/10 text-gray-400';
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
                accessorKey: 'country',
                header: 'Country',
                cell: ({ row }) => {
                    const user = row.original;
                    if (editingId === user.id) {
                        return (
                            <select
                                value={editForm.country}
                                onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                                className="bg-white border border-primary-500 rounded px-2 py-1 text-gray-900 outline-none text-sm w-48"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <option value="">Select Country...</option>
                                {countries.map((c) => (
                                    <option key={c.id} value={c.name}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        );
                    }
                    return (
                        <span className="text-gray-600 text-sm">
                            {user.country || user.nationality || '-'}
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
        pageCount: Math.ceil(totalUsers / (pagination.pageSize || 20)) || -1,
        state: {
            sorting,
            pagination, // Controlled pagination
        },
        manualPagination: true,
        manualFiltering: true,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Total: {totalUsers} users
                    </p>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-gray-5 border border-gray-200 rounded px-3 py-1 text-gray-900 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 w-64"
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
                        totalUsers
                    )}{' '}
                    of {totalUsers} users
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

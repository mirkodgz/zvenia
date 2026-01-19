
import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

// Define Role Options
const ROLES = ['Administrator', 'CountryManager', 'Ads', 'Events', 'Expert', 'Basic'];

interface Profile {
    id: string;
    email: string;
    full_name: string;
    role: string;
    country: string | null;
    avatar_url: string | null;
}

export default function UserManagement() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    // Edit Form State
    const [editForm, setEditForm] = useState<{ role: string; country: string }>({ role: 'Basic', country: '' });

    // Client-side Supabase for Admin actions (Policies allow this for Admin role)
    const supabase = createBrowserClient(
        import.meta.env.PUBLIC_SUPABASE_URL!,
        import.meta.env.PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100); // Pagination can be added later

        if (error) {
            console.error('Error fetching users:', error);
            alert('Error fetching users');
        } else {
            setUsers(data || []);
        }
        setLoading(false);
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .ilike('email', `%${searchTerm}%`)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error searching users:', error);
        } else {
            setUsers(data || []);
        }
        setLoading(false);
    };

    const startEdit = (user: Profile) => {
        setEditingId(user.id);
        setEditForm({ role: user.role || 'Basic', country: user.country || '' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ role: 'Basic', country: '' });
    };

    const saveEdit = async (id: string) => {
        const { error } = await supabase
            .from('profiles')
            .update({
                role: editForm.role,
                country: editForm.country || null
            })
            .eq('id', id);

        if (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update user: ' + error.message);
        } else {
            // Update local state
            setUsers(users.map(u => u.id === id ? { ...u, role: editForm.role, country: editForm.country || null } : u));
            setEditingId(null);
        }
    };

    return (
        <div className="bg-[#1A1A1A] rounded-lg border border-white/10 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">User Management</h2>
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-black/20 border border-white/10 rounded px-3 py-1 text-white text-sm focus:border-primary-500 outline-none"
                    />
                    <button type="submit" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-1 rounded text-sm transition-colors">
                        Search
                    </button>
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => { setSearchTerm(''); fetchUsers(); }}
                            className="text-gray-400 hover:text-white text-sm"
                        >
                            Clear
                        </button>
                    )}
                </form>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-white/5 uppercase font-bold text-xs">
                        <tr>
                            <th className="p-3">User</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Country</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center">Loading users...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center">No users found.</td></tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-3 font-medium text-white flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs overflow-hidden">
                                            {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : user.email?.[0].toUpperCase()}
                                        </div>
                                        {user.full_name || 'N/A'}
                                    </td>
                                    <td className="p-3">{user.email}</td>

                                    {/* ROLE & COUNTRY COLUMNS: VIEW vs EDIT */}
                                    {editingId === user.id ? (
                                        <>
                                            <td className="p-3">
                                                <select
                                                    value={editForm.role}
                                                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                                    className="bg-black border border-primary-500 rounded px-2 py-1 text-white outline-none w-full"
                                                >
                                                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                                </select>
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    value={editForm.country}
                                                    onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                                                    placeholder="Country..."
                                                    className="bg-black border border-primary-500 rounded px-2 py-1 text-white outline-none w-full"
                                                />
                                            </td>
                                            <td className="p-3 text-right flex justify-end gap-2">
                                                <button onClick={() => saveEdit(user.id)} className="text-green-400 hover:text-green-300">Save</button>
                                                <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-400">Cancel</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded text-xs border ${user.role === 'Administrator' ? 'border-red-500/30 bg-red-500/10 text-red-400' :
                                                        user.role === 'CountryManager' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' :
                                                            user.role === 'Expert' ? 'border-purple-500/30 bg-purple-500/10 text-purple-400' :
                                                                'border-gray-500/30 bg-gray-500/10 text-gray-400'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-3">{user.country || '-'}</td>
                                            <td className="p-3 text-right">
                                                <button
                                                    onClick={() => startEdit(user)}
                                                    className="text-primary-400 hover:text-primary-300 font-medium"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

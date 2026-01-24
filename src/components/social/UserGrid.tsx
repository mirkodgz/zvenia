import React, { useState, useEffect, useRef } from 'react';
import UserCard from './UserCard';
import { Search, Filter, Globe } from 'lucide-react';

interface UserProfile {
    id: string;
    profile_slug: string | null;
    full_name: string | null;
    email: string;
    avatar_url: string | null;
    profession: string | null;
    created_at: string;
    role: string | null;
    nationality: string | null;
}

const ROLES = ["Expert", "CountryManager", "Administrator", "User"];

const UserGrid = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [countries, setCountries] = useState<{ id: string, name: string }[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);

    // Filters
    const [search, setSearch] = useState("");
    const [country, setCountry] = useState("All");
    const [role, setRole] = useState("All");

    const loaderRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch countries
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const res = await fetch('/api/countries');
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

    const loadUsers = async (pageNum: number, isNewFilter = false) => {
        if (loading) return;
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: pageNum.toString(),
                limit: "12",
                ...(search && { search }),
                ...(country !== "All" && { country }),
                ...(role !== "All" && { role })
            });

            const res = await fetch(`/api/users?${queryParams}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();

            if (isNewFilter || pageNum === 1) {
                setUsers(data.users);
            } else {
                setUsers(prev => {
                    // Prevent duplicates
                    const existingIds = new Set(prev.map(u => u.id));
                    const newUsers = data.users.filter((u: UserProfile) => !existingIds.has(u.id));
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

    // Handle filter changes
    useEffect(() => {
        // Debounce search
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

    // Infinite observer
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

    return (
        <div>
            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                            style={{ paddingLeft: '3rem' }}
                        />
                    </div>

                    {/* Role Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-white cursor-pointer"
                            style={{ paddingLeft: '3rem' }}
                        >
                            <option value="All">All Roles</option>
                            {ROLES.map(r => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>

                    {/* Country Filter */}
                    <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                        <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-white cursor-pointer"
                            style={{ paddingLeft: '3rem' }}
                        >
                            <option value="All">All Countries</option>
                            {countries.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Total Count Header */}
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-dark inline-flex items-center gap-2">
                    Total Users: <span className="text-green-600">{total}</span>
                </h2>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {users.map((user) => (
                    <div key={user.id} className="animate-in fade-in zoom-in-95 duration-300">
                        <UserCard user={user} />
                    </div>
                ))}
            </div>
            <div ref={loaderRef} className="py-12 text-center w-full">
                {loading && (
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                )}
                {!hasMore && users.length > 0 && (
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                        <span>✓</span> All users loaded
                    </div>
                )}
                {!loading && users.length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                        <Search className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-lg font-medium">No users found matching filters.</p>
                        <button
                            onClick={() => { setSearch(""); setCountry("All"); setRole("All"); }}
                            className="mt-4 text-green-600 hover:underline text-sm font-semibold"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserGrid;

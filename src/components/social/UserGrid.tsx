import React, { useState, useEffect, useRef } from 'react';
import UserCard from './UserCard';
import { Search, Filter, Globe, X, ChevronDown, Check } from 'lucide-react';

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

    // Dropdown States
    const [isCountryOpen, setIsCountryOpen] = useState(false);
    const [countrySearch, setCountrySearch] = useState("");
    const [isRoleOpen, setIsRoleOpen] = useState(false);

    const loaderRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const countryRef = useRef<HTMLDivElement>(null);
    const roleRef = useRef<HTMLDivElement>(null);

    // Click outside handler logic
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
                setIsCountryOpen(false);
            }
            if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
                setIsRoleOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

    const clearFilters = () => {
        setSearch("");
        setCountry("All");
        setRole("All");
        setCountrySearch("");
    };

    // Filtered countries list for dropdown
    const filteredCountries = countries.filter(c =>
        c.name.toLowerCase().includes(countrySearch.toLowerCase())
    );

    return (
        <div>
            {/* Filters Bar */}
            <div className="bg-white p-3 md:p-4 rounded-none shadow-sm border border-gray-200 mb-4 md:mb-8 animate-in fade-in slide-in-from-top-4 duration-500 relative z-20">
                <div className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-4 items-center">

                    {/* Search */}
                    <div className="relative col-span-2 md:col-span-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pr-4 py-2 border border-gray-300 rounded-none focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                            style={{ paddingLeft: '3rem' }}
                        />
                    </div>

                    {/* Role Filter - Custom Dropdown (No Search) */}
                    <div className="relative col-span-1 md:col-span-3" ref={roleRef}>
                        <div
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-none focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 bg-white cursor-pointer flex items-center justify-between"
                            onClick={() => setIsRoleOpen(!isRoleOpen)}
                        >
                            <Filter className="absolute left-3 text-gray-400 w-5 h-5" />
                            <span className={`truncate ${role === "All" ? "text-gray-500" : "text-gray-900"}`}>
                                {role === "All" ? "All Roles" : role}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isRoleOpen ? "rotate-180" : ""}`} />
                        </div>

                        {/* Dropdown Menu */}
                        {isRoleOpen && (
                            <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 shadow-lg z-50 flex flex-col">
                                <div className="py-1">
                                    <div
                                        className={`px-4 py-2 hover:bg-green-50 cursor-pointer text-sm flex items-center justify-between ${role === "All" ? "bg-green-50 text-green-700 font-medium" : "text-gray-700"}`}
                                        onClick={() => { setRole("All"); setIsRoleOpen(false); }}
                                    >
                                        All Roles
                                        {role === "All" && <Check className="w-4 h-4" />}
                                    </div>
                                    {ROLES.map(r => (
                                        <div
                                            key={r}
                                            className={`px-4 py-2 hover:bg-green-50 cursor-pointer text-sm flex items-center justify-between ${role === r ? "bg-green-50 text-green-700 font-medium" : "text-gray-700"}`}
                                            onClick={() => { setRole(r); setIsRoleOpen(false); }}
                                        >
                                            {r}
                                            {role === r && <Check className="w-4 h-4" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Country Filter - Custom Searchable Dropdown */}
                    <div className="relative col-span-1 md:col-span-3" ref={countryRef}>
                        <div
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-none focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 bg-white cursor-pointer flex items-center justify-between"
                            onClick={() => setIsCountryOpen(!isCountryOpen)}
                        >
                            <Globe className="absolute left-3 text-gray-400 w-5 h-5" />
                            <span className={`truncate ${country === "All" || country === "NoCountry" ? "text-gray-500" : "text-gray-900"}`}>
                                {country === "All" ? "All Countries" : country === "NoCountry" ? "No Country Assigned" : country}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCountryOpen ? "rotate-180" : ""}`} />
                        </div>

                        {/* Dropdown Menu */}
                        {isCountryOpen && (
                            <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 shadow-lg z-50 max-h-60 flex flex-col">
                                <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
                                    <input
                                        type="text"
                                        placeholder="Search country..."
                                        className="w-full px-2 py-1 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-green-500"
                                        value={countrySearch}
                                        onChange={(e) => setCountrySearch(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        autoFocus
                                    />
                                </div>
                                <div className="overflow-y-auto flex-1">
                                    <div
                                        className={`px-4 py-2 hover:bg-green-50 cursor-pointer text-sm flex items-center justify-between ${country === "All" ? "bg-green-50 text-green-700 font-medium" : "text-gray-700"}`}
                                        onClick={() => { setCountry("All"); setIsCountryOpen(false); }}
                                    >
                                        All Countries
                                        {country === "All" && <Check className="w-4 h-4" />}
                                    </div>
                                    <div
                                        className={`px-4 py-2 hover:bg-green-50 cursor-pointer text-sm flex items-center justify-between ${country === "NoCountry" ? "bg-green-50 text-green-700 font-medium" : "text-gray-700"}`}
                                        onClick={() => { setCountry("NoCountry"); setIsCountryOpen(false); }}
                                    >
                                        No Country Assigned
                                        {country === "NoCountry" && <Check className="w-4 h-4" />}
                                    </div>
                                    {filteredCountries.length > 0 ? (
                                        filteredCountries.map(c => (
                                            <div
                                                key={c.id}
                                                className={`px-4 py-2 hover:bg-green-50 cursor-pointer text-sm flex items-center justify-between ${country === c.name ? "bg-green-50 text-green-700 font-medium" : "text-gray-700"}`}
                                                onClick={() => { setCountry(c.name); setIsCountryOpen(false); }}
                                            >
                                                {c.name}
                                                {country === c.name && <Check className="w-4 h-4" />}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-gray-400 text-sm text-center">No results found</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Clear Filters Button */}
                    <div className="col-span-2 md:col-span-2 flex justify-end">
                        {(search || country !== "All" || role !== "All") && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors px-2 py-1"
                                title="Clear all filters"
                            >
                                <X className="w-4 h-4" />
                                <span className="hidden md:inline">Clear</span>
                            </button>
                        )}
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {users.map((user) => (
                    <div key={user.id} className="animate-in fade-in zoom-in-95 duration-300">
                        <UserCard user={user} />
                    </div>
                ))}
            </div>
            <div ref={loaderRef} className="py-12 text-center w-full">
                {loading && (
                    <div className="inline-block animate-spin rounded-none h-8 w-8 border-b-2 border-green-600"></div>
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
                            onClick={clearFilters}
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

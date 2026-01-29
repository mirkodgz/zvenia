import React, { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { formatDistanceToNow } from "date-fns";

// Types
interface ActivityItem {
    id: string;
    title: string;
    slug: string;
    created_at: string;
    published_at?: string;
    profiles: {
        full_name: string | null;
        avatar_url: string | null;
    } | null;
    topics: {
        name: string;
    } | null;
}

export default function RecentActivity() {
    const [isOpen, setIsOpen] = useState(false);
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const ITEMS_PER_PAGE = 10;

    // Toggle Dropdown
    const toggleDropdown = () => setIsOpen(!isOpen);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch Data
    const fetchActivities = useCallback(async (pageNum: number) => {
        try {
            setLoading(true);
            const from = pageNum * ITEMS_PER_PAGE;
            const to = from + ITEMS_PER_PAGE - 1;

            const { data, error } = await supabase
                .from("posts")
                .select(`
          id,
          title,
          slug,
          created_at,
          published_at,
          profiles (full_name, avatar_url),
          topics (name)
        `)
                .order("created_at", { ascending: false })
                .range(from, to);

            if (error) throw error;

            if (data) {
                setActivities((prev) => (pageNum === 0 ? data : [...prev, ...data]));
                if (data.length < ITEMS_PER_PAGE) {
                    setHasMore(false);
                }
            }
        } catch (err) {
            console.error("Error fetching activities:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial Fetch when opened
    useEffect(() => {
        if (isOpen && activities.length === 0) {
            fetchActivities(0);
        }
    }, [isOpen]);

    // Load More Handler
    const loadMore = () => {
        setPage((prev) => {
            const nextPage = prev + 1;
            fetchActivities(nextPage);
            return nextPage;
        });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={toggleDropdown}
                className={`cursor-pointer transition-colors p-2 rounded-none ${isOpen ? "text-white bg-white/10" : "text-gray-300 hover:text-white"
                    }`}
                aria-label="Recent Activity"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    ></path>
                </svg>
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute left-0 mt-2 w-[400px] bg-white rounded-none shadow-xl overflow-hidden z-50 border border-gray-100 origin-top-left">
                    {/* Header (Optional, maybe not needed per request, but good for structure) */}
                    {/* <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-700">Recent Activity</h3>
            </div> */}

                    <div
                        className="max-h-[500px] overflow-y-auto"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        <style>{`
                            .overflow-y-auto::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>
                        {activities.length === 0 && !loading && (
                            <div className="p-4 text-center text-gray-500 text-sm">No recent activity.</div>
                        )}

                        {activities.map((item) => (
                            <a
                                key={item.id}
                                href={`/post/${item.slug}`}
                                className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 group"
                            >
                                {/* Left: Avatar */}
                                <div className="shrink-0 pt-1">
                                    {item.profiles?.avatar_url ? (
                                        <div className="w-10 h-10 rounded-none bg-gray-200 overflow-hidden">
                                            <img
                                                src={item.profiles.avatar_url}
                                                alt={item.profiles.full_name || "User"}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-none bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-lg">
                                            {(item.profiles?.full_name?.[0] || "?").toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                {/* Right: Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        {/* Topic Tag */}
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-none text-xs font-medium bg-gray-100 text-gray-600">
                                            {item.topics?.name || "General"}
                                        </span>
                                        {/* Time Ago */}
                                        <span className="text-xs text-gray-400 shrink-0 ml-2">
                                            {new Date(item.published_at || item.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {/* Author Name */}
                                    <p className="text-xs font-semibold text-gray-800 mb-0.5 truncate">
                                        {item.profiles?.full_name || "Unknown User"}
                                    </p>

                                    {/* Title (Upper case as per screenshot style often seen in mining logs, or just normal title) */}
                                    <h4 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-primary-600 transition-colors">
                                        {item.title}
                                    </h4>
                                </div>
                            </a>
                        ))}

                        {/* Loading Indicator */}
                        {loading && (
                            <div className="p-4 text-center">
                                <div className="inline-block w-5 h-5 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin"></div>
                            </div>
                        )}

                        {/* Load More Button */}
                        {!loading && hasMore && (
                            <button
                                onClick={loadMore}
                                className="w-full py-3 text-xs font-semibold text-gray-500 hover:text-primary-600 hover:bg-gray-50 transition-colors border-t border-gray-100 uppercase tracking-wider"
                            >
                                View More
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

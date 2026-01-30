import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { MoreHorizontal, MapPin, Edit2, Trash2 } from 'lucide-react';

interface AdsListProps {
    currentUser: any;
    refreshTrigger?: number;
    onEdit?: (ad: any) => void;
}

export default function AdsList({ currentUser, refreshTrigger, onEdit }: AdsListProps) {
    const [ads, setAds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openMenuId && !(event.target as Element).closest('.ads-menu-container')) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openMenuId]);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this AD?')) return;

        try {
            const { error } = await supabase.from('ads').delete().eq('id', id);
            if (error) throw error;

            // Optimistic update
            setAds(prev => prev.filter(ad => ad.id !== id));
        } catch (error: any) {
            console.error('Error deleting ad:', error);
            alert('Error deleting: ' + error.message);
        }
    };

    useEffect(() => {
        const fetchAds = async () => {
            setLoading(true);
            try {
                // Filter logic: If Country Manager, should ideally ensure they only see their country's ads
                // But for "MY Ads Manager Space", fetching all created by DB logic is fine for now
                let query = supabase
                    .from('ads')
                    .select('*')
                    .order('created_at', { ascending: false });

                // Optional: Client-side filter or RLS handles it. 
                // For safety, if user is CountryManager, we could filter by location:
                if (currentUser.role === 'CountryManager' && currentUser.work_country) {
                    query = query.eq('location', currentUser.work_country);
                }

                const { data, error } = await query;

                if (error) throw error;
                setAds(data || []);
            } catch (error) {
                console.error('Error fetching ads:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAds();
    }, [currentUser, refreshTrigger]);

    if (loading) {
        return <div className="text-center py-12 text-gray-500">Loading ads...</div>;
    }

    if (ads.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                <p className="text-gray-500 font-medium">No active ads found.</p>
                <p className="text-sm text-gray-400">Create your first ad using the form above.</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-6 uppercase tracking-tight">
                My ADS Manager Space
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {ads.map((ad) => (
                    <div key={ad.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
                        {/* Image Area */}
                        <div className="relative aspect-4/3 bg-gray-100">
                            {ad.image_url ? (
                                <img
                                    src={ad.image_url}
                                    alt={ad.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <span className="text-xs">No Image</span>
                                </div>
                            )}

                            {/* Menu Button (Top Right) */}
                            <div className="absolute top-2 right-2 ads-menu-container">
                                <button
                                    onClick={() => setOpenMenuId(openMenuId === ad.id ? null : ad.id)}
                                    className="p-1 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors backdrop-blur-sm"
                                >
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>

                                {openMenuId === ad.id && (
                                    <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                                        <button
                                            onClick={() => {
                                                if (onEdit) onEdit(ad);
                                                setOpenMenuId(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                        >
                                            <Edit2 className="w-3 h-3" /> Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleDelete(ad.id);
                                                setOpenMenuId(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <Trash2 className="w-3 h-3" /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-4 flex flex-col grow">
                            <h3 className="font-bold text-gray-900 text-[15px] leading-tight mb-2 line-clamp-2">
                                {ad.title}
                            </h3>
                            {ad.content && (
                                <p className="text-sm text-gray-600 line-clamp-3 grow">
                                    {ad.content}
                                </p>
                            )}

                            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                                <span className="uppercase font-medium text-gray-400 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {ad.location || 'Global'}
                                </span>
                                <span>{new Date(ad.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

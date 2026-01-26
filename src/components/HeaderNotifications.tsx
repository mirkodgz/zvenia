import React, { useEffect, useState } from 'react';
import { Bell, Heart, MessageSquare, UserPlus, Info } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Notification } from '@/types/notifications'; // Using our temporary types

interface HeaderNotificationsProps {
    currentUserId?: string;
    sessionAccessToken?: string;
}

export default function HeaderNotifications({ currentUserId, sessionAccessToken }: HeaderNotificationsProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUserId) {
            fetchNotifications();
        }
        // Optional: Set up realtime subscription here later
    }, [currentUserId]);

    const fetchNotifications = async () => {
        try {
            console.log("🔔 [HeaderNotifications] Checking props user:", currentUserId);
            if (!currentUserId) return;

            // "Nuclear Option": Use isolated client if token is present
            let effectiveClient = supabase;
            if (sessionAccessToken) {
                const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
                const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

                effectiveClient = createClient(supabaseUrl, supabaseKey, {
                    global: {
                        headers: {
                            Authorization: `Bearer ${sessionAccessToken}`
                        }
                    }
                });
            }

            const { data, error } = await effectiveClient
                .from('notifications')
                .select('*')
                .eq('user_id', currentUserId)
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) {
                console.error('🔔 [HeaderNotifications] Error fetching:', error);
                return;
            }

            console.log("🔔 [HeaderNotifications] Data received:", data?.length, "rows");

            if (data) {
                // Cast data to our Notification type
                setNotifications(data as unknown as Notification[]);
                setUnreadCount(data.filter((n: any) => !n.is_read).length);
            }
        } catch (err) {
            console.error('🔔 [HeaderNotifications] Unexpected error:', err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id?: string) => {
        if (!currentUserId) return;

        // "Nuclear Option": Use isolated client if token is present
        let effectiveClient = supabase;
        if (sessionAccessToken) {
            const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
            const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

            effectiveClient = createClient(supabaseUrl, supabaseKey, {
                global: {
                    headers: {
                        Authorization: `Bearer ${sessionAccessToken}`
                    }
                }
            });
        }

        let query = (effectiveClient
            .from('notifications') as any)
            .update({ is_read: true } as any)
            .eq('user_id', currentUserId);

        if (id) {
            query = query.eq('id', id);
        } else {
            // Mark all as read
            query = query.eq('is_read', false);
        }

        await query;
        fetchNotifications(); // Refresh list
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="relative text-gray-300 hover:text-white transition-colors focus:outline-none mr-2">
                    <Bell className="w-6 h-6" />
                    {/* Notification Badge */}
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-primary-500">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white border border-gray-200 shadow-lg mt-2 max-h-[80vh] overflow-y-auto">
                <DropdownMenuLabel className="font-semibold text-gray-900 border-b border-gray-100 pb-2 flex justify-between items-center">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                markAsRead();
                            }}
                            className="text-xs font-normal text-green-600 hover:text-green-700 cursor-pointer"
                        >
                            Mark all read
                        </button>
                    )}
                </DropdownMenuLabel>

                <div className="py-1">
                    {loading ? (
                        <div className="p-4 text-center text-gray-500 text-sm">Loading...</div>
                    ) : notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
                    ) : (
                        notifications.map((notification, index) => {
                            let Icon = Bell;
                            let iconColor = "text-gray-400";

                            switch (notification.type) {
                                case 'like':
                                    Icon = Heart;
                                    iconColor = "text-red-500";
                                    break;
                                case 'comment':
                                    Icon = MessageSquare;
                                    iconColor = "text-blue-500";
                                    break;
                                case 'follow':
                                case 'connection_request':
                                    Icon = UserPlus;
                                    iconColor = "text-green-500";
                                    break;
                                case 'system':
                                    Icon = Info;
                                    iconColor = "text-gray-500";
                                    break;
                            }

                            return (
                                <div key={notification.id}>
                                    <DropdownMenuItem
                                        className={`cursor-pointer flex flex-col items-start gap-1 p-3 hover:bg-gray-50 ${!notification.is_read ? 'bg-green-50/50' : ''}`}
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        <div className="flex gap-3 w-full">
                                            <div className={`mt-1 ${iconColor}`}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between w-full">
                                                    <span className={`font-medium text-sm ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                                                        {notification.title}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                                        {new Date(notification.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                                                    {notification.message}
                                                </span>
                                            </div>
                                        </div>
                                    </DropdownMenuItem>
                                    {index < notifications.length - 1 && <DropdownMenuSeparator className="bg-gray-100" />}
                                </div>
                            );
                        })
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

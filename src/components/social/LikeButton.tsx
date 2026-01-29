import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { createClient } from '@supabase/supabase-js';

interface LikeButtonProps {
    contentId: string;
    contentType: 'post' | 'service' | 'event' | 'podcast';
    initialCount: number;
    currentUserId?: string;
    sessionAccessToken?: string;
}

export default function LikeButton({ contentId, contentType, initialCount, currentUserId, sessionAccessToken }: LikeButtonProps) {
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(initialCount);
    // const [loading, setLoading] = useState(false); 

    // To prevent race conditions or double clicks
    const processingRef = useRef(false);

    useEffect(() => {
        if (!currentUserId) return;
        checkIfLiked();
    }, [contentId, currentUserId]);

    const checkIfLiked = async () => {
        try {
            // Using maybeSingle to verify if the user liked this specific content
            const { data, error } = await supabase
                .from('social_likes')
                .select('id')
                .eq('user_id', currentUserId as string)
                .eq('content_type', contentType)
                .eq('content_id', contentId)
                .maybeSingle();

            if (data) {
                setLiked(true);
            }
        } catch (err) {
            console.error('Error checking like status:', err);
        }
    };

    const handleToggleLike = async () => {
        let activeUser = null;
        let effectiveClient = supabase;

        // 1. Try standard client check
        const { data: { user } } = await supabase.auth.getUser();
        activeUser = user;

        // 2. Recovery: If standard client fails but we have a token
        if (!activeUser && sessionAccessToken) {
            console.log("⚠️ Client auth lost. Using isolated client with explicit token...");

            const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
            const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

            // "Nuclear Option": Create a temporary client just for this request
            // This guarantees the Auth header is present regardless of cookie state
            effectiveClient = createClient(supabaseUrl, supabaseKey, {
                global: {
                    headers: {
                        Authorization: `Bearer ${sessionAccessToken}`
                    }
                }
            });

            // Verify the token is valid by getting user from this new client
            const { data: { user: recoveredUser } } = await effectiveClient.auth.getUser();
            activeUser = recoveredUser;
        }

        if (!activeUser) {
            console.error("Debug: No user found even with recovery.");
            alert("Please sign in to like content.");
            return;
        }

        const actorId = activeUser.id;

        if (processingRef.current) return;
        processingRef.current = true;

        // Optimistic update
        const previousLiked = liked;
        const previousCount = count;

        setLiked(!previousLiked);
        setCount(previousLiked ? previousCount - 1 : previousCount + 1);

        try {
            if (previousLiked) {
                // Unlike
                const { error } = await effectiveClient
                    .from('social_likes')
                    .delete()
                    .match({
                        user_id: actorId,
                        content_type: contentType,
                        content_id: contentId
                    } as any);

                if (error) throw error;
            } else {
                // Like
                const { error } = await effectiveClient
                    .from('social_likes')
                    .insert({
                        user_id: actorId,
                        content_type: contentType,
                        content_id: contentId
                    } as any);

                if (error) throw error;
            }
        } catch (err) {
            console.error('Error toggling like:', err);
            // Revert on error
            setLiked(previousLiked);
            setCount(previousCount);
            // ALERT THE REAL ERROR to debug
            alert(`Error: ${(err as any).message || "Unknown error"}`);
        } finally {
            processingRef.current = false;
        }
    };

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                handleToggleLike();
            }}
            className={`flex items-center gap-1.5 transition-colors group text-[15px] font-medium ${liked ? 'text-green-500' : 'hover:text-green-500'}`}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ${liked ? 'fill-current' : 'group-hover:fill-current'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Like {count > 0 && `(${count})`}
        </button>
    );
}

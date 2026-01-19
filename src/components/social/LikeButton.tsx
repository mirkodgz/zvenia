import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';

interface LikeButtonProps {
    contentId: string;
    contentType: 'post' | 'service' | 'event' | 'podcast';
    initialCount: number;
    currentUserId?: string;
}

export default function LikeButton({ contentId, contentType, initialCount, currentUserId }: LikeButtonProps) {
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(initialCount);
    const [loading, setLoading] = useState(false);

    // To prevent race conditions or double clicks
    const processingRef = useRef(false);

    useEffect(() => {
        if (!currentUserId) return;
        checkIfLiked();
    }, [contentId, currentUserId]);

    const checkIfLiked = async () => {
        try {
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
        if (!currentUserId) {
            alert("Please sign in to like content.");
            return;
        }
        if (processingRef.current) return;

        // DEBUG: Check Auth status
        const { data: { user } } = await supabase.auth.getUser();
        console.log("DEBUG: Like Button Click");
        console.log("  - Prop currentUserId:", currentUserId);
        console.log("  - Client User ID:", user?.id);

        if (!user || user.id !== currentUserId) {
            console.warn("  - MISMATCH OR NO SESSION!");
            alert("Session mismatch. Please refresh or relogin.");
            return;
        }

        processingRef.current = true;

        // Optimistic update
        const previousLiked = liked;
        const previousCount = count;

        setLiked(!previousLiked);
        setCount(previousLiked ? previousCount - 1 : previousCount + 1);

        try {
            if (previousLiked) {
                // Unlike
                const { error } = await supabase
                    .from('social_likes')
                    .delete()
                    .match({
                        user_id: currentUserId,
                        content_type: contentType,
                        content_id: contentId
                    } as any);

                if (error) throw error;
            } else {
                // Like
                const { error } = await supabase
                    .from('social_likes')
                    .insert({
                        user_id: currentUserId,
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
            alert("Could not update like. Please try again.");
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
            className={`flex items-center gap-1.5 transition-colors group text-xs font-medium ${liked ? 'text-green-400' : 'hover:text-green-400'}`}
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

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';

interface FollowButtonProps {
    targetUserId: string;
    currentUserId?: string;
}

// v1.1
export default function FollowButton({ targetUserId, currentUserId }: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Safety check to prevent following yourself
    const isSelf = targetUserId === currentUserId;
    const processingRef = useRef(false);

    useEffect(() => {
        if (!currentUserId || isSelf) {
            setLoading(false);
            return;
        }
        checkFollowStatus();

        // Safety timeout
        const timer = setTimeout(() => setLoading(false), 3000);
        return () => clearTimeout(timer);
    }, [targetUserId, currentUserId]);

    const checkFollowStatus = async () => {
        try {
            const { data, error } = await supabase
                .from('social_connections')
                .select('id')
                .eq('follower_id', currentUserId as string)
                .eq('following_id', targetUserId)
                .maybeSingle();

            if (data) {
                setIsFollowing(true);
            }
        } catch (err) {
            console.error('Error checking follow status:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFollow = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!currentUserId) {
            alert("Please sign in to follow users.");
            return;
        }
        if (processingRef.current) return;

        processingRef.current = true;

        // Optimistic UI
        const previousState = isFollowing;
        setIsFollowing(!previousState);

        try {
            if (previousState) {
                // Unfollow
                const { error } = await supabase
                    .from('social_connections')
                    .delete()
                    .match({
                        follower_id: currentUserId,
                        following_id: targetUserId
                    } as any);

                if (error) throw error;
            } else {
                // Follow
                const { error } = await supabase
                    .from('social_connections')
                    .insert({
                        follower_id: currentUserId,
                        following_id: targetUserId
                    } as any);

                if (error) throw error;
            }
        } catch (err) {
            console.error('Error toggling follow:', err);
            setIsFollowing(previousState); // Revert
            alert("Could not update connection. Please try again.");
        } finally {
            processingRef.current = false;
        }
    };

    if (loading || isSelf) return null;

    if (isFollowing) {
        return (
            <button
                onClick={handleToggleFollow}
                className="text-xs text-gray-600 hover:text-red-600 font-semibold ml-2 px-2 py-0.5 rounded border border-gray-300 hover:border-red-300 bg-white hover:bg-red-50 transition-all cursor-pointer"
                title="Remove Connection"
            >
                Connected
            </button>
        );
    }

    return (
        <button
            onClick={handleToggleFollow}
            className="text-xs text-primary-600 hover:text-primary-700 font-semibold ml-2 px-2.5 py-1 rounded border border-primary-300 hover:border-primary-400 bg-primary-50 hover:bg-primary-100 transition-all flex items-center gap-1.5"
            title="Connect with this user"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
            Connect
        </button>
    );
}

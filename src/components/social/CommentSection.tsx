import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Comment {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles: {
        username: string;
        full_name: string;
        avatar_url: string | null;
    };
}

interface CommentSectionProps {
    contentId: string;
    contentType: 'post' | 'service' | 'event' | 'podcast';
    currentUserId?: string;
}

export default function CommentSection({ contentId, contentType, currentUserId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComments();

        // Optional: Realtime subscription could go here
    }, [contentId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('social_comments')
                .select(`
                    id,
                    content,
                    created_at,
                    user_id,
                    profiles (
                        username,
                        full_name,
                        avatar_url
                    )
                `)
                .eq('content_type', contentType)
                .eq('content_id', contentId)
                .order('created_at', { ascending: true }); // Oldest first for comments usually? Or newest top? Let's do oldest first (chat style) or newest first. Blog comments usually oldest first. 
            // Actually for feeds, usually newest first or "load more". Let's do Ascending (chronological).

            if (error) throw error;
            setComments(data as any || []);
        } catch (err) {
            console.error('Error fetching comments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !currentUserId) return;

        setSubmitting(true);
        try {
            const { data, error } = await supabase
                .from('social_comments')
                .insert({
                    content: newComment.trim(),
                    content_type: contentType,
                    content_id: contentId,
                    user_id: currentUserId
                } as any)
                .select()
                .single();

            if (error) throw error;

            setNewComment('');
            // Refetch to get the profile data with the new comment (or optimistic update if we had profile data in hand)
            fetchComments();
        } catch (err) {
            alert('Error posting comment');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString(undefined, {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading) return <div className="p-4 text-center text-xs text-gray-500">Loading comments...</div>;

    return (
        <div className="border-t border-[var(--border-color)] bg-[var(--bg-surface-hover)]/50">
            {/* List */}
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {comments.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center italic">No comments yet. Be the first!</p>
                ) : (
                    comments.map(c => (
                        <div key={c.id} className="flex gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                                {c.profiles?.avatar_url ? (
                                    <img src={c.profiles.avatar_url} alt={c.profiles.username} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-700 text-xs font-bold">
                                        {c.profiles?.username?.[0]?.toUpperCase() || '?'}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="bg-[var(--bg-card)] p-3 rounded-lg rounded-tl-none border border-[var(--border-color)] text-sm shadow-sm">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="font-semibold text-[var(--text-main)] text-xs">{c.profiles?.full_name || 'Unknown'}</span>
                                        <span className="text-[10px] text-gray-400">{formatDate(c.created_at)}</span>
                                    </div>
                                    <p className="text-[var(--text-secondary)] whitespace-pre-wrap">{c.content}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input */}
            {currentUserId ? (
                <form onSubmit={handleSubmit} className="p-3 border-t border-[var(--border-color)] flex gap-2">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-full px-4 py-2 text-sm focus:outline-none focus:border-green-500 transition-colors"
                        disabled={submitting}
                    />
                    <button
                        type="submit"
                        disabled={submitting || !newComment.trim()}
                        className="bg-green-500 hover:bg-green-600 text-white w-8 h-8 flex items-center justify-center rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
            ) : (
                <div className="p-3 text-center border-t border-[var(--border-color)]">
                    <p className="text-xs text-gray-500">
                        Please <a href="/login" className="text-green-500 hover:underline">sign in</a> to comment.
                    </p>
                </div>
            )}
        </div>
    );
}

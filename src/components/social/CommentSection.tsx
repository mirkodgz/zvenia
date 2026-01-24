import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { createClient } from '@supabase/supabase-js';

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
    sessionAccessToken?: string;
}

export default function CommentSection({ contentId, contentType, currentUserId, sessionAccessToken }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComments();
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
                .order('created_at', { ascending: true });

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
            let effectiveClient = supabase;

            // "Nuclear Option" for Comments: Use isolated client if token is present
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
            fetchComments();
        } catch (err) {
            console.error(err);
            // ALERT THE REAL ERROR to debug
            alert(`Error posting comment: ${(err as any).message || "Unknown error"}`);
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
        <div className="border-t border-(--border-color) bg-(--bg-surface-hover)/50">
            {/* List */}
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {comments.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center italic">No comments yet. Be the first!</p>
                ) : (
                    comments.map(c => (
                        <div key={c.id} className="flex gap-3">
                            <div className="shrink-0 w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                                {c.profiles?.avatar_url ? (
                                    <img src={c.profiles.avatar_url} alt={c.profiles.username} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-700 text-xs font-bold">
                                        {c.profiles?.username?.[0]?.toUpperCase() || '?'}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="bg-(--bg-card) p-3 rounded-lg rounded-tl-none border border-(--border-color) text-sm shadow-sm">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="font-semibold text-(--text-main) text-xs">{c.profiles?.full_name || 'Unknown'}</span>
                                        <span className="text-[10px] text-gray-400">{formatDate(c.created_at)}</span>
                                    </div>
                                    <p className="text-(--text-secondary) whitespace-pre-wrap">{c.content}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input */}
            {currentUserId ? (
                <form onSubmit={handleSubmit} className="p-3 border-t border-(--border-color) flex gap-2">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 bg-(--bg-main) border border-(--border-color) rounded-full px-4 py-2 text-sm focus:outline-none focus:border-green-500 transition-colors"
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
                <div className="p-3 text-center border-t border-(--border-color)">
                    <p className="text-xs text-gray-500">
                        Please <a href="/login" className="text-green-500 hover:underline">sign in</a> to comment.
                    </p>
                </div>
            )}
        </div>
    );
}

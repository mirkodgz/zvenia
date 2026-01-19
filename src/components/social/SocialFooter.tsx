import React, { useState } from 'react';
import LikeButton from './LikeButton';
import ShareOptions from './ShareOptions';
import CommentSection from './CommentSection';

interface SocialFooterProps {
    postId: string;
    postSlug: string;
    postTitle: string;
    likesCount: number;
    commentsCount: number;
    currentUserId?: string;
}

export default function SocialFooter({
    postId,
    postSlug,
    postTitle,
    likesCount,
    commentsCount,
    currentUserId
}: SocialFooterProps) {
    const [showComments, setShowComments] = useState(false);
    const [localCommentsCount, setLocalCommentsCount] = useState(commentsCount);

    return (
        <div className="flex flex-col">
            {/* Action Bar */}
            <div className="px-4 py-3 bg-[var(--bg-surface-hover)] border-t border-[var(--border-color)] flex justify-between items-center text-[var(--text-secondary)]">
                {/* Left: Interactions */}
                <div className="flex gap-6 text-xs font-medium">
                    <LikeButton
                        contentId={postId}
                        contentType="post"
                        initialCount={likesCount}
                        currentUserId={currentUserId}
                    />

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className={`flex items-center gap-1.5 transition-colors ${showComments ? 'text-blue-400' : 'hover:text-blue-400'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Comment {localCommentsCount > 0 && `(${localCommentsCount})`}
                    </button>
                </div>

                {/* Right: Share */}
                <div>
                    <ShareOptions
                        slug={postSlug}
                        title={postTitle}
                        postId={postId}
                    />
                </div>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="animate-fade-in">
                    <CommentSection
                        contentId={postId}
                        contentType="post"
                        currentUserId={currentUserId}
                    />
                </div>
            )}
        </div>
    );
}

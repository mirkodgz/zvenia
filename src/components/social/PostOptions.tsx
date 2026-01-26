
import React, { useState, useRef, useEffect } from 'react';

interface PostOptionsProps {
    postId: string;
    authorId: string;
    currentUserId: string | undefined;
    currentUserRole?: string;
    slug?: string;
}

export default function PostOptions({ postId, authorId, currentUserId, currentUserRole, slug }: PostOptionsProps) {
    console.log(`[PostOptions Debug] Post: ${postId}, User: ${currentUserId}, Role: ${currentUserRole}`);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const canEdit = currentUserId === authorId || currentUserRole === 'Administrator';

    if (!canEdit) return null;

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this post? This cannot be undone.")) return;

        try {
            const response = await fetch('/api/content/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId })
            });

            if (response.ok) {
                alert("Post deleted.");
                if (window.location.pathname.includes('/post/')) {
                    window.location.href = '/';
                } else {
                    window.location.reload();
                }
            } else {
                alert("Failed to delete post.");
            }
        } catch (e) {
            console.error("Delete error", e);
            alert("Error deleting post.");
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Prevent navigating to post detail if inside a clickable card
                    setIsOpen(!isOpen);
                }}
                className="text-(--text-secondary) hover:text-(--text-main) p-1 rounded-full hover:bg-(--bg-surface-hover) transition-colors"
                title="Options"
            >
                {/* Three dots vertical icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-(--bg-card) rounded-md shadow-lg py-1 border border-(--border-color) z-50 overflow-hidden animate-fade-in">
                    {/* Edit/Delete - Author Only */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                            const returnTo = encodeURIComponent(window.location.pathname);
                            window.location.href = `/dashboard/posts/edit/${postId}?returnTo=${returnTo}`;
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-(--text-secondary) hover:bg-(--bg-surface-hover) hover:text-(--text-main) flex items-center gap-2"
                    >
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        Edit Post
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        Delete Post
                    </button>
                </div>
            )
            }
        </div>
    );
}

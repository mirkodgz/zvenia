
import React, { useState, useRef, useEffect } from 'react';

interface PodcastOptionsProps {
    podcastId: string;
    authorId: string;
    currentUserId: string | undefined;
    slug?: string;
}

export default function PodcastOptions({ podcastId, authorId, currentUserId, slug }: PodcastOptionsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const isAuthor = currentUserId === authorId;

    // Use slug if available, otherwise fallback to ID (though ID routes might not exist, usually slug is preferred for podcasts)
    const linkSlug = slug || podcastId;

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

    // Publicly visible menu for Copy Link, so we don't hide it based on auth
    // if (!currentUserId) return null; 

    const handleCopyLink = () => {
        const url = `${window.location.origin}/podcast/${linkSlug}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            setIsOpen(false);
        });
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this podcast? This cannot be undone.")) return;

        try {
            const response = await fetch('/api/content/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ podcastId })
            });

            if (response.ok) {
                alert("Podcast deleted.");
                window.location.reload();
            } else {
                const res = await response.json();
                alert(res.error || "Failed to delete podcast.");
            }
        } catch (e) {
            console.error("Delete error", e);
            alert("Error deleting podcast.");
        }
    };

    return (
        <div className="relative z-20" ref={menuRef}>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="text-[var(--text-secondary)] hover:text-[var(--text-main)] p-1 rounded-full hover:bg-[var(--bg-card)] transition-colors bg-[var(--bg-surface)] backdrop-blur-sm"
                title="Options"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-card)] rounded-md shadow-lg py-1 border border-[var(--border-color)] overflow-hidden animate-fade-in">

                    {/* Copy Link - Everyone */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleCopyLink();
                        }}
                        className="block px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-main)] w-full text-left flex items-center gap-2 group transition-colors"
                    >
                        {copied ? (
                            <>
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                <span className="text-green-500 font-bold">Copied!</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 group-hover:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                                Copy Link
                            </>
                        )}
                    </button>

                    {/* Edit/Delete - Author Only */}
                    {isAuthor && (
                        <>
                            <div className="h-px bg-[var(--border-color)] my-1"></div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsOpen(false);
                                    window.location.href = `/dashboard/podcasts/edit/${podcastId}`;
                                }}
                                className="block px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-main)] w-full text-left flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                Edit Podcast
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDelete();
                                }}
                                className="block px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full text-left flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                Delete Podcast
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

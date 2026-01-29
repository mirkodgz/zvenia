import React, { useState, useRef, useEffect } from 'react';

interface ShareOptionsProps {
    slug: string;
    title: string;
    postId: string;
}

export default function ShareOptions({ slug, title, postId }: ShareOptionsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Build absolute URL
    const getUrl = () => {
        const path = `/post/${slug || postId}`;
        return `${window.location.origin}${path}`;
    };

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

    const handleCopyLink = () => {
        const url = getUrl();
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
                setIsOpen(false);
            }, 2000);
        });
    };

    const handleShare = (platform: 'facebook' | 'x' | 'linkedin' | 'instagram') => {
        // Instagram doesn't have a web share API, so we copy the link
        if (platform === 'instagram') {
            const url = getUrl();
            navigator.clipboard.writeText(url).then(() => {
                alert("Link copied! You can now paste it on Instagram.");
                setIsOpen(false);
            });
            return;
        }

        const url = encodeURIComponent(getUrl());
        const encodedTitle = encodeURIComponent(title);
        let shareUrl = '';

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'x':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${encodedTitle}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
            setIsOpen(false);
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setIsOpen(!isOpen);
                }}
                className={`flex items-center gap-1.5 hover:text-green-400 transition-colors ${isOpen ? 'text-green-400' : ''} text-[15px] font-medium`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
            </button>

            {isOpen && (
                <div className="absolute right-0 bottom-full mb-2 w-48 bg-(--bg-card) rounded-md shadow-lg py-1 border border-(--border-color) z-50 overflow-hidden animate-fade-in">

                    {/* Facebook */}
                    <button
                        onClick={(e) => { e.stopPropagation(); handleShare('facebook'); }}
                        className="px-4 py-2 text-sm text-(--text-secondary) hover:bg-(--bg-surface-hover) hover:text-green-400 w-full text-left flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                        Facebook
                    </button>

                    {/* X (Twitter) */}
                    <button
                        onClick={(e) => { e.stopPropagation(); handleShare('x'); }}
                        className="px-4 py-2 text-sm text-(--text-secondary) hover:bg-(--bg-surface-hover) hover:text-green-400 w-full text-left flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                        Twitter
                    </button>

                    {/* LinkedIn */}
                    <button
                        onClick={(e) => { e.stopPropagation(); handleShare('linkedin'); }}
                        className="px-4 py-2 text-sm text-(--text-secondary) hover:bg-(--bg-surface-hover) hover:text-green-400 w-full text-left flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.1-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h5v-8.311c0-4.662 5.56-5.142 5.56 2.431v5.88h5v-8.85c0-6.959-7.406-6.843-10.592-3.32v-2.14z" /></svg>
                        LinkedIn
                    </button>

                    {/* Instagram */}
                    <button
                        onClick={(e) => { e.stopPropagation(); handleShare('instagram'); }}
                        className="px-4 py-2 text-sm text-(--text-secondary) hover:bg-(--bg-surface-hover) hover:text-green-400 w-full text-left flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                        Instagram
                    </button>
                </div>
            )}
        </div>
    );
}

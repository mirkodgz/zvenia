import React, { useState, useRef, useEffect } from 'react';

interface EventOptionsProps {
    eventId: string;
    authorId: string;
    currentUserId: string | undefined;
    currentUserRole?: string;
    slug?: string;
    isPopular?: boolean;
    initialIsSaved?: boolean;
}

export default function EventOptions({ eventId, authorId, currentUserId, currentUserRole, slug, isPopular, initialIsSaved = false }: EventOptionsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [popularState, setPopularState] = useState(isPopular || false);
    const [savedState, setSavedState] = useState(initialIsSaved);
    const [justUpdated, setJustUpdated] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const canEdit = currentUserId === authorId || currentUserRole === 'Administrator' || currentUserRole === 'CountryManager';
    const linkSlug = slug || eventId;

    // ... (keep useEffect) ... 

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
        const url = `${window.location.origin}/event/${linkSlug}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            setIsOpen(false);
        });
    };

    const handleToggleSave = async () => {
        if (!currentUserId) {
            alert("Please log in to save items.");
            return;
        }

        const newState = !savedState;
        setSavedState(newState); // Optimistic

        try {
            const res = await fetch('/api/content/toggle-save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ item_id: eventId, item_type: 'event' })
            });

            if (!res.ok) {
                setSavedState(!newState); // Revert
                console.error("Failed to toggle save");
            }
        } catch (err) {
            console.error(err);
            setSavedState(!newState);
        }
    };

    const handleTogglePopular = async () => {
        const newState = !popularState;
        setPopularState(newState); // Optimistic Update
        setJustUpdated(true);

        try {
            const res = await fetch('/api/admin/toggle-popular', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: eventId, type: 'event', isPopular: newState })
            });

            if (!res.ok) {
                setPopularState(!newState); // Revert
                console.error("Failed to update popular status");
            } else {
                setTimeout(() => setJustUpdated(false), 2000);
            }
        } catch (err) {
            console.error(err);
            setPopularState(!newState);
        }
    };

    const handleDelete = async () => {
        // ... (keep existing) ...
        if (!confirm("Are you sure you want to delete this event? This cannot be undone.")) return;
        try {
            const response = await fetch('/api/content/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId }) // Polymorphic expectation
            });

            if (response.ok) {
                alert("Event deleted.");
                window.location.reload();
            } else {
                const res = await response.json();
                alert(res.error || "Failed to delete event.");
            }
        } catch (e) {
            console.error("Delete error", e);
            alert("Error deleting event.");
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
                className="text-(--text-secondary) hover:text-(--text-main) p-1 rounded-full hover:bg-(--bg-card) transition-colors bg-(--bg-surface) backdrop-blur-sm"
                title="Options"
            >
                {/* Three dots vertical icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-(--bg-card) rounded-md shadow-lg py-1 border border-(--border-color) overflow-hidden animate-fade-in text-left">

                    {/* Copy Link - Everyone */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleCopyLink();
                        }}
                        className="px-4 py-2 text-sm text-(--text-secondary) hover:bg-(--bg-surface-hover) hover:text-(--text-main) w-full text-left flex items-center gap-2 group transition-colors"
                    >
                        {copied ? (
                            <>
                                <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                <span className="text-green-500 font-bold">Copied!</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 group-hover:text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                                Copy Link
                            </>
                        )}
                    </button>

                    {/* Save Button - All Users */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSave();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-(--text-secondary) hover:bg-(--bg-surface-hover) hover:text-(--text-main) flex items-center gap-2"
                    >
                        {savedState ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary-500 fill-primary-500 shrink-0" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                                <span className="text-primary-500 font-medium">Saved</span>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                                <span>Save</span>
                            </>
                        )}
                    </button>

                    {/* Edit/Delete - Author or Admin */}
                    {canEdit && (
                        <>
                            <div className="h-px bg-(--border-color) my-1"></div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsOpen(false);
                                    window.location.href = `/dashboard/events/edit/${eventId}`;
                                }}
                                className="px-4 py-2 text-sm text-(--text-secondary) hover:bg-(--bg-surface-hover) hover:text-(--text-main) w-full text-left flex items-center gap-2"
                            >
                                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                Edit Event
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDelete();
                                }}
                                className="px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full text-left flex items-center gap-2"
                            >
                                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                Delete Event
                            </button>
                            {/* Popular Toggle (Admin Only) */}
                            {currentUserRole === 'Administrator' && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleTogglePopular();
                                    }}
                                    className="px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50 w-full text-left flex items-center gap-2 border-t border-(--border-color)"
                                >
                                    {justUpdated ? (
                                        <>
                                            <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            <span className="text-green-500 font-bold">Updated!</span>
                                        </>
                                    ) : popularState ? (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-500 fill-yellow-500" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                            <span>Unmark Popular</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                            <span>Mark as Popular</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

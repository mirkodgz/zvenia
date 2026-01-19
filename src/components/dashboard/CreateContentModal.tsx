import React, { useState, useEffect, useRef } from 'react';
import PostForm from './forms/PostForm';
import EventForm from './forms/EventForm';
import PodcastForm from './forms/PodcastForm';
import ServiceForm from './forms/ServiceForm';

interface CreateContentModalProps {
    currentUser: any;
    userInitials: string;
    activeFeed?: string; // New prop to track current feed
}

type ContentType = 'post' | 'event' | 'podcast' | 'service';

export default function CreateContentModal({ currentUser, userInitials, activeFeed = 'post' }: CreateContentModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<ContentType>('post');
    const [editId, setEditId] = useState<string | null>(null); // Track ID for editing
    const modalRef = useRef<HTMLDivElement>(null);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    // Listen for Edit Events
    useEffect(() => {
        const handleEdit = (event: CustomEvent) => {
            const { type, id } = event.detail;
            setEditId(id);
            setActiveTab(type as ContentType);
            setIsOpen(true);
        };

        window.addEventListener('open-edit-modal', handleEdit as EventListener);
        return () => window.removeEventListener('open-edit-modal', handleEdit as EventListener);
    }, []);

    // Reset editId when closing
    useEffect(() => {
        if (!isOpen) setEditId(null);
    }, [isOpen]);

    // Close on click outside
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setIsOpen(false);
        }
    };

    const openModal = (tab: ContentType = 'post') => {
        setEditId(null); // Clear edit mode if manually opened
        setActiveTab(tab);
        setIsOpen(true);
    };

    const navigateToFeed = (feedType: string) => {
        window.location.href = `/?feed=${feedType}`;
    };

    const role = (currentUser as any)?.role || 'Basic';

    const ALL_TABS = [
        {
            id: 'post',
            label: 'Posts',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>
        },
        {
            id: 'event',
            label: 'Events',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
        },
        {
            id: 'podcast',
            label: 'Podcasts',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
        },
        {
            id: 'service',
            label: 'Services',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
        }
    ];

    const getAllowedTabs = () => {
        // Administrator and CountryManager can see everything
        if (role === 'Administrator' || role === 'CountryManager') return ALL_TABS;

        // Basic can only see Posts
        const allowedIds = ['post'];

        // Add explicit permissions
        if (role === 'Events') allowedIds.push('event');
        if (role === 'Expert') allowedIds.push('podcast');
        if (role === 'Ads') allowedIds.push('service');

        return ALL_TABS.filter(t => allowedIds.includes(t.id));
    };

    const tabs = getAllowedTabs();

    const getButtonClass = (feedType: string) => {
        const isActive = activeFeed === feedType;
        return `flex items-center gap-2 py-2 px-3 rounded text-sm font-semibold transition-all duration-200 ${isActive
            ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-[0_0_15px_rgba(var(--color-primary-500),0.1)]'
            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-main)] border border-transparent'
            }`;
    };

    return (
        <>
            {/* --- TRIGGER WIDGET (Replaces static HTML) --- */}
            <div className="bg-[var(--bg-surface)] rounded-lg border border-[var(--border-color)] p-4 mb-6">
                <div
                    onClick={() => openModal('post')}
                    className="flex gap-3 group cursor-pointer"
                >
                    <div className="w-12 h-12 rounded-full bg-[var(--bg-surface-hover)] flex-shrink-0 flex items-center justify-center border border-[var(--border-color)] group-hover:border-primary-500/50 transition-colors text-[var(--text-main)] font-bold">
                        {userInitials}
                    </div>
                    <div className="w-full bg-[var(--bg-body)] border border-[var(--border-color)] rounded-full px-6 py-3 text-sm text-[var(--text-secondary)] group-hover:border-primary-500/50 group-hover:text-[var(--text-main)] transition-all flex items-center shadow-inner">
                        Start a post, share a mining update...
                    </div>
                </div>
                <div className="flex justify-between items-center mt-4 pt-3 pl-16">
                    <div className="flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
                        {ALL_TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => navigateToFeed(tab.id)}
                                className={getButtonClass(tab.id)}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- MODAL OVERLAY --- */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={handleBackdropClick}
                >
                    <div
                        ref={modalRef}
                        className="bg-[var(--bg-surface)] w-full max-w-4xl max-h-[90vh] rounded-xl border border-[var(--border-color)] shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-main)] z-10 p-2 rounded-full hover:bg-[var(--bg-surface-hover)] transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Modal Header */}
                        <div className="p-6 border-b border-[var(--border-color)] bg-[var(--bg-surface)]">
                            <h2 className="text-xl font-bold text-[var(--text-main)]">{editId ? 'Edit Content' : 'Create Content'}</h2>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-[var(--border-color)] bg-[var(--bg-surface)] px-6">
                            <nav className="flex -mb-px space-x-8" aria-label="Tabs">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as ContentType)}
                                        className={`
                                            group inline-flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                            ${activeTab === tab.id
                                                ? 'border-primary-500 text-primary-400'
                                                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:border-[var(--border-color)]'
                                            }
                                        `}
                                    >
                                        <span className="mr-2">{tab.icon}</span>
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Content Area (Scrollable) */}
                        <div className="overflow-y-auto p-6 md:p-8 custom-scrollbar bg-[var(--bg-body)] flex-1">
                            {activeTab === 'post' && <PostForm currentUser={currentUser} initialData={{ editId: editId || undefined }} />}
                            {activeTab === 'event' && <EventForm currentUser={currentUser} />}
                            {activeTab === 'podcast' && <PodcastForm currentUser={currentUser} />}
                            {activeTab === 'service' && <ServiceForm currentUser={currentUser} />}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

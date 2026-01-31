import React, { useState, useEffect, useRef } from 'react';
import PostForm from './forms/PostForm';
import EventForm from './forms/EventForm';
import PodcastForm from './forms/PodcastForm';
import ServiceForm from './forms/ServiceForm';
import AdsForm from './forms/AdsForm';

interface CreateContentModalProps {
    currentUser: any;
    userInitials: string;
    activeFeed?: string; // New prop to track current feed
}

type ContentType = 'post' | 'event' | 'podcast' | 'service' | 'ads' | 'cm';

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
        const currentPath = window.location.pathname;
        window.location.href = `${currentPath}?feed=${feedType}`;
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
        },
        // Restricted Tabs
        {
            id: 'ads',
            label: 'ADS',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
        },
        {
            id: 'cm',
            label: 'C.M',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        }
    ];

    const getAllowedTabs = () => {
        // Basic can only see Posts
        let allowedIds = ['post', 'event', 'podcast', 'service'];

        // Administrator and CountryManager can see everything including ADS and CM
        if (role === 'Administrator' || role === 'CountryManager') {
            allowedIds.push('ads');
            allowedIds.push('cm');
        }

        // Filter based on allowed IDs
        return ALL_TABS.filter(t => allowedIds.includes(t.id));
    };

    const tabs = getAllowedTabs();

    const getButtonClass = (feedType: string) => {
        const isActive = activeFeed === feedType;
        return isActive ? 'btn-tab btn-tab-active' : 'btn-tab';
    };

    return (
        <>
            {/* --- TRIGGER WIDGET (Replaces static HTML) --- */}
            {/* --- FIXED TABS CONTAINER (Hard Fix) --- */}
            <div className="fixed top-[70px] left-0 right-0 z-99 pointer-events-none lg:pl-[270px] lg:pr-[300px]">
                <div className="pointer-events-auto bg-[#f3f3f3] pt-2 pb-2 mx-auto max-w-4xl px-4">
                    <div className="max-w-[600px] md:max-w-4xl mx-auto w-full">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 w-full">
                            {ALL_TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => navigateToFeed(tab.id)}
                                    className={`${getButtonClass(tab.id)} w-full justify-center shrink-0 flex items-center gap-2 px-1`}
                                >
                                    {tab.icon} <span className="ml-1 uppercase font-bold text-xs whitespace-nowrap pt-0.5">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* SPACER to prevents content overlap */}
            <div className="h-16 mb-4"></div>

            {/* --- SEARCH WIDGET (Replaces 'Start a post') --- */}
            <div className="bg-(--bg-surface) border border-(--border-color) p-4 mb-6">

                {/* Search Bar (Second) */}
                <div
                    className="relative group w-full max-w-[600px] mx-auto cursor-pointer"
                    onClick={() => openModal(activeFeed as ContentType)}
                >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                            className="h-4 w-4 text-gray-400 group-focus-within:text-primary-400 transition-colors"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder={`Start a ${activeFeed === 'ads' ? 'Ad Campaign' : activeFeed}...`}
                        className="block w-full pl-10 pr-4 py-2 bg-(--bg-body) border border-(--border-color) rounded-none text-(--text-main) placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-all text-sm cursor-pointer"
                        readOnly
                    />
                </div>
            </div>

            {/* --- MODAL OVERLAY --- */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={handleBackdropClick}
                >
                    <div
                        ref={modalRef}
                        className="bg-(--bg-surface) w-full max-w-4xl max-h-[90vh] border border-(--border-color) shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-(--text-secondary) hover:text-(--text-main) z-10 p-2 rounded-full hover:bg-(--bg-surface-hover) transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Modal Header */}
                        <div className="p-6 border-b border-(--border-color) bg-(--bg-surface)">
                            <h2 className="text-xl font-bold text-(--text-main)">{editId ? 'Edit Content' : 'Create Content'}</h2>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-(--border-color) bg-(--bg-surface) px-6">
                            <nav className="flex -mb-px space-x-8" aria-label="Tabs">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as ContentType)}
                                        className={`
                                            group inline-flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                            ${activeTab === tab.id
                                                ? 'border-primary-500 text-primary-400'
                                                : 'border-transparent text-(--text-secondary) hover:text-(--text-main) hover:border-(--border-color)'
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
                        <div className="overflow-y-auto p-6 md:p-8 custom-scrollbar bg-(--bg-body) flex-1">
                            {activeTab === 'post' && <PostForm currentUser={currentUser} initialData={{ editId: editId || undefined }} />}
                            {activeTab === 'event' && <EventForm currentUser={currentUser} />}
                            {activeTab === 'podcast' && <PodcastForm currentUser={currentUser} />}
                            {activeTab === 'service' && <ServiceForm currentUser={currentUser} />}
                            {activeTab === 'ads' && <AdsForm currentUser={currentUser} />}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

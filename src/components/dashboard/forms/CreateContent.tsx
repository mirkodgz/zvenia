import React, { useState, useEffect } from 'react';
import PostForm from './PostForm';
import EventForm from './EventForm';
import PodcastForm from './PodcastForm';
import ServiceForm from './ServiceForm';

interface CreateContentProps {
    currentUser: any;
}

type ContentType = 'post' | 'event' | 'podcast' | 'service';

export default function CreateContent({ currentUser }: CreateContentProps) {
    const [activeTab, setActiveTab] = useState<ContentType>('post');

    useEffect(() => {
        // Read "tab" query param on mount
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (tab && ['post', 'event', 'podcast', 'service'].includes(tab)) {
            setActiveTab(tab as ContentType);
        }
    }, []);

    const tabs = [
        {
            id: 'post', label: 'Posts', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            id: 'event', label: 'Events', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            id: 'podcast', label: 'Podcasts', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
            )
        },
        {
            id: 'service', label: 'Services', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            )
        },
    ];

    return (
        <div className="flex flex-col h-full bg-[#f4f2ee] rounded-lg shadow-sm border border-gray-200">
            {/* Tabs Header - Clean Light Style */}
            <div className="border-b border-gray-200">
                <nav className="flex -mb-px" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as ContentType)}
                            className={`
                                w-1/4 py-3 md:py-4 px-1 text-center border-b-2 text-xs md:text-[15px] font-medium transition-colors duration-200 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 cursor-pointer
                                ${activeTab === tab.id
                                    ? 'bg-accent-500 text-white border-transparent'
                                    : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'
                                }
                              `}
                        >
                            <span className="shrink-0">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Form Container - Clean White */}
            <div className="p-4 md:p-8 min-h-[500px]">
                {activeTab === 'post' && <PostForm currentUser={currentUser} />}
                {activeTab === 'event' && <EventForm currentUser={currentUser} />}
                {activeTab === 'podcast' && <PodcastForm currentUser={currentUser} />}
                {activeTab === 'service' && <ServiceForm currentUser={currentUser} />}
            </div>
        </div>
    );
}

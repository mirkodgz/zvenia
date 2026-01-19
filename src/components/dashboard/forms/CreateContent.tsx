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
        { id: 'post', label: 'Posts', icon: '📝' },
        { id: 'event', label: 'Events', icon: '📅' },
        { id: 'podcast', label: 'Podcasts', icon: '🎙️' },
        { id: 'service', label: 'Services', icon: '💼' },
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Tabs Header */}
            <div className="border-b border-white/10 bg-black/20">
                <nav className="flex -mb-px" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as ContentType)}
                            className={`
                w-1/4 py-4 px-1 text-center border-b-2 text-sm font-medium transition-colors duration-200
                ${activeTab === tab.id
                                    ? 'border-primary-500 text-primary-400'
                                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700'
                                }
              `}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Form Container */}
            <div className="p-6 md:p-8 bg-neutral-900/50 min-h-[500px]">
                {activeTab === 'post' && <PostForm currentUser={currentUser} />}
                {activeTab === 'event' && <EventForm currentUser={currentUser} />}
                {activeTab === 'podcast' && <PodcastForm currentUser={currentUser} />}
                {activeTab === 'service' && <ServiceForm currentUser={currentUser} />}
            </div>
        </div>
    );
}

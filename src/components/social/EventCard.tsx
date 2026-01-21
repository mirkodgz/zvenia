
import React from 'react';
import EventOptions from './EventOptions';

interface Event {
    id: string; // Added ID
    slug: string;
    title: string;
    start_date: string;
    end_date: string | null;
    location: string | null;
    featured_image_url: string | null;
    external_link: string | null;
    excerpt?: string;
    author_id: string; // Added author_id
}

interface EventCardProps {
    event: Event;
    currentUser: any; // Added currentUser
}

const EventCard: React.FC<EventCardProps> = ({ event, currentUser }) => {
    // Format Date Range: "Jun 24 - Jun 26, 2026"
    // Format Date Range
    const formatDateRange = (start: string, end: string | null) => {
        if (!start) return '';
        const s = new Date(start);
        const startYear = s.getFullYear();
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };

        const startStr = s.toLocaleDateString('en-US', options);

        if (!end) return `${startStr}, ${startYear}`;

        const e = new Date(end);
        const endYear = e.getFullYear();
        const endStr = e.toLocaleDateString('en-US', options);

        if (startYear !== endYear) {
            // Cross-year event: Nov 22, 2025 - Apr 16, 2026
            return `${startStr}, ${startYear} - ${endStr}, ${endYear}`;
        }

        // Same year: Nov 22 - Apr 16, 2026
        return `${startStr} - ${endStr}, ${endYear}`;
    };

    const dateDisplay = formatDateRange(event.start_date, event.end_date);

    return (
        <div className="bg-[#1A1A1A] border border-white/10 overflow-hidden hover:border-primary-500/30 transition-all group flex flex-col h-full relative">

            {/* Options Menu (Absolute Top Right) */}
            <div className="absolute top-3 right-3 z-30">
                <EventOptions eventId={event.id} authorId={event.author_id} currentUserId={currentUser?.id} slug={event.slug} />
            </div>

            {/* Cover Image */}
            <div className="relative h-48 w-full bg-black border-b border-white/5 overflow-hidden">
                {event.featured_image_url ? (
                    <img
                        src={event.featured_image_url}
                        alt={event.title}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    </div>
                )}

                {/* Overlay Badge - Moved to Left to avoid conflict with Options */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 text-xs font-bold text-white shadow-lg">
                    Event
                </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex flex-col flex-grow">
                {/* Date */}
                <div className="text-primary-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    {dateDisplay}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
                    {event.title}
                </h3>

                {/* Location */}
                {event.location && (
                    <div className="text-gray-400 text-sm mb-4 flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        {event.location}
                    </div>
                )}

                {/* Spacer to push button down */}
                <div className="flex-grow"></div>

                {/* CTA Button */}
                <a
                    href={`/event/${event.slug}`}
                    className="mt-4 w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary-500/50 text-sm font-bold text-center text-white transition-all flex items-center justify-center gap-2"
                >
                    View Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </a>
            </div>
        </div>
    );
};

export default EventCard;

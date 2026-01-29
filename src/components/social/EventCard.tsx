
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
    is_popular?: boolean;
}

interface EventCardProps {
    event: Event;
    currentUser: any; // Added currentUser
    initialIsSaved?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, currentUser, initialIsSaved = false }) => {
    const startDate = new Date(event.start_date);
    const endDate = event.end_date ? new Date(event.end_date) : null;

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    let dateDisplay = formatDate(startDate);
    if (endDate) {
        const startYear = startDate.getFullYear();
        const endYear = endDate.getFullYear();

        if (startDate.toDateString() === endDate.toDateString()) {
            // Same day, just show one
            dateDisplay = formatDate(startDate);
        } else if (startYear === endYear) {
            // Same year
            dateDisplay = `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        } else {
            // Different years
            dateDisplay = `${formatDate(startDate)} - ${formatDate(endDate)}`;
        }
    }

    return (
        <div className="shrink-0 w-full group relative flex flex-col bg-(--bg-card) overflow-hidden border border-(--border-color) hover:border-primary-500/50 transition-all scroll-snap-align-start h-full">

            {/* Options Menu (Absolute Top Right) */}
            <div className="absolute top-3 right-3 z-30">
                <EventOptions
                    eventId={event.id}
                    authorId={event.author_id}
                    currentUserId={currentUser?.id}
                    currentUserRole={currentUser?.role}
                    slug={event.slug}
                    isPopular={event.is_popular}
                    initialIsSaved={initialIsSaved}
                />
            </div>

            {/* Cover Image */}
            <div className="relative h-48 w-full bg-gray-100 border-b border-gray-100 overflow-hidden">
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
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md border border-(--border-color) px-3 py-1 text-xs font-bold text-(--text-main) shadow-sm">
                    Event
                </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex flex-col grow">
                {/* Date */}
                <div className="text-primary-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    {dateDisplay}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-(--text-main) mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
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
                <div className="grow"></div>

                {/* CTA Button */}
                <a
                    href={`/event/${event.slug}`}
                    className="mt-4 w-full py-2.5 bg-transparent hover:bg-gray-50 border border-(--border-color) hover:border-primary-500/50 text-sm font-bold text-center text-(--text-main) transition-all flex items-center justify-center gap-2 rounded-md"
                >
                    View Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </a>
            </div>
        </div>
    );
};

export default EventCard;

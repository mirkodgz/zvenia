
import React, { useRef } from 'react';
import ServiceCard from './ServiceCard';

interface Service {
    id: string;
    title: string;
    slug: string;
    quick_view_image_url: string | null;
    featured_image_url: string | null;
    organizer_company?: string;
    company_link?: string;
    description?: string;
    content?: string; // Added content
    type_of_ads?: string;
    author_id?: string; // Added for permissions if available
    price?: string | number;
}

interface ServiceRowProps {
    title: string; // Category Title (e.g. "Consulting")
    services: Service[];
    currentUser: any;
}

const ServiceRow: React.FC<ServiceRowProps> = ({ title, services, currentUser }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 320; // Card width + gap
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (services.length === 0) return null;

    return (
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6 mb-6 relative group/row transition-colors">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
                    {title}
                    <span className="text-xs font-normal text-[var(--text-secondary)] bg-[var(--bg-surface)] px-2 py-0.5 rounded-full border border-[var(--border-color)]">
                        {services.length}
                    </span>
                </h3>
            </div>

            {/* Scroll Controls */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-2 top-1/2 z-10 p-2 bg-[var(--bg-surface)] rounded-full text-[var(--text-main)] opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-primary-600 border border-[var(--border-color)] shadow-md disabled:opacity-0"
            >
                ←
            </button>
            <button
                onClick={() => scroll('right')}
                className="absolute right-2 top-1/2 z-10 p-2 bg-[var(--bg-surface)] rounded-full text-[var(--text-main)] opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-primary-600 border border-[var(--border-color)] shadow-md"
            >
                →
            </button>

            {/* Carousel Container */}
            <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {services.map((service) => (
                    <ServiceCard key={service.id} service={service} currentUser={currentUser} />
                ))}
            </div>
        </div>
    );
};

export default ServiceRow;

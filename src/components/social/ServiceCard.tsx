
import React from 'react';
import ServiceOptions from './ServiceOptions';

interface ServiceCardProps {
    service: {
        id: string;
        title: string;
        quick_view_image_url: string | null;
        featured_image_url: string | null;
        slug: string;
        organizer_company?: string;
        company_link?: string;
        description?: string;
        content?: string; // fallback
        author_id?: string;
        price?: string | number; // Added Price
    };
    currentUser: any;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, currentUser }) => {
    // Prefer quick view image, fall back to featured
    const image = service.quick_view_image_url || service.featured_image_url || 'https://via.placeholder.com/300x200?text=Service';
    // Link to internal detail page
    const linkUrl = `/service/${service.slug}`;

    // Strip HTML tags and WordPress comments from fallback content
    const rawDescription = service.description || service.content || '';
    const description = rawDescription
        .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
        .replace(/<[^>]*>/g, '')         // Remove tags
        .trim();

    return (
        <div className="flex-shrink-0 w-full group relative block bg-[var(--bg-card)] overflow-hidden border border-[var(--border-color)] hover:border-primary-500/50 transition-all scroll-snap-align-start h-full flex flex-col">

            {/* Options Menu (Absolute Top Right) */}
            <div className="absolute top-2 right-2 z-20">
                <ServiceOptions serviceId={service.id} authorId={service.author_id} currentUserId={currentUser?.id} slug={service.slug} />
            </div>

            {/* Clickable Area Wrapper */}
            <a
                href={linkUrl}
                className="block h-full w-full flex flex-col"
            >
                {/* Thumbnail */}
                <div className="relative h-40 w-full overflow-hidden bg-[var(--bg-surface)]">
                    <img
                        src={image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>

                    {/* Price Badge (Optional styling choice, or keep standard) */}
                    {service.price && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 backdrop-blur-sm border border-white/10">
                            ${service.price}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                    <h4 className="text-[var(--text-main)] font-bold text-sm leading-tight line-clamp-2 group-hover:text-primary-400 transition-colors mb-2">
                        {service.title}
                    </h4>

                    {/* Description Preview */}
                    {description && (
                        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-2">
                            {description}
                        </p>
                    )}

                    {!service.price && (
                        <p className="text-xs text-[var(--text-secondary)] mb-2">Contact for pricing</p>
                    )}

                    {service.organizer_company && (
                        <div className="mt-auto pt-2 flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] bg-[var(--bg-surface)] border border-[var(--border-color)] px-2 py-0.5 truncate max-w-full">
                                {service.organizer_company}
                            </span>
                        </div>
                    )}
                </div>
            </a>
        </div>
    );
};

export default ServiceCard;


import React from 'react';

interface AdsCardProps {
    ad: {
        id: string;
        title: string;
        image_url: string | null;
        slug: string;
        content: string | null;
        link_url: string;
        metadata?: any;
    };
    currentUser: any;
}

const AdsCard: React.FC<AdsCardProps> = ({ ad, currentUser }) => {
    // Basic Ad Display

    return (
        <a
            href={ad.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group relative w-full overflow-hidden bg-(--bg-card) border border-(--border-color) hover:border-accent-500/50 transition-all rounded-lg"
        >
            {/* Thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden bg-(--bg-surface)">
                {ad.image_url ? (
                    <img
                        src={ad.image_url}
                        alt={ad.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <span className="font-bold">AD</span>
                    </div>
                )}
                {/* Badge */}
                <div className="absolute top-2 left-2 bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                    SPONSORED
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h4 className="text-(--text-main) font-bold text-base leading-tight line-clamp-2 group-hover:text-accent-500 transition-colors mb-2">
                    {ad.title}
                </h4>
                {ad.content && (
                    <p className="text-xs text-(--text-secondary) line-clamp-2">
                        {ad.content}
                    </p>
                )}

                <div className="mt-3 flex items-center gap-2 text-[10px] text-accent-500 font-semibold  uppercase tracking-wider">
                    Visit Link &rarr;
                </div>
            </div>
        </a>
    );
};

export default AdsCard;

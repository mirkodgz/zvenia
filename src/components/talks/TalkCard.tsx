import React from 'react';
import { Play, ExternalLink } from 'lucide-react';

interface TalkCardProps {
    talk: {
        id: string;
        slug: string;
        title: string;
        featured_image_url: string | null;
        metadata: {
            "guest-z-talk"?: string;
            "guest-company"?: string;
            [key: string]: any;
        };
    };
}

const TalkCard: React.FC<TalkCardProps> = ({ talk }) => {
    const metadata = talk.metadata as any;
    const guestName = metadata?.['guest-z-talk'] || 'Invitado Especial';

    // Fix: Handle video URLs by converting to jpg extension for thumbnail generation
    let imageUrl = talk.featured_image_url;
    if (imageUrl && imageUrl.includes('.mp4')) {
        imageUrl = imageUrl.replace('.mp4', '.jpg');
    }

    return (
        <a
            href={`/z-talks/${talk.slug}`}
            className="group block w-full bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
        >
            {/* Main Image Area - Full Opacity */}
            <div className="relative aspect-video w-full bg-gray-900 overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={talk.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 bg-linear-to-br from-gray-800 to-gray-900" />
                )}
            </div>

            {/* Simple Title Footer */}
            <div className="p-4 bg-white flex justify-between items-start gap-2">
                <h3 className="text-base font-bold text-gray-900 leading-tight font-font-primary group-hover:text-(--primary-color) transition-colors line-clamp-2">
                    {guestName}
                </h3>
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-(--primary-color) transition-colors shrink-0" />
            </div>
        </a>
    );
};

export default TalkCard;

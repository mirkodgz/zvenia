
import React from 'react';

interface EpisodeCardProps {
    episode: {
        title: string;
        video_url: string;
        number?: number; // Optional if we have it in the future
    };
    podcastTitle: string;
    coverImage: string;
    index: number;
}

const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode, podcastTitle, coverImage, index }) => {
    const videoId = getYoutubeId(episode.video_url);
    const thumbnailUrl = videoId
        ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
        : coverImage;

    return (
        <a
            href={episode.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-72 group relative block bg-[var(--bg-card)] rounded-lg overflow-hidden border border-[var(--border-color)] hover:border-primary-500/50 transition-all scroll-snap-align-start"
        >
            {/* Thumbnail */}
            <div className="relative h-40 w-full overflow-hidden">
                <img
                    src={thumbnailUrl}
                    alt={episode.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>

                {/* Badge (Podcast Name or Host) */}
                <div className="absolute top-2 left-2 bg-black/80 backdrop-blur text-[10px] font-bold text-white px-2 py-0.5 rounded uppercase tracking-wider">
                    {podcastTitle.split(' ').slice(0, 2).join(' ')}
                </div>

                {/* Play Button (YouTube Style) */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                </div>

                {/* Ep Number Badge (Bottom Left) */}
                <div className="absolute bottom-2 left-2 bg-blue-600 text-[10px] font-bold text-white px-2 py-0.5 rounded">
                    EPISODE #{index + 1}
                </div>
            </div>

            {/* Content */}
            <div className="p-3">
                <h4 className="text-[var(--text-main)] font-bold text-sm leading-tight line-clamp-2 group-hover:text-primary-400 transition-colors">
                    {episode.title}
                </h4>
            </div>
        </a>
    );
};

export default EpisodeCard;

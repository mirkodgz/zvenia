
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
    podcastSlug: string;
}

const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode, podcastTitle, coverImage, index, podcastSlug }) => {
    const videoId = getYoutubeId(episode.video_url);
    const thumbnailUrl = videoId
        ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
        : coverImage;

    return (
        <a
            href={`/podcast/${podcastSlug}${videoId ? `?v=${videoId}` : ''}`}
            className="shrink-0 w-72 group relative block bg-(--bg-card) border border-(--border-color) hover:border-primary-500 hover:shadow-[0_0_25px_rgba(var(--color-primary-500,34,197,94),0.4)] transition-all duration-300 scroll-snap-align-start hover:-translate-y-1"
        >
            {/* Thumbnail */}
            <div className="relative h-44 w-full overflow-hidden">
                <img
                    src={thumbnailUrl}
                    alt={episode.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Dark Overlay & Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>

                {/* Badge (Podcast Name or Host) */}
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-[10px] font-bold text-white px-2 py-1 uppercase tracking-wider border border-white/10">
                    {podcastTitle.split(' ').slice(0, 2).join(' ')}
                </div>

                {/* Play Button (Glassy & Animated) - Keeping circular for icon convention or making it square? User said "nothing rounded". Let's make it sharp. */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl">
                        <div className="w-10 h-10 bg-primary-600 flex items-center justify-center shadow-inner">
                            <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                    </div>
                </div>

                {/* Ep Number Badge (Bottom Left) - Standard for ALL */}
                <div className="absolute bottom-2 left-2 bg-primary-500/90 backdrop-blur text-[9px] font-bold text-white px-1.5 py-0.5 border border-white/10">
                    EPISODE #{index + 1}
                </div>
            </div>

            {/* Content (Glassy Effect) */}
            <div className="p-4 relative bg-(--bg-card) group-hover:bg-(--bg-surface-hover) transition-colors">
                <h4 className="text-(--text-main) font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary-400 transition-colors">
                    {episode.title}
                </h4>
            </div>
        </a>
    );
};

export default EpisodeCard;


import React, { useRef } from 'react';
import PodcastOptions from './PodcastOptions';
import EpisodeCard from './EpisodeCard';

interface PodcastEpisode {
    title: string;
    video_url: string;
}

interface Podcast {
    id: string;
    slug: string;
    title: string;
    host: string;
    cover_image_url: string | null;
    episodes: PodcastEpisode[] | null;
    author_id: string;
    is_popular?: boolean;
}

interface PodcastRowProps {
    podcast: Podcast;
    currentUser: any;
    initialIsSaved?: boolean;
}

const PodcastRow: React.FC<PodcastRowProps> = ({ podcast, currentUser, initialIsSaved = false }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const episodes = Array.isArray(podcast.episodes) ? podcast.episodes : [];
    const reversedEpisodes = [...episodes].reverse();

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 320; // Card width + gap
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (episodes.length === 0) return null;

    return (
        <div className="bg-(--bg-card) border border-(--border-color) p-3 md:p-6 mb-4 md:mb-6 relative group/row transition-colors">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <a href={`/podcast/${podcast.slug}`} className="text-xl font-bold text-(--text-main) flex items-center gap-2 hover:text-primary-400 transition-colors cursor-pointer">
                    {podcast.title}
                </a>
                {/* Options Menu */}
                <PodcastOptions
                    podcastId={podcast.id}
                    authorId={podcast.author_id}
                    currentUserId={currentUser?.id}
                    currentUserRole={currentUser?.role}
                    slug={podcast.slug}
                    isPopular={podcast.is_popular}
                    initialIsSaved={initialIsSaved}
                />
            </div>

            {/* Scroll Controls (Visible on Hover) */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/10 backdrop-blur-md rounded-full text-white opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:bg-primary-600 shadow-xl border border-white/20 hover:scale-110"
                aria-label="Scroll Left"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={() => scroll('right')}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/10 backdrop-blur-md rounded-full text-white opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:bg-primary-600 shadow-xl border border-white/20 hover:scale-110"
                aria-label="Scroll Right"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Horizontal Scroll Container */}
            <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {reversedEpisodes.map((ep, index) => (
                    <EpisodeCard
                        key={index}
                        episode={ep}
                        // If we want "Episode #3", and this is the first item (index 0) of 3...
                        // We need the original index.
                        // Assuming original order was Oldest -> Newest (0, 1, 2)
                        // This item was index 2.
                        // So we calculate: (Total - 1) - CurrentIndex
                        index={episodes.length - 1 - index}
                        podcastTitle={podcast.title}
                        coverImage={podcast.cover_image_url || ''}
                        podcastSlug={podcast.slug}
                    />
                ))}
            </div>
        </div>
    );
};

export default PodcastRow;

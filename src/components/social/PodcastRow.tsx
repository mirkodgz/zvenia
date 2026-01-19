
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
}

interface PodcastRowProps {
    podcast: Podcast;
    currentUser: any;
}

const PodcastRow: React.FC<PodcastRowProps> = ({ podcast, currentUser }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const episodes = Array.isArray(podcast.episodes) ? podcast.episodes : [];
    const reversedEpisodes = [...episodes].reverse(); // Show newest first? Or preserve order. Assuming API returns newest first or we want reverse. 
    // Usually episodes are stored 1, 2, 3. We probably want 50, 49, 48.
    // Let's reverse them for display so "Latest" is first.

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
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6 mb-6 relative group/row transition-colors">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <a href={`/podcast/${podcast.slug}`} className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2 hover:text-primary-400 transition-colors cursor-pointer block">
                    {podcast.title}
                </a>
                {/* Options Menu */}
                <PodcastOptions podcastId={podcast.id} authorId={podcast.author_id} currentUserId={currentUser?.id} slug={podcast.slug} />
            </div>

            {/* Scroll Controls (Visible on Hover) */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-2 top-1/2 z-10 p-2 bg-[var(--bg-surface-hover)] rounded-full text-[var(--text-main)] opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-primary-600 shadow-md border border-[var(--border-color)] disabled:opacity-0"
            >
                ←
            </button>
            <button
                onClick={() => scroll('right')}
                className="absolute right-2 top-1/2 z-10 p-2 bg-[var(--bg-surface-hover)] rounded-full text-[var(--text-main)] opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-primary-600 shadow-md border border-[var(--border-color)]"
            >
                →
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
                        index={episodes.length - 1 - index} // Real episode number (descending)
                        podcastTitle={podcast.title}
                        coverImage={podcast.cover_image_url || ''}
                    />
                ))}
            </div>
        </div>
    );
};

export default PodcastRow;

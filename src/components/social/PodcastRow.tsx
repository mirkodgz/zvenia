
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
    // User requested original order (Episode 1, 2, 3...)
    // const reversedEpisodes = [...episodes].reverse(); 

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
        <div className="bg-(--bg-card) border border-(--border-color) p-6 mb-6 relative group/row transition-colors">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <a href={`/podcast/${podcast.slug}`} className="text-xl font-bold text-(--text-main) flex items-center gap-2 hover:text-primary-400 transition-colors cursor-pointer">
                    {podcast.title}
                </a>
                {/* Options Menu */}
                <PodcastOptions podcastId={podcast.id} authorId={podcast.author_id} currentUserId={currentUser?.id} slug={podcast.slug} />
            </div>

            {/* Scroll Controls (Visible on Hover) */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-2 top-1/2 z-10 p-2 bg-(--bg-surface-hover) rounded-full text-(--text-main) opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-primary-600 shadow-md border border-(--border-color) disabled:opacity-0"
            >
                ←
            </button>
            <button
                onClick={() => scroll('right')}
                className="absolute right-2 top-1/2 z-10 p-2 bg-(--bg-surface-hover) rounded-full text-(--text-main) opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-primary-600 shadow-md border border-(--border-color)"
            >
                →
            </button>

            {/* Horizontal Scroll Container */}
            <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {episodes.map((ep, index) => (
                    <EpisodeCard
                        key={index}
                        episode={ep}
                        index={index} // 0 = Ep 1
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

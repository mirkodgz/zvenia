
import React from 'react';
import PodcastOptions from './PodcastOptions';

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

interface PodcastCardProps {
    podcast: Podcast;
    currentUser: any;
}

const PodcastCard: React.FC<PodcastCardProps> = ({ podcast, currentUser }) => {

    // Safety check for episodes array
    const eps = Array.isArray(podcast.episodes) ? podcast.episodes : [];
    const episodeCount = eps.length;
    const latestEpisode = episodeCount > 0 ? eps[eps.length - 1] : null;

    const handleAuthIntercept = (e: React.MouseEvent) => {
        if (!currentUser) {
            e.preventDefault();
            e.stopPropagation();
            window.dispatchEvent(new CustomEvent("open-auth-modal"));
        }
    };

    return (
        <div
            onClickCapture={handleAuthIntercept}
            className="bg-[#1A1A1A] rounded-lg border border-white/10 overflow-hidden hover:border-primary-500/30 transition-all group flex flex-col h-full relative"
        >

            {/* Options Menu */}
            <div className="absolute top-3 right-3 z-30">
                <PodcastOptions podcastId={podcast.id} authorId={podcast.author_id} currentUserId={currentUser?.id} />
            </div>

            {/* Cover Image */}
            <div className="relative h-48 w-full bg-black border-b border-white/5 overflow-hidden">
                {podcast.cover_image_url ? (
                    <img
                        src={podcast.cover_image_url}
                        alt={podcast.title}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                        <span className="text-4xl">🎙️</span>
                    </div>
                )}

                {/* Overlay Badge */}
                <div className="absolute top-3 left-3 bg-purple-600/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg border border-white/20">
                    Podcast
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col grow">

                {/* Host */}
                {podcast.host && (
                    <div className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                        HOST: {podcast.host}
                    </div>
                )}

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-purple-400 transition-colors">
                    {podcast.title}
                </h3>

                {/* Episodes Info */}
                <div className="flex items-center gap-3 mb-4">
                    <span className="bg-white/5 px-2 py-1 rounded text-xs text-gray-400 border border-white/5">
                        {episodeCount} Episodes
                    </span>
                    {latestEpisode && (
                        <span className="text-xs text-gray-500 line-clamp-1 italic">
                            Latest: {latestEpisode.title}
                        </span>
                    )}
                </div>

                <div className="grow"></div>

                {/* CTA */}
                <a
                    href={currentUser ? `/podcast/${podcast.slug}` : "#"}
                    onClick={(e) => {
                        if (!currentUser) {
                            e.preventDefault();
                            e.stopPropagation();
                            window.dispatchEvent(new CustomEvent("open-auth-modal"));
                        }
                    }}
                    className="mt-4 w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-md text-sm font-bold text-center text-white transition-all flex items-center justify-center gap-2 group-hover:bg-purple-600/20"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    Listen Now
                </a>

            </div>
        </div>
    );
};

export default PodcastCard;

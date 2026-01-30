
import React from 'react';

interface UserProfile {
    id: string;
    profile_slug: string | null;
    full_name: string | null;
    email: string;
    avatar_url: string | null;
    profession: string | null;
    created_at: string;
    role: string | null;
    nationality: string | null;
}

interface UserCardProps {
    user: UserProfile;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
    const profileLink = user.profile_slug ? `/profile/${user.profile_slug}` : `/profile/${user.id}`; // Fallback if no slug

    // Format date
    const memberSince = new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const displayName = user.full_name || user.email.split('@')[0];
    const initial = displayName[0].toUpperCase();

    const isVerified = user.role === 'Expert' || user.role === 'CountryManager' || user.role === 'Administrator';

    return (
        <a href={profileLink} className="block group">
            <div
                className="bg-white rounded-lg p-3 md:p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md h-full"
                style={{ border: '1px solid rgba(13, 36, 27, 0.2)' }}
            >

                {/* Avatar */}
                <div className="relative mb-2 md:mb-4 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-none bg-gray-100 overflow-hidden border-2 border-white shadow-sm">
                        {user.avatar_url ? (
                            <img
                                src={user.avatar_url}
                                alt={displayName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <img
                                src="/igm-default.webp"
                                alt="Default Profile"
                                className="w-full h-full object-cover opacity-80"
                            />
                        )}
                    </div>
                </div>

                {/* Info */}
                <p className="text-[10px] md:text-xs text-green-600 font-medium mb-0.5 md:mb-1 line-clamp-1">
                    {memberSince}
                </p>

                <div className="flex items-center justify-center gap-1 mb-0.5 md:mb-1 group-hover:text-primary-600 transition-colors w-full px-1">
                    <h3 className="text-dark font-bold text-sm md:text-lg line-clamp-1 break-all">
                        {displayName}
                    </h3>
                    {isVerified && (
                        <div title="Verified User" className="shrink-0">
                            <svg className="w-3 h-3 md:w-5 md:h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                </div>

                <p className="text-gray-500 text-[11px] md:text-sm mb-2 md:mb-3 h-4 md:h-5 line-clamp-1">
                    {user.profession || "N/A"}
                </p>

                {/* Decorative bottom line */}
                <div className="mt-auto pt-4 w-12 border-b-2 border-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
        </a>
    );
};

export default UserCard;

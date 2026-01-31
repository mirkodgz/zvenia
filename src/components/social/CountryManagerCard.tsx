import React, { useState, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';

interface CountryManagerCardProps {
    user: any;
    currentUser?: any;
}

export default function CountryManagerCard({ user }: CountryManagerCardProps) {
    const [imageError, setImageError] = useState(false);

    // Placeholder image logic
    const displayImage = !imageError && user.avatar_url
        ? user.avatar_url
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || 'User')}&background=random`;

    return (
        <div className="bg-white border border-gray-200 rounded-none shadow-sm hover:shadow-md transition-shadow overflow-hidden flex h-[120px]">
            {/* Left: Image (45%) */}
            <div className="w-[45%] bg-gray-100 relative h-full">
                <img
                    src={displayImage}
                    alt={user.full_name}
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Right: Content (55%) */}
            <div className="w-[55%] p-3 flex flex-col relative bg-white h-full">
                {/* Menu Icon Top Right */}
                <div className="absolute top-2 right-2 flex gap-1 items-start z-10">
                    <button className="text-gray-300 hover:text-gray-500">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex flex-col h-full w-full justify-center">
                    <div className="mb-2">
                        {/* Name */}
                        <h3 className="font-bold text-[#003049] text-[11px] leading-tight mb-0.5 uppercase line-clamp-2">
                            {user.full_name || 'Zvenia User'}
                        </h3>

                        {/* Title */}
                        <div className="text-[#003049] text-[11px] leading-tight font-normal">
                            <p>ZVENIA Mining</p>
                            <p>Country Manager</p>
                        </div>
                    </div>

                    {/* Country - Pinned to bottom, slightly larger/bold as in screenshot */}
                    <div className="mt-auto">
                        <p className="font-bold text-[#003049] text-[12px] leading-tight">
                            {user.work_country || user.country || 'Global'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

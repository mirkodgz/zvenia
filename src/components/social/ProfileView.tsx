import React, { useState } from 'react';

interface ProfileViewProps {
    profile: any;
    isOwnProfile: boolean;
    resolvedNames: {
        nationalityName: string | null;
        workCountryName: string | null;
        mainLanguageName: string | null;
        mainAreaName: string | null;
    };
    privacy: Record<string, boolean>;
}

export default function ProfileView({ profile, isOwnProfile, resolvedNames, privacy }: ProfileViewProps) {
    const [activeTab, setActiveTab] = useState<'Overview' | 'Posts' | 'Events' | 'Services'>('Overview');

    const { nationalityName, workCountryName, mainLanguageName, mainAreaName } = resolvedNames;

    const isFieldVisible = (field: string, defaultValue: boolean = true) => {
        if (privacy[field] === undefined) return defaultValue;
        return privacy[field] === true;
    };

    const tabs = ['Overview', 'Posts', 'Events', 'Services'];

    return (
        <div className="bg-white rounded-sm border border-gray-200 overflow-hidden shadow-[1px_2px_2px_2px_#22232633]">
            {/* Banner */}
            <div
                className="h-48 relative"
                style={{
                    backgroundImage: "url('https://res.cloudinary.com/dun3slcfg/images/v1691587336/cloud-files/Background-Default-/Background-Default-.jpg')",
                    backgroundPosition: "right center",
                    backgroundSize: "200% auto",
                    backgroundRepeat: "no-repeat"
                }}
            >
                <div className="absolute top-4 right-4">
                    <img src="/zvenia-Logo.svg" alt="ZVENIA" className="h-16 opacity-30" />
                </div>
            </div>

            <div className="px-6 pb-6 relative">
                {/* Avatar */}
                <div className="absolute -top-20 left-6">
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden shadow-lg">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.full_name || "User"} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-4xl font-bold text-gray-400">
                                {(profile.full_name || profile.email || "U")[0].toUpperCase()}
                            </span>
                        )}
                    </div>
                </div>

                {/* Header Actions (Edit Profile) */}
                <div className="flex justify-end pt-4 min-h-[60px]">
                    {isOwnProfile && (
                        <a
                            href="/dashboard/profile/edit"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-[#00a33f] transition-colors font-medium text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Edit Profile
                        </a>
                    )}
                </div>

                {/* Basic Info */}
                <div className="mt-2 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-dark">
                            {profile.full_name || profile.email}
                        </h1>
                        {(profile.role === "Expert" || profile.role === "CountryManager" || profile.role === "Administrator") && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Verified user
                            </span>
                        )}
                    </div>

                    {profile.headline_user && (
                        <p className="text-dark mb-2 text-[15px] font-normal leading-relaxed">
                            {profile.headline_user}
                        </p>
                    )}

                    <div className="text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                        {workCountryName && <span>{workCountryName}</span>}
                        {workCountryName && (profile.company || profile.position) && <span>•</span>}
                        {profile.position && <span>{profile.position}</span>}
                        {profile.position && profile.company && <span>at</span>}
                        {profile.company && <span>{profile.company}</span>}
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab
                                        ? 'border-accent-500 text-accent-500'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === 'Overview' && (
                        <div className="animate-in fade-in duration-300">
                            {/* Contact Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <span className="text-xs uppercase block mb-1 font-bold text-primary-500">E-mail</span>
                                    <p className="text-dark text-[15px]">{profile.email}</p>
                                </div>
                                {profile.phone_number && isFieldVisible("phone_number", false) && (
                                    <div>
                                        <span className="text-xs uppercase block mb-1 font-bold text-primary-500">Phone number</span>
                                        <p className="text-dark text-[15px]">{profile.phone_number}</p>
                                    </div>
                                )}
                                {nationalityName && isFieldVisible("nationality", true) && (
                                    <div>
                                        <span className="text-xs uppercase block mb-1 font-bold text-primary-500">Nationality</span>
                                        <p className="text-dark text-[15px]">{nationalityName}</p>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-gray-200 my-6"></div>

                            {/* Professional Info */}
                            <h3 className="text-lg font-bold text-dark mb-4">Professional info</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {workCountryName && isFieldVisible("work_country", true) && (
                                    <div>
                                        <span className="text-xs uppercase block mb-1 font-bold text-primary-500">Work country</span>
                                        <p className="text-dark text-[15px]">{workCountryName}</p>
                                    </div>
                                )}
                                {profile.profession && isFieldVisible("profession", true) && (
                                    <div>
                                        <span className="text-xs uppercase block mb-1 font-bold text-primary-500">Profession</span>
                                        <p className="text-dark text-[15px]">{profile.profession}</p>
                                    </div>
                                )}
                                {profile.company && isFieldVisible("company", true) && (
                                    <div>
                                        <span className="text-xs uppercase block mb-1 font-bold text-primary-500">Current company</span>
                                        <p className="text-dark text-[15px]">{profile.company}</p>
                                    </div>
                                )}
                                {profile.position && isFieldVisible("position", true) && (
                                    <div>
                                        <span className="text-xs uppercase block mb-1 font-bold text-primary-500">Current position</span>
                                        <p className="text-dark text-[15px]">{profile.position}</p>
                                    </div>
                                )}
                                {profile.linkedin_url && isFieldVisible("linkedin_url", true) && (
                                    <div>
                                        <span className="text-xs uppercase block mb-1 font-bold text-primary-500">Linkedin URL</span>
                                        <a
                                            href={profile.linkedin_url.startsWith("http") ? profile.linkedin_url : `https://${profile.linkedin_url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-accent-500 hover:underline break-all text-[15px]"
                                        >
                                            {profile.linkedin_url}
                                        </a>
                                    </div>
                                )}
                                {mainLanguageName && isFieldVisible("main_language", true) && (
                                    <div>
                                        <span className="text-xs uppercase block mb-1 font-bold text-primary-500">Main language</span>
                                        <p className="text-dark text-[15px]">{mainLanguageName}</p>
                                    </div>
                                )}
                                {mainAreaName && isFieldVisible("main_area_of_expertise", true) && (
                                    <div>
                                        <span className="text-xs uppercase block mb-1 font-bold text-primary-500">Main area of expertise</span>
                                        <p className="text-dark text-[15px]">{mainAreaName}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'Posts' && (
                        <div className="py-8 text-center text-gray-500">
                            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <p>No posts available yet</p>
                            {isOwnProfile && (
                                <p className="text-sm mt-1">Start creating content to share with your network.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'Events' && (
                        <div className="py-8 text-center text-gray-500">
                            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p>No events to display</p>
                        </div>
                    )}

                    {activeTab === 'Services' && (
                        <div className="py-8 text-center text-gray-500">
                            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <p>No services listed</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    role: string | null
                    first_name: string | null
                    last_name: string | null
                    full_name: string | null
                    avatar_url: string | null
                    company: string | null
                    position: string | null
                    linkedin_url: string | null
                    phone_number: string | null
                    nationality: string | null
                    profession: string | null
                    work_country: string | null
                    current_location: string | null
                    headline_user: string | null
                    main_language: string | null
                    main_area_of_expertise: string | null
                    username: string | null
                    profile_slug: string | null
                    metadata: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    role?: string | null
                    first_name?: string | null
                    last_name?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    company?: string | null
                    position?: string | null
                    linkedin_url?: string | null
                    phone_number?: string | null
                    nationality?: string | null
                    profession?: string | null
                    work_country?: string | null
                    current_location?: string | null
                    headline_user?: string | null
                    main_language?: string | null
                    main_area_of_expertise?: string | null
                    username?: string | null
                    profile_slug?: string | null
                    metadata?: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    role?: string | null
                    first_name?: string | null
                    last_name?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    company?: string | null
                    position?: string | null
                    linkedin_url?: string | null
                    phone_number?: string | null
                    nationality?: string | null
                    profession?: string | null
                    work_country?: string | null
                    current_location?: string | null
                    headline_user?: string | null
                    main_language?: string | null
                    main_area_of_expertise?: string | null
                    username?: string | null
                    profile_slug?: string | null
                    metadata?: Json
                    created_at?: string
                    updated_at?: string
                }
            }
            countries: {
                Row: {
                    id: number
                    display_name: string
                    iso_two: string
                    created_at: string
                }
                Insert: {
                    id?: number
                    display_name: string
                    iso_two: string
                    created_at?: string
                }
                Update: {
                    id?: number
                    display_name?: string
                    iso_two?: string
                    created_at?: string
                }
            }
            events: {
                Row: {
                    id: string
                    slug: string
                    title: string
                    description: string | null
                    start_date: string | null
                    end_date: string | null
                    location: string | null
                    organizer_id: string | null
                    image_url: string | null
                    is_virtual: boolean
                    metadata: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    slug: string
                    title: string
                    description?: string | null
                    start_date?: string | null
                    end_date?: string | null
                    location?: string | null
                    organizer_id?: string | null
                    image_url?: string | null
                    is_virtual?: boolean
                    metadata?: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    slug?: string
                    title?: string
                    description?: string | null
                    start_date?: string | null
                    end_date?: string | null
                    location?: string | null
                    organizer_id?: string | null
                    image_url?: string | null
                    is_virtual?: boolean
                    metadata?: Json
                    created_at?: string
                    updated_at?: string
                }
            }
            posts: {
                Row: {
                    id: string
                    slug: string
                    title: string
                    content: string | null
                    excerpt: string | null
                    published_at: string | null
                    featured_image_url: string | null
                    author_id: string | null
                    metadata: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    slug: string
                    title: string
                    content?: string | null
                    excerpt?: string | null
                    published_at?: string | null
                    featured_image_url?: string | null
                    author_id?: string | null
                    metadata?: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    slug?: string
                    title?: string
                    content?: string | null
                    excerpt?: string | null
                    published_at?: string | null
                    featured_image_url?: string | null
                    author_id?: string | null
                    metadata?: Json
                    created_at?: string
                    updated_at?: string
                }
            }
            // Similar structure for podcasts, talks, presentations, services, news, ads, country_managers
            podcasts: {
                Row: {
                    id: string
                    slug: string
                    title: string
                    description: string | null
                    audio_url: string | null
                    published_at: string | null
                    featured_image_url: string | null
                    author_id: string | null
                    metadata: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    slug: string
                    title: string
                    description?: string | null
                    audio_url?: string | null
                    published_at?: string | null
                    featured_image_url?: string | null
                    author_id?: string | null
                    metadata?: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    slug?: string
                    title?: string
                    description?: string | null
                    audio_url?: string | null
                    published_at?: string | null
                    featured_image_url?: string | null
                    author_id?: string | null
                    metadata?: Json
                    created_at?: string
                }
            },
            talks: {
                Row: {
                    id: string
                    slug: string
                    title: string
                    description: string | null
                    video_url: string | null
                    published_at: string | null
                    featured_image_url: string | null
                    author_id: string | null
                    metadata: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    slug: string
                    title: string
                    description?: string | null
                    video_url?: string | null
                    published_at?: string | null
                    featured_image_url?: string | null
                    author_id?: string | null
                    metadata?: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    slug?: string
                    title?: string
                    description?: string | null
                    video_url?: string | null
                    published_at?: string | null
                    featured_image_url?: string | null
                    author_id?: string | null
                    metadata?: Json
                    created_at?: string
                }
            },
            presentations: {
                Row: {
                    id: string
                    slug: string
                    title: string
                    description: string | null
                    file_url: string | null
                    published_at: string | null
                    featured_image_url: string | null
                    author_id: string | null
                    metadata: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    slug: string
                    title: string
                    description?: string | null
                    file_url?: string | null
                    published_at?: string | null
                    featured_image_url?: string | null
                    author_id?: string | null
                    metadata?: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    slug?: string
                    title?: string
                    description?: string | null
                    file_url?: string | null
                    published_at?: string | null
                    featured_image_url?: string | null
                    author_id?: string | null
                    metadata?: Json
                    created_at?: string
                }
            },
            services: {
                Row: {
                    id: string
                    slug: string
                    title: string
                    content: string | null
                    featured_image_url: string | null
                    menu_order: number
                    metadata: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    slug: string
                    title: string
                    content?: string | null
                    featured_image_url?: string | null
                    menu_order?: number
                    metadata?: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    slug?: string
                    title?: string
                    content?: string | null
                    featured_image_url?: string | null
                    menu_order?: number
                    metadata?: Json
                    created_at?: string
                }
            },
            news: {
                Row: {
                    id: string
                    slug: string
                    title: string
                    content: string | null
                    excerpt: string | null
                    published_at: string | null
                    featured_image_url: string | null
                    author_id: string | null
                    metadata: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    slug: string
                    title: string
                    content?: string | null
                    excerpt?: string | null
                    published_at?: string | null
                    featured_image_url?: string | null
                    author_id?: string | null
                    metadata?: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    slug?: string
                    title?: string
                    content?: string | null
                    excerpt?: string | null
                    published_at?: string | null
                    featured_image_url?: string | null
                    author_id?: string | null
                    metadata?: Json
                    created_at?: string
                }
            },
            ads: {
                Row: {
                    id: string
                    slug: string
                    title: string
                    content: string | null
                    image_url: string | null
                    link_url: string | null
                    location: string | null
                    published_at: string | null
                    metadata: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    slug: string
                    title: string
                    content?: string | null
                    image_url?: string | null
                    link_url?: string | null
                    location?: string | null
                    published_at?: string | null
                    metadata?: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    slug?: string
                    title?: string
                    content?: string | null
                    image_url?: string | null
                    link_url?: string | null
                    location?: string | null
                    published_at?: string | null
                    metadata?: Json
                    created_at?: string
                }
            },
            country_managers: {
                Row: {
                    id: string
                    slug: string
                    title: string
                    bio: string | null
                    country: string | null
                    image_url: string | null
                    email: string | null
                    linkedin_url: string | null
                    published_at: string | null
                    metadata: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    slug: string
                    title: string
                    bio?: string | null
                    country?: string | null
                    image_url?: string | null
                    email?: string | null
                    linkedin_url?: string | null
                    published_at?: string | null
                    metadata?: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    slug?: string
                    title?: string
                    bio?: string | null
                    country?: string | null
                    image_url?: string | null
                    email?: string | null
                    linkedin_url?: string | null
                    published_at?: string | null
                    metadata?: Json
                    created_at?: string
                }
            },
            topics: {
                Row: {
                    id: string
                    slug: string
                    name: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    slug: string
                    name: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    slug?: string
                    name?: string
                    created_at?: string
                }
            },
            bookmarks: {
                Row: {
                    id: string
                    user_id: string
                    content_id: string
                    content_type: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    content_id: string
                    content_type: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    content_id?: string
                    content_type?: string
                    created_at?: string
                }
            },
            // Junctions generic definition (can be explicit if needed, but usually just join tables)
            posts_topics: {
                Row: { posts_id: string; topic_id: string }
                Insert: { posts_id: string; topic_id: string }
                Update: { posts_id?: string; topic_id?: string }
            }
            // ... assume others act similarly
        }
    }
}

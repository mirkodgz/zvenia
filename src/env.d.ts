
/// <reference path="../.astro/types.d.ts" />

interface WindowEventMap {
    'open-edit-modal': CustomEvent<{ type: string; id: string }>;
}

/// <reference types="astro/client" />
/// <reference types="@astrojs/react" />

import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "./types/database.types";

declare global {
    namespace App {
        interface Locals {
            supabase: SupabaseClient<Database>;
            user: (User & { role?: string; country?: string | null }) | null;
            session: import('@supabase/supabase-js').Session | null;
            profile: {
                id: string;
                email: string;
                role: string; // Use string or specific UserRole if imported
                full_name: string;
                avatar_url: string | null;
                profile_slug: string | null;
            } | null;
            country?: string;
        }
    }
}

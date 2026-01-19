
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
        }
    }
}


import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../lib/supabase";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
    // 1. Standard Supabase SignOut
    const supabase = createSupabaseServerClient({ req: request, cookies });
    await supabase.auth.signOut();

    // 2. Force Cleanup (Double Tap)
    // Supabase cookies usually look like: sb-<project-ref>-auth-token
    // We try to find and delete ANY cookie starting with 'sb-' just to be safe, 
    // or specifically the one for this project if we knew the ref dynamically.
    // For now, we rely on the improved 'remove' in lib/supabase.ts, 
    // but we can also manually clear the main ones if we suspect persistence.

    // Explicitly clearing common potential sticky cookies
    cookies.delete("sb-access-token", { path: "/" });
    cookies.delete("sb-refresh-token", { path: "/" });

    // Assuming project ref is ddgdtdhgaqeqnoigmfrh from user's env
    const projectRef = "ddgdtdhgaqeqnoigmfrh";
    cookies.delete(`sb-${projectRef}-auth-token`, { path: "/" });

    return redirect("/", 302);
};

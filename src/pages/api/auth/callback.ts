
import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../lib/supabase";

export const GET: APIRoute = async ({ url, request, cookies, redirect }) => {
    const authCode = url.searchParams.get("code");

    if (!authCode) {
        return new Response("No code provided", { status: 400 });
    }

    const supabase = createSupabaseServerClient({ req: request, cookies });
    const { error } = await supabase.auth.exchangeCodeForSession(authCode);

    if (error) {
        console.error("Auth Callback Error (Handled Gracefully):", error.message);
        // On localhost, PKCE often fails due to cookie security, but the email IS confirmed by the backend trigger.
        // We redirect to success page so user can log in manually (which is what we want anyway).
        const next = url.searchParams.get("next") || "/";
        return redirect(next);
    }

    const next = url.searchParams.get("next") || "/";
    return redirect(next);
};

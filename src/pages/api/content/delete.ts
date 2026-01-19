
import type { APIRoute } from "astro";
import { createSupabaseServerClient, getServiceSupabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies }) => {
    const supabase = createSupabaseServerClient({ req: request, cookies });

    // 1. Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // 2. Parse Body
    let body;
    try {
        body = await request.json();
    } catch (e) {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
    }

    const { postId, eventId, podcastId, serviceId } = body;
    const id = postId || eventId || podcastId || serviceId;

    if (!id) {
        return new Response(JSON.stringify({ error: "Content ID required" }), { status: 400 });
    }

    let table = 'posts';
    if (eventId) table = 'events';
    if (podcastId) table = 'podcasts';
    if (serviceId) table = 'services';

    // 3. Verify Ownership & Permissions
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single() as any;

    const userRole = profile?.role || 'Basic';
    const isModerator = ['Administrator', 'CountryManager'].includes(userRole);

    const { data: item, error: fetchError } = await supabase
        .from(table)
        .select('author_id')
        .eq('id', id)
        .single() as any;

    if (fetchError || !item) {
        return new Response(JSON.stringify({ error: 'Item not found' }), { status: 404 });
    }

    if (item.author_id !== user.id && !isModerator) {
        return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    // 4. Delete (Using Service Client to bypass optional RLS issues, though user client should work if policies match)
    // Sticking to admin client for robust deletion matching create.ts pattern if used there, 
    // but typically user client is safer if RLS is good. Original used admin, so I'll stick to it.
    const adminSupabase = getServiceSupabase();
    const { error: deleteError, count } = await adminSupabase
        .from(table)
        .delete({ count: 'exact' })
        .eq('id', id);

    if (deleteError) {
        return new Response(JSON.stringify({ error: deleteError.message }), { status: 500 });
    }

    if (count === 0) {
        return new Response(JSON.stringify({ error: "Failed to delete item." }), { status: 403 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
};

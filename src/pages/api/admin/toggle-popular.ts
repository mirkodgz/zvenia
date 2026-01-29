import type { APIRoute } from "astro";
import { createSupabaseServerClient, getServiceSupabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies }) => {
    const supabase = createSupabaseServerClient({ req: request, cookies });

    // 1. Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // 2. Role Check (Admin Only)
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single() as any;

    const role = profile?.role || 'Basic';
    if (role !== 'Administrator') {
        return new Response(JSON.stringify({ error: "Forbidden: Admins only" }), { status: 403 });
    }

    // 3. Parse Body
    let body;
    try {
        body = await request.json();
    } catch (e) {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
    }

    const { id, type, isPopular } = body;

    // 4. Determine Table
    let table = 'posts';
    let idField = 'id';

    switch (type) {
        case 'post':
            table = 'posts';
            break;
        case 'event':
            table = 'events';
            break;
        case 'podcast':
            table = 'podcasts';
            break;
        case 'service':
            table = 'services';
            break;
        default:
            // Fallback for backward compatibility if old payload (postId) is used, though we should update callers.
            if (body.postId) {
                table = 'posts';
                // id is covered below if we map it
            } else {
                return new Response(JSON.stringify({ error: "Invalid type" }), { status: 400 });
            }
    }

    const targetId = id || body.postId;

    // 5. Update Record
    const serviceSupabase = getServiceSupabase();

    const { error } = await (serviceSupabase
        .from(table) as any)
        .update({ is_popular: isPopular })
        .eq('id', targetId);

    if (error) {
        console.error(`Error toggling popular for ${table}:${targetId}`, error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, is_popular: isPopular }), { status: 200 });
};

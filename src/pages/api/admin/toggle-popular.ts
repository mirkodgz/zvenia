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

    const { postId, isPopular } = body;

    // 4. Update Post (Service Role to bypass policies if necessary, but standard update should work for admin if checks exist)
    // Using Service Role to be safe as "Popular" state might be protected content field.
    const serviceSupabase = getServiceSupabase();

    const { error } = await (serviceSupabase
        .from('posts') as any)
        .update({ is_popular: isPopular })
        .eq('id', postId);

    if (error) {
        console.error("Error toggling popular:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, is_popular: isPopular }), { status: 200 });
};

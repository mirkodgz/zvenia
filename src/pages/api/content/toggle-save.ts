import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../lib/supabase";

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

    const { item_id, item_type } = body;

    if (!item_id || !item_type) {
        return new Response(JSON.stringify({ error: "Missing item_id or item_type" }), { status: 400 });
    }

    // 3. Check if already saved
    const { data: existing } = await supabase
        .from('saved_items')
        .select('id')
        .eq('user_id', user.id)
        .eq('item_id', item_id)
        .eq('item_type', item_type)
        .single();

    let saved = false;

    if (existing) {
        // DELETE
        const { error: deleteError } = await supabase
            .from('saved_items')
            .delete()
            .eq('id', existing.id);

        if (deleteError) {
            return new Response(JSON.stringify({ error: deleteError.message }), { status: 500 });
        }
        saved = false;
    } else {
        // INSERT
        const { error: insertError } = await supabase
            .from('saved_items')
            .insert({
                user_id: user.id,
                item_id: item_id,
                item_type: item_type
            });

        if (insertError) {
            return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
        }
        saved = true;
    }

    return new Response(JSON.stringify({ success: true, saved }), { status: 200 });
};

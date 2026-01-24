
import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../lib/supabase";

export const GET: APIRoute = async ({ request, cookies }) => {
    const supabase = createSupabaseServerClient({ req: request, cookies });

    const { data, error } = await supabase
        .from("countries")
        .select("id, name")
        .order("name");

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
};

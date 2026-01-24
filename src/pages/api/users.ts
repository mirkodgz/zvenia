
import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../lib/supabase";

export const GET: APIRoute = async ({ request, cookies }) => {
    const supabase = createSupabaseServerClient({ req: request, cookies });

    // Parse query params
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "12");
    const search = url.searchParams.get("search");
    const role = url.searchParams.get("role");
    const country = url.searchParams.get("country");

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    // Build query with filters
    let query = supabase
        .from("profiles")
        .select("id, profile_slug, full_name, email, avatar_url, profession, created_at, role, nationality, work_country", { count: "exact" });

    // Apply filters
    if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (role && role !== "All") {
        query = query.eq("role", role);
    }

    if (country && country !== "All") {
        query = query.eq("work_country", country);
    }

    // Execute query with pagination
    const { data, count, error } = await query
        .order("created_at", { ascending: false })
        .range(start, end);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({
        users: data,
        total: count,
        page,
        totalPages: Math.ceil((count || 0) / limit)
    }), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
};

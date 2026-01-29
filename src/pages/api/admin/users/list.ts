
import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import { isAdministrator } from "../../../../lib/admin/roles";

const createSupabaseAdmin = () => createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

export const GET: APIRoute = async ({ request, locals, cookies }) => {
    // 1. Verify Requesting User is Admin
    // We check session or locals. Locals is preferred if middleware is running.

    // Fallback: Check headers cookie if locals not populated (though middleware should handle it)
    const supabaseAdmin = createSupabaseAdmin();

    const supabaseAuth = createClient(
        import.meta.env.PUBLIC_SUPABASE_URL,
        import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
        {
            global: { headers: { Cookie: request.headers.get("cookie") || "" } }
        }
    );

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();

    if (authError || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Check Profile Role
    const { data: requesterProfile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!requesterProfile || !isAdministrator(requesterProfile.role as any)) {
        return new Response(JSON.stringify({ error: "Forbidden: Admins only" }), { status: 403 });
    }

    // 2. Parse Query Params
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "0");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "20");
    const search = url.searchParams.get("search") || "";

    // 3. Fetch Users
    let query = supabaseAdmin
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1);

    if (search) {
        query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%,username.ilike.%${search}%`);
    }

    const { data, count, error } = await query;

    if (error) {
        console.error("Error fetching users list:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({
        users: data,
        total: count,
        page,
        pageSize
    }), { status: 200 });
};

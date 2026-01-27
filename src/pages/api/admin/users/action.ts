
import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import { isAdministrator } from "../../../../lib/admin/roles";

// Service Role Client for Admin Actions (Bypasses RLS)
// Helper to create Admin Client on demand to ensure Envs are loaded
const createSupabaseAdmin = () => createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

export const DELETE: APIRoute = async ({ request, cookies }) => {
    // 1. Verify Requesting User is Admin
    // We can't trust client-side claims. We verify the session cookie.

    const supabaseAdmin = createSupabaseAdmin(); // Init here

    // ... (keep verification logic) ...
    // We recreate a standard client to check the cookie (user session)
    const supabaseAuth = createClient(
        import.meta.env.PUBLIC_SUPABASE_URL,
        import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
        {
            global: { headers: { Cookie: request.headers.get("cookie") || "" } }
        }
    );

    // Check Auth
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


    // Debugging Role Mismatch
    console.log("[ADMIN DEBUG] User ID:", user.id);
    console.log("[ADMIN DEBUG] Profile Found:", requesterProfile);
    console.log("[ADMIN DEBUG] Role in DB:", requesterProfile?.role);
    console.log("[ADMIN DEBUG] Expected Role:", "Administrator");
    console.log("[ADMIN DEBUG] isAdministrator check:", requesterProfile ? isAdministrator(requesterProfile.role as any) : "No Profile");

    if (!requesterProfile || !isAdministrator(requesterProfile.role as any)) {

        return new Response(JSON.stringify({ error: "Forbidden: Admins only" }), { status: 403 });
    }

    // 2. Perform Deletion
    const url = new URL(request.url);
    const targetUserId = url.searchParams.get("id");

    if (!targetUserId) {
        return new Response(JSON.stringify({ error: "Missing ID" }), { status: 400 });
    }

    if (targetUserId === user.id) {
        return new Response(JSON.stringify({ error: "Cannot delete yourself" }), { status: 400 });
    }

    console.log(`[ADMIN] Deleting user: ${targetUserId}`);

    // Delete from Auth (This cascades to profile usually, but we delete profile first to be clean)
    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(targetUserId);

    if (deleteAuthError) {
        console.error("Delete Error:", deleteAuthError);
        return new Response(JSON.stringify({ error: deleteAuthError.message }), { status: 500 });
    }

    // Explicitly ensure profile is gone (if cascade didn't catch it)
    await supabaseAdmin.from('profiles').delete().eq('id', targetUserId);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
};

export const POST: APIRoute = async ({ request, locals }) => {

    const supabaseAdmin = createSupabaseAdmin(); // Init here

    const user = locals.user;
    const profile = locals.profile;

    // Debugging Locals
    console.log("[ADMIN POST DEBUG] Locals User ID:", user?.id);
    console.log("[ADMIN POST DEBUG] Locals Profile Role:", profile?.role);

    if (!user || !profile) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    if (!isAdministrator(profile.role as any)) {
        return new Response(JSON.stringify({ error: "Forbidden: Admins only" }), { status: 403 });
    }

    // 2. Create User
    const body = await request.json();
    const { email, password, role, fullName } = body;

    if (!email || !password) {
        return new Response(JSON.stringify({ error: "Email and password required" }), { status: 400 });
    }



    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            full_name: fullName,
            role: role || 'Basic'
        }
    });

    if (createError) {
        console.error("[ADMIN CREATE ERROR] Supabase createUser failed:", createError);
        return new Response(JSON.stringify({ error: createError.message }), { status: 500 });
    }

    // Force Profile Upsert (in case trigger fails or we want specific role)
    if (newUser.user) {
        await supabaseAdmin.from('profiles').upsert({
            id: newUser.user.id,
            email: email,
            role: role || 'Basic',
            full_name: fullName,
            created_at: new Date().toISOString()
        });
    }

    return new Response(JSON.stringify({ success: true, user: newUser.user }), { status: 200 });
};

export const PUT: APIRoute = async ({ request, locals }) => {
    // 1. Verify Admin (using locals populated by middleware)
    const { user, profile } = locals;

    if (!user || !profile || !isAdministrator(profile.role as any)) {
        return new Response(JSON.stringify({ error: "Forbidden: Admins only" }), { status: 403 });
    }

    const serviceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
        console.error("[CRITICAL] Missing SUPABASE_SERVICE_ROLE_KEY in API Route");
        return new Response(JSON.stringify({ error: "Server Configuration Error: Missing Admin Key" }), { status: 500 });
    }

    const supabaseAdmin = createSupabaseAdmin();

    // 2. Parse Body
    const body = await request.json();
    const { id, role, country } = body;

    if (!id) {
        return new Response(JSON.stringify({ error: "Missing User ID" }), { status: 400 });
    }

    console.log(`[ADMIN PUT] Attempting update for User ID: ${id}`);
    console.log(`[ADMIN PUT] New Data -> Role: ${role}, Country: ${country}`);

    // 3. Update via Service Role (Bypass RLS)
    const { data, error } = await supabaseAdmin
        .from('profiles')
        .update({
            role: role,
            country: country || null
        })
        .eq('id', id)
        .select();

    if (error) {
        console.error("[ADMIN PUT] Update Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    if (!data || data.length === 0) {
        console.error("[ADMIN PUT] Update succeeded but NO rows were returned. ID mismatch?");
        return new Response(JSON.stringify({ error: "User not found or update failed silently" }), { status: 404 });
    }

    console.log("[ADMIN PUT] Success. Updated Row:", data[0]);

    return new Response(JSON.stringify({ success: true, user: data[0] }), { status: 200 });
};

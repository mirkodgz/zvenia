
import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../lib/supabase";
import { createClient } from "@supabase/supabase-js";

const createSupabaseAdmin = () => createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);

export const POST: APIRoute = async ({ request, cookies, redirect, url }) => {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const firstName = formData.get("first-name")?.toString();
    const lastName = formData.get("last-name")?.toString();
    const profession = formData.get("profession")?.toString();
    const country = formData.get("country")?.toString();

    if (!email || !password) {
        return new Response("Email and password are required", { status: 400 });
    }

    const supabase = createSupabaseServerClient({ req: request, cookies });
    const origin = url.origin;

    const username = email.split('@')[0];

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/api/auth/callback?next=/verification-success`,
            data: {
                full_name: `${firstName} ${lastName}`.trim(),
                first_name: firstName,
                last_name: lastName,
                username,
                role: 'Basic',
                profession,
                country,
            }
        }
    });

    if (error) {
        console.error("Signup Error:", error);
        return new Response(JSON.stringify({
            message: error.message,
            code: error.status,
            name: error.name,
            details: (error as any).cause || (error as any).stack
        }, null, 2), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // ---------------------------------------------------------
    // MANUAL PROFILE CREATION (Since Triggers are Disabled)
    // ---------------------------------------------------------
    if (data.user) {
        const supabaseAdmin = createSupabaseAdmin();
        const MAX_RETRIES = 3;
        let profileCreated = false;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                // Pequeño delay para asegurar consistencia if auth.users propagation is slow
                if (attempt > 1) await new Promise(r => setTimeout(r, 1000));

                const { error: profileError } = await supabaseAdmin.from('profiles').insert({
                    id: data.user.id,
                    email: email,
                    username: username,
                    full_name: `${firstName} ${lastName}`.trim(),
                    first_name: firstName,
                    last_name: lastName,
                    role: 'Basic',
                    profession: profession,
                    country: country,
                    avatar_url: '',
                });

                if (!profileError) {
                    profileCreated = true;
                    break;
                } else {
                    console.warn(`[Signup] Attempt ${attempt} failed to create profile:`, profileError.message);
                }
            } catch (err) {
                console.error(`[Signup] Attempt ${attempt} exception:`, err);
            }
        }

        if (!profileCreated) {
            console.error("[CRITICAL] Failed to create profile for user:", data.user.id);
            // No fallamos el request para no asustar al usuario. 
            // El usuario ya existe en Auth, podrá confirmar email y entrar.
            // El perfil se podrá crear luego o manejar como 'sin perfil'.
        }
    }

    return redirect("/verify-email");
};

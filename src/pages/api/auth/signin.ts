
import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../lib/supabase";
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
const SERVICE_KEY = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = SUPABASE_URL && SERVICE_KEY ? createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
}) : null;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
        return new Response("Email and password are required", { status: 400 });
    }

    const supabase = createSupabaseServerClient({ req: request, cookies });

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        // Si es "Invalid login credentials", verificar si es usuario migrado
        if (error.message === "Invalid login credentials" && supabaseAdmin) {
            // Verificar si el usuario existe en profiles (usuario migrado)
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('id, email')
                .eq('email', email)
                .single();

            if (profile) {
                // Es un usuario migrado - enviar email automático
                try {
                    const emailResponse = await fetch(`${new URL(request.url).origin}/api/auth/send-migration-email`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({ email })
                    });
                    const emailData = await emailResponse.json();
                } catch (e) {
                    // Ignorar errores de envío de email
                    console.error('Error enviando email de migración:', e);
                }

                return new Response(JSON.stringify({ 
                    error: "We've migrated to a new platform! Your password needs to be reset. We've sent you an email with instructions to reset your password.",
                    code: "migration_required",
                    emailSent: true
                }), { 
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                });
            }
        }
        
        return new Response(JSON.stringify({ 
            error: error.message,
            code: error.status || 400
        }), { 
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    return redirect("/");
};

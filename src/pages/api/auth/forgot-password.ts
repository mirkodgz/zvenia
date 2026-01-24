import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();

    if (!email) {
        return new Response(JSON.stringify({ error: "Email is required" }), { 
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    const supabase = createSupabaseServerClient({ req: request, cookies });

    // Generar link de reset de password
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${new URL(request.url).origin}/reset-password`,
    });

    if (error) {
        // No revelar si el email existe o no (seguridad)
        return new Response(JSON.stringify({ 
            message: "If an account exists with this email, a password reset link has been sent."
        }), { 
            status: 200, // Siempre retornar 200 para no revelar si el email existe
            headers: { "Content-Type": "application/json" }
        });
    }

    return new Response(JSON.stringify({ 
        message: "If an account exists with this email, a password reset link has been sent."
    }), { 
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
};


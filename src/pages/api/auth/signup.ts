
import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../lib/supabase";

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

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/api/auth/callback?next=/verification-success`,
            data: {
                full_name: `${firstName} ${lastName}`.trim(),
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

    return redirect("/verify-email");
};

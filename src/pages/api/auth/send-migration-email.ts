import type { APIRoute } from "astro";
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
const SERVICE_KEY = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;

const supabaseAdmin = SUPABASE_URL && SERVICE_KEY ? createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
}) : null;

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

/**
 * Template de Email HTML para Migración
 */
function getEmailTemplate(firstName: string, resetLink: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ZVENIA</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #202124; max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #0d241b; font-size: 28px; margin-bottom: 10px;">Welcome to the New ZVENIA</h1>
        <p style="color: #00c44b; font-size: 16px; font-weight: 600;">Only Expert Knowledge</p>
    </div>

    <!-- Main Content -->
    <div style="background-color: #f3f3f3; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #0d241b; font-size: 20px; margin-top: 0;">We've Upgraded Your Platform</h2>
        
        <p style="font-size: 15px; color: #202124;">
            Dear ${firstName || 'Valued Member'},
        </p>
        
        <p style="font-size: 15px; color: #202124;">
            We noticed you tried to log in to your ZVENIA account. We've upgraded to a new, more powerful platform!
        </p>
        
        <p style="font-size: 15px; color: #202124; margin-top: 20px;">
            <strong>To access your account, you'll need to reset your password.</strong> 
            This is a one-time security measure to ensure your account is fully protected on our new platform.
        </p>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" 
           style="display: inline-block; background-color: #00c44b; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
            Reset Your Password
        </a>
    </div>

    <!-- Alternative Link -->
    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; margin-bottom: 20px;">
        <p style="font-size: 13px; color: #666; margin: 0;">
            If the button doesn't work, copy and paste this link into your browser:
        </p>
        <p style="font-size: 13px; color: #00c44b; word-break: break-all; margin: 5px 0 0 0;">
            ${resetLink}
        </p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
        <p style="font-size: 12px; color: #666; margin: 5px 0;">
            ZVENIA © 2026 All Rights Reserved.
        </p>
    </div>

</body>
</html>
    `.trim();
}

export const POST: APIRoute = async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();

    if (!email) {
        return new Response(JSON.stringify({ error: "Email is required" }), { 
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    if (!resend) {
        return new Response(JSON.stringify({ error: "Email service not configured" }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }

    if (!supabaseAdmin) {
        return new Response(JSON.stringify({ error: "Service not configured" }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }

    // Verificar si el usuario existe en profiles
    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id, email, full_name')
        .eq('email', email)
        .single();

    if (!profile) {
        // Usuario no existe, no enviar email
        return new Response(JSON.stringify({ 
            message: "If an account exists with this email, a password reset link has been sent."
        }), { 
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    }

    // Generar link de reset con redirect correcto
    const origin = new URL(request.url).origin;
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email: email,
        options: {
            redirectTo: `${origin}/reset-password`,
        }
    });

    if (linkError || !linkData) {
        return new Response(JSON.stringify({ 
            message: "If an account exists with this email, a password reset link has been sent."
        }), { 
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    }

    const resetLink = linkData.properties.action_link;
    const firstName = profile.full_name ? profile.full_name.split(' ')[0] : null;

    // Enviar email usando Resend
    try {
        const emailHtml = getEmailTemplate(firstName || 'Valued Member', resetLink);
        
        // Determinar email destino (solo emails verificados si no hay dominio verificado)
        const verifiedEmail = import.meta.env.VERIFIED_EMAIL || 'mirko@dgzconsulting.com';
        const useVerifiedEmail = !import.meta.env.VERIFIED_EMAIL; // Usar email verificado si no hay dominio configurado

        const { error: emailError } = await resend.emails.send({
            from: 'ZVENIA <onboarding@resend.dev>',
            to: useVerifiedEmail ? verifiedEmail : email,
            subject: 'Welcome to the New ZVENIA Platform - Reset Your Password',
            html: emailHtml,
        });

        if (emailError) {
            console.error('Error enviando email:', emailError);
            // No fallar, solo loggear el error
        }
    } catch (error) {
        console.error('Error enviando email:', error);
        // No fallar, solo loggear el error
    }

    return new Response(JSON.stringify({ 
        message: "If an account exists with this email, a password reset link has been sent."
    }), { 
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
};


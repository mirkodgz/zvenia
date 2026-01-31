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

import { wrapEmailLayout } from "../../../lib/email";

/**
 * Template de Email HTML para Migración
 */
function getEmailTemplate(firstName: string, resetLink: string): string {
    const mainContent = `
        <h2 style="color: #0d241b; font-size: 22px; margin-top: 0;">Actualiza tu cuenta</h2>
        
        <p style="font-size: 16px;">
            Hola ${firstName || 'miembro de ZVENIA'},
        </p>
        
        <p style="font-size: 16px;">
            Hemos actualizado ZVENIA a una nueva plataforma más potente. Esta mejora optimiza el rendimiento y la seguridad para nuestra comunidad exclusiva.
        </p>
        
        <p style="font-size: 16px; margin: 25px 0;">
            <strong>Para acceder a tu cuenta, es necesario que restablezcas tu contraseña por única vez:</strong>
        </p>

        <div style="text-align: center; margin: 35px 0;">
            <a href="${resetLink}" 
               style="display: inline-block; background-color: #00c44b; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                RESTABLECER MI CONTRASEÑA
            </a>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #00c44b;">
            <p style="font-size: 13px; color: #666; margin: 0;">
                Si el botón de arriba no funciona, copia y pega este enlace manualmente:
            </p>
            <p style="font-size: 13px; color: #00c44b; word-break: break-all; margin: 8px 0 0 0;">
                ${resetLink}
            </p>
        </div>
    `;

    return wrapEmailLayout(mainContent, {
        title: "Bienvenido a la nueva ZVENIA",
        previewText: "Tu cuenta de ZVENIA está lista. Por favor, restablece tu contraseña para acceder a la nueva plataforma."
    });
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


import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('❌ Missing Supabase environment variables');
    process.exit(1);
}

if (!RESEND_API_KEY) {
    console.error('❌ Missing RESEND_API_KEY in .env');
    console.error('   Get your API key from: https://resend.com/api-keys');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

const resend = new Resend(RESEND_API_KEY);

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
            We're excited to announce that ZVENIA has been upgraded to a new, more powerful platform! 
            This upgrade brings you:
        </p>
        
        <ul style="font-size: 15px; color: #202124; padding-left: 20px;">
            <li>Faster performance and better user experience</li>
            <li>Enhanced security and privacy features</li>
            <li>New tools and features for the mining community</li>
            <li>Improved content discovery and networking</li>
        </ul>
        
        <p style="font-size: 15px; color: #202124; margin-top: 20px;">
            <strong>To access your account, you'll need to reset your password.</strong> 
            This is a one-time security measure to ensure your account is fully protected on our new platform.
        </p>
        
        <p style="font-size: 14px; color: #666; margin-top: 15px; font-style: italic;">
            Our new platform launches on <strong>February 29, 2026</strong>. Reset your password now to be ready!
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

    <!-- Help Section -->
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #0d241b; font-size: 16px; margin-top: 0;">Need Help?</h3>
        <p style="font-size: 14px; color: #202124; margin-bottom: 10px;">
            If you have any questions or need assistance, please don't hesitate to contact us:
        </p>
        <p style="font-size: 14px; color: #202124; margin: 0;">
            📧 <a href="mailto:contact@zvenia.com" style="color: #00c44b; text-decoration: none;">contact@zvenia.com</a>
        </p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
        <p style="font-size: 12px; color: #666; margin: 5px 0;">
            ZVENIA © 2026 All Rights Reserved.
        </p>
        <p style="font-size: 12px; color: #666; margin: 5px 0;">
            This is an automated email. Please do not reply to this message.
        </p>
    </div>

</body>
</html>
    `.trim();
}

/**
 * Versión texto plano del email
 */
function getEmailText(firstName: string, resetLink: string): string {
    return `
Welcome to the New ZVENIA Platform

Dear ${firstName || 'Valued Member'},

We're excited to announce that ZVENIA has been upgraded to a new, more powerful platform!

This upgrade brings you:
- Faster performance and better user experience
- Enhanced security and privacy features
- New tools and features for the mining community
- Improved content discovery and networking

To access your account, you'll need to reset your password. This is a one-time security measure to ensure your account is fully protected on our new platform.

Our new platform launches on February 29, 2026. Reset your password now to be ready!

Reset Your Password:
${resetLink}

If the link doesn't work, copy and paste it into your browser.

Need Help?
If you have any questions or need assistance, please contact us at contact@zvenia.com

Best regards,
The ZVENIA Team

---
ZVENIA © 2026 All Rights Reserved.
This is an automated email. Please do not reply to this message.
    `.trim();
}

/**
 * Generar link de reset de password para un usuario
 */
async function generateResetLink(email: string): Promise<string | null> {
    try {
        const { data, error } = await supabase.auth.admin.generateLink({
            type: 'recovery',
            email: email,
        });

        if (error) {
            console.error(`❌ Error generando link para ${email}:`, error.message);
            return null;
        }

        return data.properties.action_link;
    } catch (error: any) {
        console.error(`❌ Error generando link para ${email}:`, error.message);
        return null;
    }
}

/**
 * Enviar email de migración usando Resend
 */
async function sendMigrationEmail(
    email: string, 
    firstName: string | null,
    resetLink: string
): Promise<boolean> {
    try {
        const emailHtml = getEmailTemplate(firstName || 'Valued Member', resetLink);
        const emailText = getEmailText(firstName || 'Valued Member', resetLink);

        const { data, error } = await resend.emails.send({
            from: 'ZVENIA <onboarding@resend.dev>', // Usa resend.dev por defecto (o cambia a tu dominio verificado)
            to: email,
            subject: 'Welcome to the New ZVENIA Platform - Reset Your Password',
            html: emailHtml,
            text: emailText,
        });

        if (error) {
            console.error(`❌ Error enviando email a ${email}:`, error);
            return false;
        }

        console.log(`✅ Email enviado a ${email} (ID: ${data?.id})`);
        return true;
    } catch (error: any) {
        console.error(`❌ Error enviando email a ${email}:`, error.message);
        return false;
    }
}

/**
 * Procesar todos los usuarios migrados
 */
async function main() {
    console.log('🚀 Iniciando envío de emails de migración...\n');
    console.log('📅 Fecha de envío: 20 de febrero, 2026');
    console.log('🚀 Lanzamiento: 29 de febrero, 2026\n');

    // Modo test: solo procesar 10 usuarios
    const TEST_MODE = process.env.TEST_MODE === 'true';
    const DRY_RUN = process.env.DRY_RUN === 'true';

    if (DRY_RUN) {
        console.log('⚠️  MODO DRY RUN: No se enviarán emails reales\n');
    }

    // Obtener todos los usuarios
    let allUsers: any[] = [];
    let page = 0;
    const pageSize = 1000;

    console.log('📋 Obteniendo lista de usuarios...');
    while (true) {
        const { data: { users }, error } = await supabase.auth.admin.listUsers({
            page: page,
            perPage: pageSize
        });

        if (error) {
            console.error('❌ Error listando usuarios:', error);
            break;
        }

        if (!users || users.length === 0) break;
        allUsers = allUsers.concat(users);
        if (users.length < pageSize) break;
        page++;
    }

    console.log(`✅ Total usuarios encontrados: ${allUsers.length}\n`);

    // Obtener perfiles para tener first_name
    const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, first_name')
        .in('id', allUsers.map(u => u.id));

    const profileMap = new Map(
        (profiles || []).map(p => [p.id, p])
    );

    // Procesar usuarios
    const limit = TEST_MODE ? 10 : allUsers.length;
    const usersToProcess = allUsers.slice(0, limit);

    console.log(`📧 Procesando ${usersToProcess.length} usuarios...\n`);

    let successCount = 0;
    let errorCount = 0;
    const errors: Array<{ email: string; error: string }> = [];

    for (let i = 0; i < usersToProcess.length; i++) {
        const user = usersToProcess[i];
        const profile = profileMap.get(user.id);
        const firstName = profile?.first_name || null;
        
        console.log(`[${i + 1}/${usersToProcess.length}] Procesando: ${user.email}`);

        // 1. Generar link de reset
        const resetLink = await generateResetLink(user.email!);
        
        if (!resetLink) {
            console.log(`   ⚠️ No se pudo generar link de reset`);
            errorCount++;
            errors.push({ email: user.email!, error: 'No se pudo generar link de reset' });
            continue;
        }

        // 2. Enviar email (solo si no es dry run)
        if (!DRY_RUN) {
            const sent = await sendMigrationEmail(user.email!, firstName, resetLink);
            if (sent) {
                successCount++;
            } else {
                errorCount++;
                errors.push({ email: user.email!, error: 'Error enviando email' });
            }
        } else {
            console.log(`   ✅ Link generado (DRY RUN - no enviado)`);
            successCount++;
        }

        // Delay para no sobrecargar Resend (rate limit: 100 emails/segundo)
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Resumen
    console.log(`\n${'='.repeat(50)}`);
    console.log(`📊 RESUMEN`);
    console.log(`${'='.repeat(50)}`);
    console.log(`✅ Emails enviados exitosamente: ${successCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log(`📧 Total procesados: ${usersToProcess.length}`);

    if (errors.length > 0) {
        console.log(`\n❌ Errores detallados:`);
        errors.forEach(({ email, error }) => {
            console.log(`   - ${email}: ${error}`);
        });
    }

    if (DRY_RUN) {
        console.log(`\n⚠️  Este fue un DRY RUN. Para enviar emails reales, ejecuta sin DRY_RUN=true`);
    }

    if (TEST_MODE) {
        console.log(`\n⚠️  MODO TEST: Solo se procesaron 10 usuarios.`);
        console.log(`   Para procesar todos, ejecuta sin TEST_MODE=true`);
    }
}

main().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});


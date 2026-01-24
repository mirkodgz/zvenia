import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('❌ Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

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
 * Enviar email de migración a un usuario
 * NOTA: Este script solo genera los links. Necesitas integrar un servicio de email
 * (Resend, SendGrid, Mailgun, etc.) para enviar los emails reales.
 */
async function sendMigrationEmail(email: string, firstName: string | null) {
    console.log(`📧 Procesando: ${email}`);
    
    // 1. Generar link de reset
    const resetLink = await generateResetLink(email);
    
    if (!resetLink) {
        console.log(`   ⚠️ No se pudo generar link de reset`);
        return null;
    }

    // 2. Generar template de email
    const emailHtml = getEmailTemplate(firstName || 'Valued Member', resetLink);
    
    // 3. Aquí deberías integrar tu servicio de email (Resend, SendGrid, etc.)
    // Por ahora, solo guardamos el template en un archivo para revisión
    
    return {
        email,
        firstName,
        resetLink,
        emailHtml,
    };
}

/**
 * Procesar todos los usuarios migrados
 */
async function main() {
    console.log('🚀 Iniciando envío de emails de migración...\n');

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

    // Procesar usuarios (limitado a 10 para prueba)
    const limit = process.env.TEST_MODE === 'true' ? 10 : allUsers.length;
    const usersToProcess = allUsers.slice(0, limit);

    console.log(`📧 Procesando ${usersToProcess.length} usuarios...\n`);

    const results: any[] = [];

    for (const user of usersToProcess) {
        const profile = profileMap.get(user.id);
        const firstName = profile?.first_name || null;
        
        const result = await sendMigrationEmail(user.email!, firstName);
        if (result) {
            results.push(result);
        }
        
        // Pequeño delay para no sobrecargar
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n✅ Procesados ${results.length} usuarios`);
    console.log(`\n📝 NOTA IMPORTANTE:`);
    console.log(`   Este script solo genera los links de reset.`);
    console.log(`   Para enviar los emails reales, necesitas:`);
    console.log(`   1. Integrar un servicio de email (Resend, SendGrid, Mailgun)`);
    console.log(`   2. Usar el template HTML generado`);
    console.log(`   3. Enviar a cada usuario con su link único`);
    console.log(`\n💡 Los templates están listos en la variable 'emailHtml' de cada resultado.`);
}

main().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});


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
            from: 'ZVENIA <onboarding@resend.dev>',
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
 * Enviar email a un usuario específico para testing
 */
async function main() {
    // Obtener email del argumento o usar el default
    const testEmail = process.argv[2] || 'g.zvenia@gmail.com';
    
    console.log('🧪 Enviando email de prueba a:', testEmail);
    console.log('📧 Este email te permitirá probar la experiencia completa\n');

    // Primero buscar en profiles (búsqueda flexible)
    console.log('🔍 Buscando en profiles...');
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .ilike('email', `%${testEmail}%`); // Búsqueda case-insensitive y parcial

    if (profileError) {
        console.error('❌ Error buscando en profiles:', profileError);
        process.exit(1);
    }

    if (!profiles || profiles.length === 0) {
        console.error(`❌ Usuario ${testEmail} no encontrado en profiles`);
        console.log('\n💡 Verifica que el email sea correcto');
        process.exit(1);
    }

    // Si hay múltiples resultados, buscar el más exacto
    let profile = profiles.find(p => p.email?.toLowerCase() === testEmail.toLowerCase());
    if (!profile) {
        profile = profiles[0]; // Usar el primero si no hay match exacto
        console.log(`⚠️ Encontrado email similar: ${profile.email}`);
    }

    console.log(`✅ Usuario encontrado en profiles: ${profile.email}`);
    console.log(`   ID: ${profile.id}\n`);

    // Buscar directamente en auth.users por ID
    console.log('🔍 Buscando en auth.users...');
    let authUser;
    
    const { data: { user: userById }, error: getUserError } = await supabase.auth.admin.getUserById(profile.id);
    
    if (!getUserError && userById) {
        authUser = userById;
    } else {
        // Si no se encuentra por ID, buscar por email
        console.log('   No encontrado por ID, buscando por email...');
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        
        if (listError) {
            console.error('❌ Error listando usuarios:', listError);
            process.exit(1);
        }

        const foundUser = users?.find(u => u.email?.toLowerCase() === testEmail.toLowerCase());
        
        if (!foundUser) {
            console.error(`⚠️ Usuario encontrado en profiles pero NO en auth.users`);
            console.log(`\n💡 Esto significa que el usuario existe en la base de datos pero no tiene cuenta de autenticación.`);
            console.log(`   Ejecuta: npm run create-auth-user ${testEmail}`);
            console.log(`\n   ID del perfil: ${profile.id}`);
            process.exit(1);
        }
        
        authUser = foundUser;
    }
    
    const user = authUser;

    console.log(`✅ Usuario encontrado en auth.users: ${user.email}`);
    console.log(`   ID: ${user.id}\n`);

    // Extraer first_name de full_name si existe
    const fullName = profile?.full_name || null;
    const firstName = fullName ? fullName.split(' ')[0] : null;
    console.log(`📝 Nombre: ${firstName || 'No disponible'}\n`);

    // Generar link de reset
    console.log('🔗 Generando link de reset...');
    const resetLink = await generateResetLink(testEmail);
    
    if (!resetLink) {
        console.error('❌ No se pudo generar el link de reset');
        process.exit(1);
    }

    console.log(`✅ Link generado: ${resetLink.substring(0, 50)}...\n`);

    // Enviar email
    // NOTA: Resend solo permite enviar a emails verificados cuando usas dominio por defecto
    // Para pruebas, usamos el email verificado del usuario (mirko@dgzconsulting.com)
    // pero el link de reset sigue siendo para el usuario original
    const verifiedEmail = 'mirko@dgzconsulting.com'; // Email verificado en Resend
    
    console.log(`\n⚠️  IMPORTANTE: Resend solo permite enviar a emails verificados`);
    console.log(`   Enviando a: ${verifiedEmail}`);
    console.log(`   Pero el link de reset es para: ${testEmail}`);
    console.log(`   (Para enviar a otros emails, verifica el dominio zvenia.com en Resend)\n`);
    
    console.log('📧 Enviando email...');
    const sent = await sendMigrationEmail(verifiedEmail, firstName, resetLink);
    
    if (sent) {
        console.log('\n✅ ¡Email enviado exitosamente!');
        console.log('\n📋 Próximos pasos:');
        console.log('   1. Revisa tu bandeja de entrada (y spam)');
        console.log('   2. Si no llega, espera 5 minutos (puede haber delay)');
        console.log('   3. Verifica en Resend Dashboard: https://resend.com/emails');
        console.log('   4. Abre el email');
        console.log('   5. Haz click en "Reset Your Password"');
        console.log('   6. Serás redirigido a /reset-password');
        console.log('   7. Establece tu nueva contraseña');
        console.log('   8. Inicia sesión con tu nueva contraseña');
        console.log('\n🔗 Link de reset (por si no llega el email):');
        console.log(`   ${resetLink}`);
        console.log('\n💡 Puedes copiar este link y abrirlo directamente en el navegador');
    } else {
        console.error('\n❌ Error enviando el email');
        process.exit(1);
    }
}

main().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});


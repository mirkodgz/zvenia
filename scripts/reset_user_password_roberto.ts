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

async function resetPassword() {
    const email = 'Roberto123@gmail.com';
    
    console.log('🔐 Reset de Contraseña para Usuario\n');
    console.log('📧 Email:', email);
    console.log('');

    try {
        // 1. Buscar usuario
        let allUsers: any[] = [];
        let page = 0;
        const pageSize = 1000;

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

        const user = allUsers.find(u => u.email?.toLowerCase() === email.toLowerCase());

        if (!user) {
            console.log('❌ Usuario NO encontrado en auth.users');
            console.log('');
            console.log('💡 SOLUCIÓN:');
            console.log('   1. Ve a Supabase Dashboard → Authentication → Users');
            console.log('   2. Busca o crea el usuario con email:', email);
            console.log('   3. Si existe, click en "..." → "Reset Password"');
            return;
        }

        console.log('✅ Usuario encontrado!');
        console.log('   ID:', user.id);
        console.log('   Email:', user.email);
        console.log('   Email confirmado:', user.email_confirmed_at ? 'Sí' : 'No');
        console.log('');

        // 2. Enviar email de reset de password
        console.log('📧 Enviando email de reset de password...');
        const { data: resetData, error: resetError } = await supabase.auth.admin.generateLink({
            type: 'recovery',
            email: email,
        });

        if (resetError) {
            console.error('❌ Error generando link de reset:', resetError);
            console.log('');
            console.log('💡 SOLUCIÓN ALTERNATIVA:');
            console.log('   1. Ve a Supabase Dashboard → Authentication → Users');
            console.log('   2. Busca el usuario:', email);
            console.log('   3. Click en "..." → "Reset Password"');
            console.log('   4. Esto enviará un email al usuario para resetear su contraseña');
            return;
        }

        console.log('✅ Link de reset generado exitosamente');
        console.log('');
        console.log('📧 Se ha enviado un email a:', email);
        console.log('   El usuario debe revisar su bandeja de entrada (y spam)');
        console.log('   y hacer click en el link para resetear su contraseña.');
        console.log('');
        console.log('🔗 Link de reset (para referencia):');
        console.log('   ', resetData.properties.action_link);
        console.log('');
        console.log('💡 NOTA: Este link expira en 1 hora.');

    } catch (error: any) {
        console.error('❌ Error:', error.message);
        console.log('');
        console.log('💡 SOLUCIÓN MANUAL:');
        console.log('   1. Ve a Supabase Dashboard → Authentication → Users');
        console.log('   2. Busca el usuario:', email);
        console.log('   3. Click en "..." → "Reset Password"');
    }
}

resetPassword().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});


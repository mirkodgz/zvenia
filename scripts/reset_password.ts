import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as readline from 'readline';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Faltan variables de entorno:');
    console.error('   - PUBLIC_SUPABASE_URL');
    console.error('   - SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query: string): Promise<string> {
    return new Promise(resolve => rl.question(query, resolve));
}

async function resetPassword() {
    const email = 'mirkodgzbusiness@gmail.com';
    
    console.log('🔐 Reset de Contraseña para Administrador\n');
    console.log(`📧 Email: ${email}\n`);

    // Buscar el usuario
    console.log('🔍 Buscando usuario...');
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
            rl.close();
            return;
        }

        if (!users || users.length === 0) break;
        allUsers = allUsers.concat(users);
        if (users.length < pageSize) break;
        page++;
    }

    const user = allUsers.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
        console.log('❌ Usuario NO encontrado en auth.users');
        console.log('\n💡 SOLUCIÓN MANUAL:');
        console.log('   1. Ve a Supabase Dashboard → Authentication → Users');
        console.log('   2. Busca o crea el usuario con email:', email);
        console.log('   3. Click en "..." → "Reset Password"');
        rl.close();
        return;
    }

    console.log('✅ Usuario encontrado!');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email confirmado: ${user.email_confirmed_at ? 'Sí' : 'No'}\n`);

    // Pedir nueva contraseña
    console.log('⚠️  IMPORTANTE: La contraseña debe tener al menos 6 caracteres');
    const newPassword = await question('🔑 Ingresa la nueva contraseña: ');
    
    if (!newPassword || newPassword.length < 6) {
        console.log('❌ La contraseña debe tener al menos 6 caracteres');
        rl.close();
        return;
    }

    const confirmPassword = await question('🔑 Confirma la contraseña: ');

    if (newPassword !== confirmPassword) {
        console.log('❌ Las contraseñas no coinciden');
        rl.close();
        return;
    }

    // Actualizar contraseña
    console.log('\n🔄 Actualizando contraseña...');
    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { password: newPassword }
    );

    if (updateError) {
        console.error('❌ Error actualizando contraseña:', updateError.message);
        console.log('\n💡 Intenta resetear la contraseña manualmente desde Supabase Dashboard');
        rl.close();
        return;
    }

    console.log('✅ ¡Contraseña actualizada exitosamente!\n');
    console.log('📝 Ahora puedes iniciar sesión con:');
    console.log(`   Email: ${email}`);
    console.log(`   Contraseña: ${newPassword}\n`);
    console.log('🔗 URL de login: http://localhost:4321/admin/login\n');

    rl.close();
}

resetPassword().catch(error => {
    console.error('❌ Error:', error);
    rl.close();
});


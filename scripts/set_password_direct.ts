import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

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

async function setPassword() {
    const email = 'mirkodgzbusiness@gmail.com';
    const newPassword = 'N4DIEsabe2**';
    
    console.log('🔐 Estableciendo contraseña para Administrador\n');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Nueva contraseña: ${newPassword}\n`);

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
        return;
    }

    console.log('✅ Usuario encontrado!');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email confirmado: ${user.email_confirmed_at ? 'Sí' : 'No'}\n`);

    // Actualizar contraseña
    console.log('🔄 Actualizando contraseña...');
    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { password: newPassword }
    );

    if (updateError) {
        console.error('❌ Error actualizando contraseña:', updateError.message);
        console.log('\n💡 Intenta resetear la contraseña manualmente desde Supabase Dashboard');
        return;
    }

    console.log('✅ ¡Contraseña actualizada exitosamente!\n');
    console.log('📝 Ahora puedes iniciar sesión con:');
    console.log(`   Email: ${email}`);
    console.log(`   Contraseña: ${newPassword}\n`);
    console.log('🔗 URL de login: http://localhost:4321/admin/login\n');
    console.log('🎯 URL de tabla de usuarios: http://localhost:4321/admin/users\n');
}

setPassword().catch(error => {
    console.error('❌ Error:', error);
});


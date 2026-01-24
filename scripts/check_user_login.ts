import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
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

async function checkUser() {
    const email = 'mirkodgzbusiness@gmail.com';
    
    console.log('🔍 Verificando usuario:', email);
    console.log('📡 Supabase URL:', SUPABASE_URL);
    console.log('');

    // 1. Buscar usuario en auth.users
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
        console.error('❌ Error listando usuarios:', listError);
        return;
    }

    const user = users.find(u => u.email === email);
    
    if (!user) {
        console.log('❌ Usuario NO encontrado en auth.users');
        console.log('💡 Necesitas crear el usuario primero en Supabase Dashboard → Authentication → Users');
        return;
    }

    console.log('✅ Usuario encontrado en auth.users:');
    console.log('   ID:', user.id);
    console.log('   Email:', user.email);
    console.log('   Email confirmado:', user.email_confirmed_at ? 'Sí' : 'No');
    console.log('   Creado:', user.created_at);
    console.log('');

    // 2. Verificar perfil
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profileError || !profile) {
        console.log('⚠️ Perfil NO encontrado en profiles table');
        console.log('💡 El trigger debería crear el perfil automáticamente');
    } else {
        console.log('✅ Perfil encontrado:');
        console.log('   Rol:', profile.role || 'No definido');
        console.log('   Nombre:', profile.full_name || 'No definido');
        console.log('');
        
        if (profile.role !== 'Administrator' && profile.role !== 'CountryManager') {
            console.log('⚠️ ADVERTENCIA: El usuario NO tiene rol de admin');
            console.log('   Rol actual:', profile.role);
            console.log('   Necesitas cambiar el rol a "Administrator" o "CountryManager"');
        } else {
            console.log('✅ El usuario tiene rol de admin:', profile.role);
        }
    }

    // 3. Verificar si puede resetear password
    console.log('');
    console.log('💡 Si olvidaste la contraseña, puedes:');
    console.log('   1. Ir a Supabase Dashboard → Authentication → Users');
    console.log('   2. Buscar tu usuario');
    console.log('   3. Click en "..." → "Reset Password"');
    console.log('   4. O cambiar la contraseña directamente desde el dashboard');
}

checkUser();


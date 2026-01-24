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

async function createAuthUser(email: string) {
    console.log(`🔧 Creando usuario de autenticación para: ${email}\n`);

    // 1. Buscar en profiles
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .ilike('email', `%${email}%`)
        .single();

    if (profileError || !profile) {
        console.error(`❌ Usuario ${email} no encontrado en profiles`);
        console.log('💡 Primero crea el usuario en profiles');
        process.exit(1);
    }

    console.log(`✅ Usuario encontrado en profiles:`);
    console.log(`   ID: ${profile.id}`);
    console.log(`   Email: ${profile.email}`);
    console.log(`   Nombre: ${profile.full_name || 'N/A'}\n`);

    // 2. Verificar si ya existe en auth.users
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const existingUser = users?.find(u => u.id === profile.id || u.email?.toLowerCase() === email.toLowerCase());

    if (existingUser) {
        console.log(`✅ Usuario ya existe en auth.users:`);
        console.log(`   ID: ${existingUser.id}`);
        console.log(`   Email: ${existingUser.email}`);
        console.log(`\n💡 No es necesario crear el usuario, ya existe.`);
        return existingUser;
    }

    // 3. Crear usuario en auth.users usando el mismo ID del profile
    console.log('🔧 Creando usuario en auth.users...');
    
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        id: profile.id, // Usar el mismo ID del profile
        email: profile.email,
        email_confirm: true, // Confirmar email automáticamente
        user_metadata: {
            full_name: profile.full_name || '',
        }
    });

    if (createError) {
        console.error('❌ Error creando usuario:', createError);
        process.exit(1);
    }

    console.log(`✅ Usuario creado exitosamente en auth.users:`);
    console.log(`   ID: ${newUser.user.id}`);
    console.log(`   Email: ${newUser.user.email}`);
    console.log(`\n💡 Ahora puedes enviar el email de reset de password.`);

    return newUser.user;
}

// Obtener email del argumento
const email = process.argv[2] || 'g.zvenia@gmail.com';
createAuthUser(email).catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});


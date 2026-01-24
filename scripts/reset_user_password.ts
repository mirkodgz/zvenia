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

async function resetPassword() {
    const email = 'evo@zvenia.com';
    const tempPassword = 'TempPass123!@#'; // Contraseña temporal
    
    console.log('🔧 Reseteando contraseña para:', email);
    console.log('');

    // 1. Buscar usuario
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
        console.error('❌ Error listando usuarios:', listError);
        return;
    }

    const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
        console.log('❌ Usuario NO encontrado en auth.users');
        console.log('💡 Necesitas crear el usuario primero o verificar el email');
        return;
    }

    console.log('✅ Usuario encontrado');
    console.log('   ID:', user.id);
    console.log('   Email:', user.email);
    console.log('');

    // 2. Resetear contraseña
    console.log('🔄 Reseteando contraseña...');
    const { error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { password: tempPassword }
    );

    if (updateError) {
        console.error('❌ Error reseteando contraseña:', updateError);
        return;
    }

    console.log('✅ Contraseña actualizada exitosamente');
    console.log('');

    // 3. Verificar perfil y datos
    console.log('📋 Verificando perfil y datos migrados...');
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profileError) {
        console.error('❌ Error obteniendo perfil:', profileError);
    } else {
        console.log('✅ Perfil encontrado');
        console.log('');
        console.log('📊 DATOS DEL PERFIL:');
        console.log('   Full Name:', profile.full_name || '❌ Vacío');
        console.log('   Phone:', profile.phone_number || '❌ Vacío');
        console.log('   Nationality:', profile.nationality || '❌ Vacío');
        console.log('   Profession:', profile.profession || '❌ Vacío');
        console.log('   Work Country:', profile.work_country || '❌ Vacío');
        console.log('   Company:', profile.company || '❌ Vacío');
        console.log('   Position:', profile.position || '❌ Vacío');
        console.log('   Main Language:', profile.main_language || '❌ Vacío');
        console.log('   Main Area:', profile.main_area_of_expertise || '❌ Vacío');
        console.log('   Profile Slug:', profile.profile_slug || '❌ Vacío');
        console.log('');
        
        // Verificar metadata
        const metadata = (profile.metadata as any) || {};
        console.log('📦 METADATA (Campos personalizados):');
        if (Object.keys(metadata).length === 0) {
            console.log('   ❌ Metadata vacío');
        } else {
            console.log('   ✅ Metadata tiene datos:');
            Object.keys(metadata).forEach(key => {
                const value = metadata[key];
                if (Array.isArray(value)) {
                    console.log(`   - ${key}: [${value.length} items]`, value);
                } else {
                    console.log(`   - ${key}:`, value);
                }
            });
        }
        console.log('');
        
        // Verificar si tiene datos o está vacío
        const hasData = 
            profile.full_name || 
            profile.phone_number || 
            profile.nationality || 
            profile.profession ||
            profile.work_country ||
            profile.company ||
            Object.keys(metadata).length > 0;
        
        if (hasData) {
            console.log('✅ El usuario TIENE datos migrados');
        } else {
            console.log('⚠️ El usuario NO tiene datos migrados (campos vacíos)');
            console.log('💡 Esto significa que la migración de WordPress aún no se ha ejecutado');
        }
    }

    console.log('');
    console.log('🎉 ¡LISTO!');
    console.log('');
    console.log('📧 Email:', email);
    console.log('🔑 Password temporal:', tempPassword);
    console.log('');
    console.log('✅ Ahora puedes hacer login en: http://localhost:4321/login');
    console.log('✅ Luego ve a: http://localhost:4321/dashboard/user-area');
    console.log('');
    console.log('⚠️ IMPORTANTE: Cambia esta contraseña después de verificar los datos');
}

resetPassword();


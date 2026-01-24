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

async function checkUserData() {
    const email = 'evo@zvenia.com';
    
    console.log('🔍 Verificando datos completos de:', email);
    console.log('');

    // Obtener usuario
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
        console.log('❌ Usuario no encontrado');
        return;
    }

    // Obtener perfil completo
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error || !profile) {
        console.error('❌ Error:', error);
        return;
    }

    console.log('📊 DATOS COMPLETOS DEL PERFIL:');
    console.log('================================');
    console.log('');
    
    // Campos directos
    console.log('📋 CAMPOS DIRECTOS:');
    console.log('   id:', profile.id);
    console.log('   email:', profile.email);
    console.log('   role:', profile.role || '❌ Vacío');
    console.log('   first_name:', profile.first_name || '❌ Vacío');
    console.log('   last_name:', profile.last_name || '❌ Vacío');
    console.log('   full_name:', profile.full_name || '❌ Vacío');
    console.log('   avatar_url:', profile.avatar_url || '❌ Vacío');
    console.log('   company:', profile.company || '❌ Vacío');
    console.log('   position:', profile.position || '❌ Vacío');
    console.log('   linkedin_url:', profile.linkedin_url || '❌ Vacío');
    console.log('   phone_number:', profile.phone_number || '❌ Vacío');
    console.log('   nationality:', profile.nationality || '❌ Vacío');
    console.log('   profession:', profile.profession || '❌ Vacío');
    console.log('   work_country:', profile.work_country || '❌ Vacío');
    console.log('   current_location:', profile.current_location || '❌ Vacío');
    console.log('   headline_user:', profile.headline_user || '❌ Vacío');
    console.log('   main_language:', profile.main_language || '❌ Vacío');
    console.log('   main_area_of_expertise:', profile.main_area_of_expertise || '❌ Vacío');
    console.log('   username:', profile.username || '❌ Vacío');
    console.log('   profile_slug:', profile.profile_slug || '❌ Vacío');
    console.log('');

    // Metadata
    const metadata = (profile.metadata as any) || {};
    console.log('📦 METADATA (JSON):');
    if (Object.keys(metadata).length === 0) {
        console.log('   ❌ Metadata completamente vacío');
    } else {
        console.log('   ✅ Metadata tiene', Object.keys(metadata).length, 'campos:');
        console.log('');
        console.log(JSON.stringify(metadata, null, 2));
    }
    console.log('');

    // Resumen
    const filledFields = [
        profile.full_name, profile.phone_number, profile.nationality,
        profile.profession, profile.work_country, profile.company,
        profile.position, profile.main_language, profile.main_area_of_expertise
    ].filter(f => f).length;

    console.log('📈 RESUMEN:');
    console.log('   Campos llenos:', filledFields, '/ 9 campos principales');
    console.log('   Metadata campos:', Object.keys(metadata).length);
    console.log('');

    if (filledFields === 0 && Object.keys(metadata).length === 0) {
        console.log('⚠️ ADVERTENCIA: El usuario NO tiene datos migrados');
        console.log('💡 Necesitas ejecutar la migración de WordPress → Supabase');
    } else {
        console.log('✅ El usuario tiene algunos datos');
    }
}

checkUserData();


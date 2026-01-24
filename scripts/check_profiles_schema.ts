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

async function checkSchema() {
    console.log('🔍 Verificando schema real de la tabla profiles...');
    console.log('');

    // Intentar obtener un perfil con select * para ver qué columnas existen
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
        .single();

    if (error) {
        console.error('❌ Error obteniendo perfil:', error.message);
        console.error('   Code:', error.code);
        console.error('   Details:', error.details);
        console.log('');
        console.log('💡 Esto puede significar que:');
        console.log('   1. La tabla profiles no existe');
        console.log('   2. Hay un problema con las columnas');
        console.log('   3. Necesitas verificar el schema en Supabase Dashboard');
        return;
    }

    if (!profile) {
        console.log('⚠️ No hay perfiles en la tabla');
        return;
    }

    console.log('✅ Schema verificado - Columnas encontradas:');
    console.log('');
    console.log('📋 CAMPOS DISPONIBLES:');
    Object.keys(profile).forEach(key => {
        const value = profile[key as keyof typeof profile];
        const type = value === null ? 'null' : typeof value;
        const preview = value && typeof value === 'string' && value.length > 50 
            ? value.substring(0, 50) + '...' 
            : value;
        console.log(`   ✅ ${key}: ${type} = ${preview}`);
    });
    console.log('');

    // Verificar campos nuevos
    const newFields = [
        'phone_number', 'nationality', 'profession', 'work_country',
        'current_location', 'headline_user', 'main_language',
        'main_area_of_expertise', 'username', 'profile_slug'
    ];

    console.log('🔍 VERIFICANDO CAMPOS NUEVOS:');
    newFields.forEach(field => {
        const exists = field in profile;
        const hasValue = profile[field as keyof typeof profile] !== null && 
                        profile[field as keyof typeof profile] !== undefined &&
                        profile[field as keyof typeof profile] !== '';
        console.log(`   ${exists ? '✅' : '❌'} ${field}: ${exists ? (hasValue ? 'Existe y tiene valor' : 'Existe pero vacío') : 'NO EXISTE'}`);
    });
}

checkSchema();


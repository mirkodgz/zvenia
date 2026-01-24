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

async function verifyMigration() {
    console.log('🔍 Verificando estado de la migración...');
    console.log('');

    // Verificar usuarios con datos
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, phone_number, nationality, profession, work_country, company, main_language, main_area_of_expertise, metadata')
        .limit(100);

    if (error) {
        console.error('❌ Error:', error);
        return;
    }

    if (!profiles || profiles.length === 0) {
        console.log('❌ No se encontraron perfiles');
        return;
    }

    console.log(`📊 Analizando ${profiles.length} usuarios...`);
    console.log('');

    // Contar usuarios con datos
    let usersWithData = 0;
    let usersWithMetadata = 0;
    let usersWithNewFields = 0;

    profiles.forEach(profile => {
        const hasBasicData = profile.full_name || profile.company || profile.profession;
        const hasNewFields = profile.phone_number || profile.nationality || profile.work_country || 
                            profile.main_language || profile.main_area_of_expertise;
        const metadata = (profile.metadata as any) || {};
        const hasMetadata = Object.keys(metadata).length > 0;

        if (hasBasicData) usersWithData++;
        if (hasNewFields) usersWithNewFields++;
        if (hasMetadata) usersWithMetadata++;
    });

    console.log('📈 ESTADÍSTICAS:');
    console.log('   Total usuarios analizados:', profiles.length);
    console.log('   Usuarios con datos básicos:', usersWithData, `(${Math.round(usersWithData/profiles.length*100)}%)`);
    console.log('   Usuarios con nuevos campos:', usersWithNewFields, `(${Math.round(usersWithNewFields/profiles.length*100)}%)`);
    console.log('   Usuarios con metadata:', usersWithMetadata, `(${Math.round(usersWithMetadata/profiles.length*100)}%)`);
    console.log('');

    // Mostrar ejemplos
    console.log('📋 EJEMPLOS DE USUARIOS:');
    console.log('');
    
    const examples = profiles.slice(0, 5);
    examples.forEach((profile, idx) => {
        console.log(`${idx + 1}. ${profile.email}`);
        console.log(`   Name: ${profile.full_name || '❌ Vacío'}`);
        console.log(`   Company: ${profile.company || '❌ Vacío'}`);
        console.log(`   Phone: ${profile.phone_number || '❌ Vacío'}`);
        console.log(`   Nationality: ${profile.nationality || '❌ Vacío'}`);
        console.log(`   Main Language: ${profile.main_language || '❌ Vacío'}`);
        console.log(`   Metadata: ${Object.keys((profile.metadata as any) || {}).length} campos`);
        console.log('');
    });

    // Conclusión
    console.log('💡 CONCLUSIÓN:');
    if (usersWithNewFields === 0) {
        console.log('   ⚠️ Ningún usuario tiene los nuevos campos llenos');
        console.log('   💡 Esto significa que la migración de WordPress aún no se ha ejecutado');
        console.log('   💡 Los campos están creados, pero necesitas migrar los datos');
    } else {
        console.log('   ✅ Algunos usuarios tienen datos en los nuevos campos');
        console.log('   💡 La migración parcial está funcionando');
    }
}

verifyMigration();


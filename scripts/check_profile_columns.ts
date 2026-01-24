/**
 * Script para verificar qué columnas tiene la tabla profiles
 * Ejecutar: npx tsx scripts/check_profile_columns.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Faltan variables de entorno de Supabase');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
    console.log('\n🔍 Verificando columnas de la tabla profiles...\n');

    // Intentar obtener un perfil para ver qué columnas devuelve
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

    if (error) {
        console.error('❌ Error:', error.message);
        return;
    }

    if (profiles && profiles.length > 0) {
        console.log('✅ Columnas encontradas en el primer perfil:');
        console.log(Object.keys(profiles[0]).join(', '));
        console.log('\n📋 Detalles:');
        console.log(JSON.stringify(profiles[0], null, 2));
    } else {
        console.log('⚠️ No hay perfiles en la tabla');
    }
}

checkColumns().catch(console.error);


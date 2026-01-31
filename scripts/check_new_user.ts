
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const TARGET_EMAIL = 'mirkodgzguillen@gmail.com';

async function checkFinalStatus() {
    console.log(`🔍 Verificando estado final para: ${TARGET_EMAIL}`);

    // 1. Buscar en Profiles
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', TARGET_EMAIL)
        .single();

    if (profileError) {
        console.log("❌ Perfil NO encontrado aún:", profileError.message);
    } else {
        console.log("✅ ¡PERFIL CREADO CORRECTAMENTE!");
        console.log(`   ID: ${profile.id}`);
        console.log(`   Nombre: ${profile.full_name}`);
        console.log(`   Username: ${profile.username}`);
    }
}

checkFinalStatus();

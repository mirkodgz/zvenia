
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const TARGET_ID = '8553eb33-db86-4632-8dfa-f87de3dc63a9';

async function checkUser() {
    console.log(`🔍 Buscando usuario con ID: ${TARGET_ID}`);

    // 1. Check Auth User
    const { data: authData, error: authError } = await supabase.auth.admin.getUserById(TARGET_ID);

    if (authError) {
        console.log("❌ NO encontrado en Auth (Login):", authError.message);
    } else {
        console.log("✅ ¡ENCONTRADO en Auth!");
        console.log(`   Email: ${authData.user.email}`);
        console.log(`   Confirmado: ${authData.user.email_confirmed_at ? 'SÍ' : 'NO'}`);
        console.log(`   Status: ${authData.user.role}`);
    }

    // 2. Check Profile
    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', TARGET_ID)
        .single();

    if (profileError) {
        console.log("❌ NO encontrado en Profiles:", profileError.message);
    } else {
        console.log("✅ ENCONTRADO en Profiles (Esto sería inesperado dado el error).");
    }
}

checkUser();

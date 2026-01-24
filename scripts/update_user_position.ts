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

async function updateUserPosition() {
    const email = 'ltukula2@gmail.com';
    const position = 'Head of Technical';

    console.log(`🔍 Buscando usuario: ${email}`);
    
    // 1. Buscar usuario en profiles
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, position')
        .eq('email', email)
        .single();

    if (profileError || !profile) {
        console.error(`❌ Usuario no encontrado: ${email}`);
        console.error('Error:', profileError);
        return;
    }

    console.log(`✅ Usuario encontrado:`);
    console.log(`   ID: ${profile.id}`);
    console.log(`   Email: ${profile.email}`);
    console.log(`   Position actual: ${profile.position || '(vacío)'}`);
    console.log('');

    // 2. Actualizar position
    console.log(`🔄 Actualizando position a: "${position}"...`);
    const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({ position: position })
        .eq('id', profile.id)
        .select()
        .single();

    if (updateError) {
        console.error(`❌ Error actualizando position:`, updateError);
        return;
    }

    console.log(`✅ Position actualizado exitosamente!`);
    console.log(`   Nuevo position: ${updatedProfile?.position}`);
    console.log('');
    console.log('🎉 ¡Actualización completada!');
}

updateUserPosition().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});


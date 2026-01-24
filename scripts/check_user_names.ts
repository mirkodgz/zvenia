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

async function checkUserNames() {
    const email = 'mirkodgzbusiness@gmail.com';
    
    console.log(`🔍 Verificando usuario: ${email}\n`);
    
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, full_name')
        .eq('email', email)
        .single();

    if (error || !profile) {
        console.error(`❌ Usuario no encontrado: ${email}`);
        console.error('Error:', error);
        return;
    }

    console.log(`✅ Usuario encontrado:`);
    console.log(`   ID: ${profile.id}`);
    console.log(`   Email: ${profile.email}`);
    console.log(`   First Name: ${profile.first_name || '(vacío)'}`);
    console.log(`   Last Name: ${profile.last_name || '(vacío)'}`);
    console.log(`   Full Name: ${profile.full_name || '(vacío)'}`);
    console.log('');

    if (!profile.first_name || !profile.last_name) {
        console.log('⚠️  Usuario sin first_name o last_name');
        
        if (profile.full_name) {
            const parts = profile.full_name.trim().split(/\s+/);
            const firstName = parts[0] || '';
            const lastName = parts.slice(1).join(' ') || '';
            
            console.log(`\n💡 Propuesta de actualización:`);
            console.log(`   First Name: "${firstName}"`);
            console.log(`   Last Name: "${lastName}"`);
            
            if (firstName) {
                console.log(`\n🔄 Actualizando...`);
                const { data: updated, error: updateError } = await supabase
                    .from('profiles')
                    .update({
                        first_name: firstName,
                        last_name: lastName || null
                    })
                    .eq('id', profile.id)
                    .select()
                    .single();

                if (updateError) {
                    console.error(`❌ Error actualizando:`, updateError);
                } else {
                    console.log(`✅ Actualizado exitosamente!`);
                    console.log(`   First Name: ${updated?.first_name}`);
                    console.log(`   Last Name: ${updated?.last_name}`);
                }
            }
        } else {
            console.log('⚠️  No hay full_name para generar first_name y last_name');
        }
    } else {
        console.log('✅ Usuario ya tiene first_name y last_name');
    }
}

checkUserNames().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});


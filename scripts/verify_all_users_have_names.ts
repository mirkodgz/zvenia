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

async function verifyAllUsersHaveNames() {
    console.log('🔍 Verificando usuarios sin first_name o last_name...\n');

    let page = 0;
    const pageSize = 1000;
    let totalUsers = 0;
    let usersWithoutNames: Array<{ email: string; full_name: string | null; first_name: string | null; last_name: string | null }> = [];

    while (true) {
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('email, first_name, last_name, full_name')
            .range(page * pageSize, (page + 1) * pageSize - 1);

        if (error) {
            console.error('❌ Error obteniendo perfiles:', error);
            break;
        }

        if (!profiles || profiles.length === 0) {
            break;
        }

        totalUsers += profiles.length;

        for (const profile of profiles) {
            if (!profile.first_name || profile.first_name.trim() === '' || 
                !profile.last_name || profile.last_name.trim() === '') {
                usersWithoutNames.push({
                    email: profile.email || 'unknown',
                    full_name: profile.full_name,
                    first_name: profile.first_name,
                    last_name: profile.last_name
                });
            }
        }

        if (profiles.length < pageSize) {
            break;
        }

        page++;
    }

    console.log(`📊 Total usuarios verificados: ${totalUsers}`);
    console.log(`⚠️  Usuarios sin first_name o last_name: ${usersWithoutNames.length}\n`);

    if (usersWithoutNames.length > 0) {
        console.log('📝 Usuarios que necesitan actualización:');
        usersWithoutNames.slice(0, 20).forEach((user, index) => {
            console.log(`   ${index + 1}. ${user.email}`);
            console.log(`      Full Name: ${user.full_name || '(vacío)'}`);
            console.log(`      First Name: ${user.first_name || '(vacío)'}`);
            console.log(`      Last Name: ${user.last_name || '(vacío)'}`);
            console.log('');
        });

        if (usersWithoutNames.length > 20) {
            console.log(`   ... y ${usersWithoutNames.length - 20} más\n`);
        }

        console.log('💡 Ejecuta: npx tsx scripts/update_all_first_last_names.ts para actualizarlos');
    } else {
        console.log('✅ ¡Todos los usuarios tienen first_name y last_name!');
    }
}

verifyAllUsersHaveNames().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});


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

async function findUser(email: string) {
    console.log(`🔍 Buscando usuario: ${email}\n`);

    // Buscar en auth.users
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
        console.error('❌ Error listando usuarios:', error);
        return;
    }

    // Buscar exacto
    const exactMatch = users?.find(u => u.email?.toLowerCase() === email.toLowerCase());
    
    if (exactMatch) {
        console.log('✅ Usuario encontrado:');
        console.log(`   Email: ${exactMatch.email}`);
        console.log(`   ID: ${exactMatch.id}`);
        console.log(`   Creado: ${exactMatch.created_at}`);
        return exactMatch;
    }

    // Buscar parcial (por si hay variaciones)
    const partialMatches = users?.filter(u => 
        u.email?.toLowerCase().includes(email.toLowerCase().split('@')[0])
    );

    if (partialMatches && partialMatches.length > 0) {
        console.log(`⚠️ No se encontró exactamente "${email}"`);
        console.log(`\n🔍 Usuarios similares encontrados:`);
        partialMatches.slice(0, 10).forEach(u => {
            console.log(`   - ${u.email}`);
        });
    } else {
        console.log(`❌ Usuario "${email}" no encontrado`);
        console.log(`\n💡 Opciones:`);
        console.log(`   1. Verifica que el email sea correcto`);
        console.log(`   2. Crea el usuario primero en Supabase`);
        console.log(`   3. O usa otro email que sí exista`);
    }

    return null;
}

// Obtener email del argumento o usar el default
const email = process.argv[2] || 'Roberto123@gmail.com';
findUser(email).catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
});


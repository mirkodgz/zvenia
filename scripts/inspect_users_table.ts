
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectSchema() {
    console.log("🔍 Intentando detectar tabla 'public.users'...");

    // Si intentamos insertar algo inválido, Postgres nos dirá si la tabla existe o no
    const { error } = await supabase.from('users').select('id').limit(1);

    if (error) {
        console.log(`❌ Error al consultar 'users': ${error.code} - ${error.message}`);
    } else {
        console.log("✅ La tabla 'public.users' EXISTE en el esquema público.");
    }

    console.log("\n🔍 Verificando 'profiles' FK...");
    // Intentar leer info de la tabla si fuera posible vía rpc o similar (no estándar)
    // Pero el error del usuario ya confirmó que la FK apunta a 'users'
}

inspectSchema();

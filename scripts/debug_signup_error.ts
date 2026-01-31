
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Faltan credenciales en .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugSchema() {
    console.log("🔍 Verificando existencia de tabla 'users' en public...");

    // Intento 1: Seleccionar de 'users' (public)
    const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(1);

    if (usersError) {
        console.log("❌ Error consultando 'users':", usersError.message);
        if (usersError.code === '42P01') {
            console.log("👉 Conclusión: La tabla 'public.users' NO existe.");
        }
    } else {
        console.log("✅ Éxito consultando 'users'. La tabla EXISTE.");
        console.log("   Esto explica el error 23503. Debemos insertar aquí también.");
    }

    console.log("\n🔍 Verificando existencia de tabla 'profiles'...");
    // Intento 2: Seleccionar de 'profiles'
    const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

    if (profilesError) {
        console.log("❌ Error consultando 'profiles':", profilesError.message);
    } else {
        console.log("✅ Tabla 'profiles' accesible.");
    }
}

debugSchema();

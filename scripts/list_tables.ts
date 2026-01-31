
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
    console.log("🔍 Listando tablas en esquema 'public':");

    // Usamos RPC o consultamos una tabla conocida para probar conectividad primero
    // Peor caso: intentamos leer de 'users'.
    // Mejor caso: no podemos consultar information_schema con API client.
    // Hack: probaremos insertar en 'users' un dummy a ver si el error cambia.
    // O simplemente asumimos que si el error dice table "users", la tabla existe.

    // Pero si supabase-js falla al leer 'users', es q no existe en la API.
    // Tal vez no está expuesta en la API?

    // Vamos a intentar leer de 'profiles'.
    const { count, error } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    console.log("Profiles check:", error ? error.message : `Accessible, count: ${count}`);

    // Check 'users' again explicitly
    const { error: usersError } = await supabase.from('users').select('*').limit(1);
    console.log("Users API check:", usersError ? usersError.message : "Accessible (exists in API)");
}

listTables();

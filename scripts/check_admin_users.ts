import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Faltan variables de entorno:');
    console.error('   - PUBLIC_SUPABASE_URL');
    console.error('   - SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAdminUsers() {
    console.log('🔍 Buscando usuarios con rol Administrator...\n');

    // Buscar todos los Administrators
    const { data: admins, error: adminError } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, created_at')
        .eq('role', 'Administrator')
        .order('created_at', { ascending: false });

    if (adminError) {
        console.error('❌ Error buscando Administrators:', adminError);
        return;
    }

    if (!admins || admins.length === 0) {
        console.log('⚠️  No se encontraron usuarios con rol Administrator');
        console.log('\n📝 Para crear un admin, ejecuta:');
        console.log('   UPDATE profiles SET role = \'Administrator\' WHERE email = \'tu-email@ejemplo.com\';');
    } else {
        console.log(`✅ Se encontraron ${admins.length} usuario(s) con rol Administrator:\n`);
        admins.forEach((admin, index) => {
            console.log(`${index + 1}. ${admin.email}`);
            console.log(`   Nombre: ${admin.full_name || 'N/A'}`);
            console.log(`   ID: ${admin.id}`);
            console.log(`   Creado: ${new Date(admin.created_at).toLocaleDateString()}`);
            console.log('');
        });
    }

    // Verificar el email específico del usuario
    const userEmail = 'mirkodgzbusines@gmail.com';
    console.log(`\n🔍 Verificando email específico: ${userEmail}...\n`);

    const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, created_at')
        .eq('email', userEmail)
        .single();

    if (userError) {
        if (userError.code === 'PGRST116') {
            console.log(`❌ El email ${userEmail} NO existe en la base de datos`);
        } else {
            console.error('❌ Error buscando usuario:', userError);
        }
    } else {
        console.log(`✅ Usuario encontrado:`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Nombre: ${user.full_name || 'N/A'}`);
        console.log(`   Rol actual: ${user.role || 'N/A'}`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Creado: ${new Date(user.created_at).toLocaleDateString()}`);
        
        if (user.role === 'Administrator') {
            console.log(`\n✅ ¡SÍ eres Administrator! Puedes acceder a /admin/users`);
        } else {
            console.log(`\n⚠️  NO eres Administrator. Tu rol actual es: ${user.role || 'Basic'}`);
            console.log(`\n📝 Para convertirte en Administrator, ejecuta en Supabase SQL Editor:`);
            console.log(`   UPDATE profiles SET role = 'Administrator' WHERE email = '${userEmail}';`);
        }
    }

    // Mostrar también CountryManagers
    console.log('\n\n🔍 Buscando usuarios con rol CountryManager...\n');

    const { data: countryManagers, error: cmError } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, created_at')
        .eq('role', 'CountryManager')
        .order('created_at', { ascending: false })
        .limit(10);

    if (cmError) {
        console.error('❌ Error buscando CountryManagers:', cmError);
    } else if (countryManagers && countryManagers.length > 0) {
        console.log(`✅ Se encontraron ${countryManagers.length} usuario(s) con rol CountryManager:\n`);
        countryManagers.forEach((cm, index) => {
            console.log(`${index + 1}. ${cm.email} - ${cm.full_name || 'N/A'}`);
        });
    } else {
        console.log('⚠️  No se encontraron usuarios con rol CountryManager');
    }
}

checkAdminUsers().catch(console.error);


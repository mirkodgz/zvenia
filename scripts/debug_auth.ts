import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugAuth() {
    const email = 'mirkodgzbusiness@gmail.com';
    
    console.log('🔍 Diagnóstico de Autenticación\n');
    console.log(`📧 Email: ${email}\n`);

    // 1. Buscar usuario en auth.users
    console.log('1️⃣ Buscando usuario en auth.users...');
    let allUsers: any[] = [];
    let page = 0;
    const pageSize = 1000;

    while (true) {
        const { data: { users }, error } = await supabase.auth.admin.listUsers({
            page: page,
            perPage: pageSize
        });

        if (error) {
            console.error('❌ Error:', error);
            return;
        }

        if (!users || users.length === 0) break;
        allUsers = allUsers.concat(users);
        if (users.length < pageSize) break;
        page++;
    }

    const user = allUsers.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
        console.log('❌ Usuario NO encontrado en auth.users');
        return;
    }

    console.log('✅ Usuario encontrado en auth.users:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Email confirmado: ${user.email_confirmed_at ? 'Sí' : 'No'}`);
    console.log(`   Último login: ${user.last_sign_in_at || 'Nunca'}\n`);

    // 2. Buscar perfil en profiles
    console.log('2️⃣ Buscando perfil en profiles...');
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profileError) {
        console.error('❌ Error buscando perfil:', profileError);
        return;
    }

    if (!profile) {
        console.log('❌ Perfil NO encontrado en profiles');
        console.log('\n💡 Creando perfil...');
        const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
                id: user.id,
                email: user.email!,
                role: 'Administrator',
                full_name: 'mirkodgz'
            });

        if (createError) {
            console.error('❌ Error creando perfil:', createError);
        } else {
            console.log('✅ Perfil creado exitosamente');
        }
        return;
    }

    console.log('✅ Perfil encontrado:');
    console.log(`   ID: ${profile.id}`);
    console.log(`   Email: ${profile.email}`);
    console.log(`   Rol: ${profile.role || 'NULL'}`);
    console.log(`   Nombre: ${profile.full_name || 'N/A'}\n`);

    // 3. Verificar rol
    console.log('3️⃣ Verificando rol...');
    const role = profile.role || 'Basic';
    console.log(`   Rol actual: "${role}"`);
    
    if (role !== 'Administrator') {
        console.log('⚠️  El rol NO es "Administrator"');
        console.log('\n💡 Actualizando rol a Administrator...');
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'Administrator' })
            .eq('id', user.id);

        if (updateError) {
            console.error('❌ Error actualizando rol:', updateError);
        } else {
            console.log('✅ Rol actualizado a "Administrator"');
        }
    } else {
        console.log('✅ El rol es "Administrator" - Correcto!\n');
    }

    // 4. Verificar funciones de roles
    console.log('4️⃣ Verificando funciones de roles...');
    const adminRoles = ['CountryManager', 'Administrator'];
    const hasAccess = adminRoles.includes(role);
    console.log(`   ¿Tiene acceso admin?: ${hasAccess ? '✅ Sí' : '❌ No'}`);
    console.log(`   ¿Es Administrator?: ${role === 'Administrator' ? '✅ Sí' : '❌ No'}\n`);

    console.log('📝 Resumen:');
    console.log(`   - Usuario en auth.users: ✅`);
    console.log(`   - Perfil en profiles: ✅`);
    console.log(`   - Rol: ${profile.role || 'NULL'}`);
    console.log(`   - ¿Puede acceder a /admin?: ${hasAccess ? '✅ Sí' : '❌ No'}`);
    console.log(`   - ¿Puede acceder a /admin/users?: ${role === 'Administrator' ? '✅ Sí' : '❌ No'}\n`);

    if (!hasAccess || role !== 'Administrator') {
        console.log('💡 SOLUCIÓN:');
        console.log('   Ejecuta este SQL en Supabase SQL Editor:');
        console.log(`   UPDATE profiles SET role = 'Administrator' WHERE email = '${email}';`);
    }
}

debugAuth().catch(console.error);


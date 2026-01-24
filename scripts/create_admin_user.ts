import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
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

async function createAdminUser() {
    const email = 'mirkodgzbusiness@gmail.com';
    const password = 'Passw0rd99@@'; // Cambia esto por tu password deseado
    
    console.log('🔧 Creando usuario admin...');
    console.log('📧 Email:', email);
    console.log('');

    // 1. Buscar usuario existente por email
    console.log('🔍 Buscando usuario existente...');
    let existingUser = null;
    
    try {
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        
        if (listError) {
            console.log('⚠️ No se pudo listar usuarios, intentando buscar directamente...');
        } else {
            existingUser = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
        }
    } catch (e) {
        console.log('⚠️ Error al listar, continuando...');
    }

    // 2. Si existe, actualizar contraseña y perfil
    if (existingUser) {
        console.log('✅ Usuario encontrado en auth.users');
        console.log('   ID:', existingUser.id);
        console.log('');
        
        // Actualizar contraseña
        console.log('🔄 Actualizando contraseña...');
        const { error: resetError } = await supabase.auth.admin.updateUserById(
            existingUser.id,
            { password: password }
        );

        if (resetError) {
            console.error('❌ Error actualizando contraseña:', resetError);
        } else {
            console.log('✅ Contraseña actualizada');
        }

        // Verificar/actualizar perfil
        console.log('📋 Verificando perfil...');
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', existingUser.id)
            .single();

        if (profile) {
            console.log('✅ Perfil encontrado');
            console.log('   Rol actual:', profile.role || 'No definido');
            
            if (profile.role !== 'Administrator' && profile.role !== 'CountryManager') {
                console.log('🔄 Actualizando rol a Administrator...');
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ role: 'Administrator' })
                    .eq('id', existingUser.id);
                
                if (updateError) {
                    console.error('❌ Error actualizando rol:', updateError);
                } else {
                    console.log('✅ Rol actualizado a Administrator');
                }
            }
        } else {
            console.log('⚠️ No hay perfil. Creando...');
            const { error: createProfileError } = await supabase
                .from('profiles')
                .insert({
                    id: existingUser.id,
                    email: email,
                    role: 'Administrator',
                    full_name: 'Admin User'
                });
            
            if (createProfileError) {
                console.error('❌ Error creando perfil:', createProfileError);
            } else {
                console.log('✅ Perfil creado con rol Administrator');
            }
        }

        console.log('');
        console.log('🎉 ¡Todo listo! Ahora puedes hacer login con:');
        console.log('   Email:', email);
        console.log('   Password:', password);
        return;
    }

    // 3. Si no existe, intentar obtenerlo por email (puede estar en otra instancia)
    console.log('⚠️ Usuario no encontrado en la lista, pero el email ya está registrado');
    console.log('💡 Esto puede significar que:');
    console.log('   1. El usuario existe pero está en otra organización');
    console.log('   2. Necesitas resetear la contraseña desde Supabase Dashboard');
    console.log('');
    console.log('📝 Pasos para solucionarlo:');
    console.log('   1. Ve a Supabase Dashboard → Authentication → Users');
    console.log('   2. Busca tu email:', email);
    console.log('   3. Click en "..." → "Reset Password"');
    console.log('   4. O cambia la contraseña directamente');
    console.log('   5. Verifica que el rol en profiles sea "Administrator"');
    return;

    // 4. Crear nuevo usuario (código no alcanzable si el email ya existe)
    console.log('📝 Creando nuevo usuario en auth.users...');
    const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Confirmar email automáticamente
        user_metadata: {
            full_name: 'Admin User'
        }
    });

    if (createError) {
        console.error('❌ Error creando usuario:', createError);
        return;
    }

    console.log('✅ Usuario creado en auth.users');
    console.log('   ID:', user.id);
    console.log('');

    // 3. Verificar/crear perfil
    console.log('📋 Verificando perfil...');
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profileError || !profile) {
        console.log('⚠️ Perfil no encontrado. Creando...');
        const { error: insertError } = await supabase
            .from('profiles')
            .insert({
                id: user.id,
                email: email,
                role: 'Administrator',
                full_name: 'Admin User'
            });

        if (insertError) {
            console.error('❌ Error creando perfil:', insertError);
        } else {
            console.log('✅ Perfil creado con rol Administrator');
        }
    } else {
        console.log('✅ Perfil encontrado');
        console.log('   Rol actual:', profile.role || 'No definido');
        
        if (profile.role !== 'Administrator') {
            console.log('🔄 Actualizando rol a Administrator...');
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ role: 'Administrator' })
                .eq('id', user.id);
            
            if (updateError) {
                console.error('❌ Error actualizando rol:', updateError);
            } else {
                console.log('✅ Rol actualizado a Administrator');
            }
        }
    }

    console.log('');
    console.log('🎉 ¡Usuario admin creado exitosamente!');
    console.log('');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('');
    console.log('✅ Ahora puedes hacer login en: http://localhost:4321/admin/login');
}

createAdminUser();


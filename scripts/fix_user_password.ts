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

async function fixUser() {
    const email = 'mirkodgzbusiness@gmail.com';
    const newPassword = 'Passw0rd99@@';
    
    console.log('🔧 Intentando arreglar usuario...');
    console.log('📧 Email:', email);
    console.log('');

    // Intentar obtener usuario por email usando getUserByEmail
    try {
        // Listar TODOS los usuarios con paginación
        let allUsers: any[] = [];
        let page = 0;
        const pageSize = 1000;

        while (true) {
            const { data: { users }, error } = await supabase.auth.admin.listUsers({
                page: page,
                perPage: pageSize
            });

            if (error) {
                console.error('❌ Error listando usuarios:', error);
                break;
            }

            if (!users || users.length === 0) break;

            allUsers = allUsers.concat(users);
            
            if (users.length < pageSize) break;
            page++;
        }

        console.log(`📊 Total usuarios encontrados: ${allUsers.length}`);
        
        const user = allUsers.find(u => u.email?.toLowerCase() === email.toLowerCase());

        if (!user) {
            console.log('❌ Usuario NO encontrado en auth.users');
            console.log('');
            console.log('💡 SOLUCIÓN MANUAL:');
            console.log('   1. Ve a Supabase Dashboard → Authentication → Users');
            console.log('   2. Busca o crea el usuario con email:', email);
            console.log('   3. Si existe, click en "..." → "Reset Password"');
            console.log('   4. Si no existe, crea uno nuevo');
            console.log('   5. Luego ejecuta este script de nuevo');
            return;
        }

        console.log('✅ Usuario encontrado!');
        console.log('   ID:', user.id);
        console.log('   Email:', user.email);
        console.log('   Email confirmado:', user.email_confirmed_at ? 'Sí' : 'No');
        console.log('');

        // Actualizar contraseña
        console.log('🔄 Actualizando contraseña...');
        const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
            user.id,
            { password: newPassword }
        );

        if (updateError) {
            console.error('❌ Error actualizando contraseña:', updateError);
            console.log('');
            console.log('💡 Intenta resetear la contraseña manualmente desde Supabase Dashboard');
            return;
        }

        console.log('✅ Contraseña actualizada exitosamente');
        console.log('');

        // Verificar/actualizar perfil
        console.log('📋 Verificando perfil...');
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profile) {
            console.log('✅ Perfil encontrado');
            console.log('   Rol actual:', profile.role || 'No definido');
            
            if (profile.role !== 'Administrator' && profile.role !== 'CountryManager') {
                console.log('🔄 Actualizando rol a Administrator...');
                const { error: roleError } = await supabase
                    .from('profiles')
                    .update({ role: 'Administrator' })
                    .eq('id', user.id);
                
                if (roleError) {
                    console.error('❌ Error actualizando rol:', roleError);
                } else {
                    console.log('✅ Rol actualizado a Administrator');
                }
            } else {
                console.log('✅ El usuario ya tiene rol de admin:', profile.role);
            }
        } else {
            console.log('⚠️ No hay perfil. Creando...');
            const { error: createError } = await supabase
                .from('profiles')
                .insert({
                    id: user.id,
                    email: email,
                    role: 'Administrator',
                    full_name: 'Admin User'
                });
            
            if (createError) {
                console.error('❌ Error creando perfil:', createError);
            } else {
                console.log('✅ Perfil creado con rol Administrator');
            }
        }

        console.log('');
        console.log('🎉 ¡TODO LISTO!');
        console.log('');
        console.log('📧 Email:', email);
        console.log('🔑 Password:', newPassword);
        console.log('');
        console.log('✅ Ahora puedes hacer login en: http://localhost:4321/admin/login');

    } catch (error: any) {
        console.error('❌ Error:', error.message);
        console.log('');
        console.log('💡 SOLUCIÓN MANUAL:');
        console.log('   1. Ve a Supabase Dashboard → Authentication → Users');
        console.log('   2. Busca el usuario:', email);
        console.log('   3. Click en "..." → "Reset Password"');
        console.log('   4. Establece la contraseña:', newPassword);
        console.log('   5. Verifica que en profiles el rol sea "Administrator"');
    }
}

fixUser();


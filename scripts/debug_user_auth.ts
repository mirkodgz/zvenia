/**
 * Script de diagnóstico para verificar el estado de autenticación del usuario
 * Ejecutar: npx tsx scripts/debug_user_auth.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Faltan variables de entorno de Supabase');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugUser(email: string) {
    console.log(`\n🔍 Verificando usuario: ${email}\n`);

    // Buscar usuario por email
    const { data: users, error: searchError } = await supabase.auth.admin.listUsers();
    
    if (searchError) {
        console.error('❌ Error buscando usuarios:', searchError);
        return;
    }

    const user = users.users.find(u => u.email === email);
    
    if (!user) {
        console.error(`❌ Usuario ${email} no encontrado en auth.users`);
        return;
    }

    console.log('✅ Usuario encontrado en auth.users:');
    console.log('   - ID:', user.id);
    console.log('   - Email:', user.email);
    console.log('   - Email confirmado:', user.email_confirmed_at ? 'Sí' : 'No');
    console.log('   - Último sign in:', user.last_sign_in_at || 'Nunca');

    // Verificar perfil
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profileError) {
        console.error('❌ Error obteniendo perfil:', profileError);
        return;
    }

    if (!profile) {
        console.error('❌ Perfil no encontrado en profiles table');
        return;
    }

    console.log('\n✅ Perfil encontrado:');
    console.log('   - Role:', profile.role || 'No definido');
    console.log('   - Full Name:', profile.full_name || 'No definido');
    console.log('   - First Name:', profile.first_name || 'No definido');
    console.log('   - Last Name:', profile.last_name || 'No definido');
    console.log('   - Avatar URL:', profile.avatar_url || 'No definido');

    console.log('\n✅ Usuario y perfil están correctamente configurados');
}

// Ejecutar
const email = process.argv[2] || 'mirkodgzbusiness@gmail.com';
debugUser(email).catch(console.error);


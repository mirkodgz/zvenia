import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function findSimilarEmail() {
    const searchEmail = 'mirkodgz';
    
    console.log(`🔍 Buscando emails que contengan "${searchEmail}"...\n`);

    const { data: users, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, created_at')
        .ilike('email', `%${searchEmail}%`)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('❌ Error:', error);
        return;
    }

    if (!users || users.length === 0) {
        console.log('❌ No se encontraron usuarios con ese patrón');
    } else {
        console.log(`✅ Se encontraron ${users.length} usuario(s):\n`);
        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.email}`);
            console.log(`   Nombre: ${user.full_name || 'N/A'}`);
            console.log(`   Rol: ${user.role || 'Basic'}`);
            console.log(`   Creado: ${new Date(user.created_at).toLocaleDateString()}`);
            console.log('');
        });
    }
}

findSimilarEmail().catch(console.error);


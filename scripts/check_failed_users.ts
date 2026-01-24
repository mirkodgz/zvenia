import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';

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

async function checkFailedUsers() {
    console.log('🔍 Verificando usuarios INSERT fallidos...');
    console.log('');

    const failedEmails = [
        '2112845388@qq.com',
        'aaboelazayem@aga.gold',
        'bosworthnak1804@gmail.com',
        'elhadjousmanesam@gmail.com',
        'elizabethmthimunye5@gmail.com',
        'esperencesarl@gmail.com',
        'estrellapomastilver@gmail.com',
        'falekehakim@gmail.com',
        'iganu76@gmail.com',
        'jotamonteci@gmail.com',
        'kananijosue869@gmail.com',
        'kepasnenga30@gmail.com',
        'lilianchinyandura610@gmail.com',
        'mengdan@daoyuntech.com',
        'mmh9932@gmail.com',
        'niutao185571863@gmail.com',
        'peter.sampson@jescomcapital.com',
        'ronnieuta@gmail.com',
        'team@dgzconsulting.com',
        'www.michaelchami20@gmail.com'
    ];

    console.log(`📊 Verificando ${failedEmails.length} usuarios...`);
    console.log('');

    // Verificar en auth.users
    const { data: { users } } = await supabase.auth.admin.listUsers();
    
    let inAuth = 0;
    let inProfiles = 0;
    let notFound = 0;

    for (const email of failedEmails) {
        const authUser = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
        const { data: profile } = await supabase
            .from('profiles')
            .select('id, email')
            .eq('email', email)
            .single();

        if (authUser && profile) {
            console.log(`✅ ${email} - Existe en auth.users Y profiles`);
            inAuth++;
            inProfiles++;
        } else if (authUser) {
            console.log(`⚠️ ${email} - Existe en auth.users pero NO en profiles`);
            inAuth++;
        } else if (profile) {
            console.log(`⚠️ ${email} - Existe en profiles pero NO en auth.users`);
            inProfiles++;
        } else {
            console.log(`❌ ${email} - NO existe en ningún lado`);
            notFound++;
        }
    }

    console.log('');
    console.log('📊 RESUMEN:');
    console.log(`✅ En auth.users: ${inAuth}`);
    console.log(`✅ En profiles: ${inProfiles}`);
    console.log(`❌ No encontrados: ${notFound}`);
}

checkFailedUsers().catch(console.error);



import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '');

async function verify() {
    const targets = [
        'Final Wall Control',
        'Modelos para previsão',
        'Vertical Distance Rate',
        'Dimensionamento de blocos'
    ];
    console.log("--- VERIFICATION STATUS ---");
    for (const t of targets) {
        const { data } = await supabase.from('posts').select('title, document_url').ilike('title', `%${t}%`);
        if (data && data.length) {
            const url = data[0].document_url;
            const status = (url && url.includes('res.cloudinary.com')) ? '✅ FIXED' : '❌ BROKEN';
            console.log(`${status} | ${t.substring(0, 25)}... | ${url ? url.split('/').pop() : 'NULL'}`);
        } else {
            console.log(`❌ MISSING | ${t}`);
        }
    }
}
verify();

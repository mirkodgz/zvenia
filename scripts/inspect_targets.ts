
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function inspectTargets() {
    const titles = [
        'Final Wall Control',
        'Modelos para previsão',
        'Vertical Distance Rate',
        'Dimensionamento de blocos'
    ];

    for (const t of titles) {
        const { data } = await supabase.from('posts').select('title, slug, document_url').ilike('title', `%${t}%`);
        if (data && data.length) {
            console.log(`\nFound: ${data[0].title}`);
            console.log(`URL: ${data[0].document_url}`);
        } else {
            console.log(`\n❌ Not Found: ${t}`);
        }
    }
}

inspectTargets().catch(console.error);

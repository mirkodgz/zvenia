
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkDate() {
    const { data } = await supabase
        .from('profiles')
        .select('created_at')
        .ilike('full_name', '%Rodolfo Bravo%')
        .single();

    if (data) console.log("DATE_RODOLFO:", data.created_at);
}

checkDate();

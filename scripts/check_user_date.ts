
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkDate() {
    const { data, error } = await supabase
        .from('profiles')
        .select('full_name, created_at')
        .ilike('full_name', '%Ziad Hassan%')
        .single();

    if (error) console.error(error);
    else console.log(JSON.stringify(data, null, 2));
}

checkDate();

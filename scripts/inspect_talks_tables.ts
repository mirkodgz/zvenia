
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function inspect() {
    console.log("--- Inspecting 'talks' table ---");
    const { data: talk, error: err1 } = await supabase.from('talks').select('*').limit(1);
    if (err1) console.error("Error talks:", err1.message);
    else if (talk && talk.length > 0) console.log("Columns:", Object.keys(talk[0]));
    else console.log("Table 'talks' is empty or accessible.");

    console.log("\n--- Inspecting 'talks_topics' table ---");
    const { data: tt, error: err2 } = await supabase.from('talks_topics').select('*').limit(1);
    if (err2) console.error("Error talks_topics:", err2.message);
    else if (tt && tt.length > 0) console.log("Columns:", Object.keys(tt[0]));
    else console.log("Table 'talks_topics' is empty or accessible.");
}

inspect();

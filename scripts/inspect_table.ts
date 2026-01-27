
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('CRITICAL: Missing Supabase keys');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
    console.log("🔍 Inspecting 'profiles' table schema...");

    // We can't query information_schema easily via postgrest unless permitted, 
    // but we can try to selecting an empty row to see format, OR force an error that reveals schema?
    // Actually, `rpc` is best if we have a function, but we don't.
    // Let's try to just select one row and print keys, and also try to insert bad data to get column list in error?
    // Better: use a raw SQL query if we had a function for it.

    // Since we don't have direct SQL access, we will infer from a SELECT * LIMIT 1
    const { data: rows, error } = await supabase.from('profiles').select('*').limit(1);

    if (error) {
        console.error("Error selecting profiles:", error);
    } else if (rows && rows.length > 0) {
        const keys = Object.keys(rows[0]);
        console.log("Existing row keys:", keys);
        const fs = await import('fs/promises');
        await fs.writeFile('debug_schema.txt', JSON.stringify(keys, null, 2));
        await fs.appendFile('debug_schema.txt', '\n\nSample Data:\n' + JSON.stringify(rows[0], null, 2));
    } else {
        console.log("Table is empty or no read access (unlikely with service key).");
        // Try inserting a dummy with NO fields to see what it complains about.
    }
}

main();

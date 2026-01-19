
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load env explicitly from root
const envPath = path.resolve(process.cwd(), '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.PUBLIC_SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing credentials in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const tablesToCheck = [
    'profiles',
    'topics',
    'posts',
    'events',
    'podcasts',
    'services',
    'talks',
    'presentations',
    'talks_topics',       // Junction
    'presentations_topics', // Junction
    'event_types',        // Lookup
    'event_formats',
    'event_languages',
    'service_types'
];

console.log("🔍 Starting Table Visibility Check...\n");

for (const table of tablesToCheck) {
    // Try to fetch 1 row
    const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true }); // HEAD request for speed

    if (error) {
        console.log(`❌ [${table.padEnd(20)}] ERROR: ${error.message} (${error.code})`);
    } else {
        // If RLS blocks read, count might be null or 0 depending on policy, usually 0 if allowed but empty, or error if denied? 
        // Actually RLS usually just returns 0 rows if you're not allowed to see any.
        // We need to verify if we CAN see them. 
        // But HEAD might return count=null if count not requested properly with RLS?

        // Let's try explicit Select 1
        const { data: rows, error: selErr } = await supabase.from(table).select('id').limit(1);

        if (selErr) {
            console.log(`❌ [${table.padEnd(20)}] SELECT ERROR: ${selErr.message}`);
        } else {
            const rowCount = count !== null ? count : 'N/A';
            const visible = rows && rows.length > 0;
            const status = visible ? "✅ Visible" : (rowCount > 0 ? "⚠️ Hidden by RLS?" : "ℹ️ Empty Table");
            console.log(`✅ [${table.padEnd(20)}] OK. Count: ${rowCount}. First Query returned: ${rows.length} rows.`);
        }
    }
}

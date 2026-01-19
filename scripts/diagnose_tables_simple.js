
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(envConfig.PUBLIC_SUPABASE_URL, envConfig.PUBLIC_SUPABASE_ANON_KEY);

const tables = [
    'profiles', 'topics', 'posts', 'events',
    'talks', 'presentations',
    'talks_topics', 'presentations_topics'
];

console.log("CHECKING TABLES:");
for (const t of tables) {
    const { error } = await supabase.from(t).select('id').limit(1);
    const status = error ? `ERROR: ${error.message}` : "OK";
    console.log(`${t}: ${status}`);
}

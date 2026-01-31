
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
// Use Service Role Key if available to bypass RLS, otherwise fallback to Anon
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) { console.error('Missing Creds'); process.exit(1); }

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCountries() {
    console.log("Checking profiles table (EXACT COUNT SCALABLE)...");

    // 1. Total
    const { count: total, error: err1 } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

    if (err1) { console.error("Total Error:", err1); return; }

    // 2. With Country
    const { count: withC, error: err2 } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .not('country', 'is', null)
        .neq('country', '');

    if (err2) { console.error("Country Error:", err2); return; }

    const validTotal = total || 0;
    const validWith = withC || 0;

    console.log(`Total Real Users: ${validTotal}`);
    console.log(`With Country: ${validWith}`);
    console.log(`Without Country: ${validTotal - validWith}`);
    console.log(`Percentage with Country: ${((validWith / validTotal) * 100).toFixed(2)}%`);
}

checkCountries();

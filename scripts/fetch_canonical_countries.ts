
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) { console.error('Missing Creds'); process.exit(1); }

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchCanonicalCountries() {
    console.log("Fetching canonical country list from DB...");

    const { data: countries, error } = await supabase
        .from('countries')
        .select('name, display_name, code')
        .order('name');

    if (error) {
        console.error("Error fetching countries:", error);
        return;
    }

    console.log(`Fetched ${countries.length} canonical countries.`);

    // Save to a temporary JSON for the matching script to use
    const outPath = path.join(process.cwd(), 'scripts', 'canonical_countries.json');
    fs.writeFileSync(outPath, JSON.stringify(countries, null, 2));
    console.log(`Saved canonical list to ${outPath}`);
}

fetchCanonicalCountries();

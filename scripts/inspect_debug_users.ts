
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectProfiles() {
    console.log("--- Inspecting Profiles ---");

    // Check 'team@dgzconsulting.com'
    const { data: teamUser, error: teamError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', 'team@dgzconsulting.com');

    if (teamError) console.error("Error fetching team:", teamError);
    else console.log("User 'team@dgzconsulting.com':", teamUser?.map(u => ({ email: u.email, country: u.country, role: u.role })));

    // Check 'test teston'
    const { data: testonUser, error: testonError } = await supabase
        .from('profiles')
        .select('*')
        .ilike('full_name', '%test teston%');

    if (testonError) console.error("Error fetching teston:", testonError);
    else console.log("User 'test teston':", testonUser?.map(u => ({ email: u.email, country: u.country, role: u.role })));
}

inspectProfiles();

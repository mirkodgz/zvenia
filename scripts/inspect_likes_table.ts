
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Executing as admin to see everything
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
    console.log("Inspecting 'social_likes'...");
    
    // 1. Check if table exists by trying to select from it
    const { data, error } = await supabase.from('social_likes').select('*').limit(1);
    
    if (error) {
        console.error("Error accessing table:", error);
    } else {
        console.log("Table accessible. Sample row:", data);
    }

    // 2. Try to insert a test like as a fake user to see usually hidden errors? 
    // Actually as Service Role it will bypass RLS. 
    // We need to check the policies. 
    // Since we can't easily query pg_policies via client, we'll try to replicate the failure 
    // by using a non-service key if possible, or just deduce from recent migration files.

    // Let's list migration files that might have touched this table.
}

inspect();

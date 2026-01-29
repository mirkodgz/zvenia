
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
  const tables = ['events', 'podcasts', 'services'];
  
  for (const table of tables) {
    console.log(`Checking table: ${table}`);
    const { data, error } = await supabase.from(table).select('is_popular').limit(1);
    
    if (error) {
      console.log(`Error checking ${table}:`, error.message);
      if (error.message.includes('column "is_popular" does not exist') || error.code === 'PGRST204') { // PGRST204 might be ambiguous but looking for column error
         console.log(`-> Column 'is_popular' likely MISSING in ${table}`);
      }
    } else {
      console.log(`-> Column 'is_popular' EXISTS in ${table}`);
    }
  }
}

checkColumns();

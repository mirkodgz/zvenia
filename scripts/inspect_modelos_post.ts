
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
    console.log("Inspecting 'Modelos para previsão...'");
    const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .ilike('title', '%Modelos para previsão%');

    if (posts && posts.length > 0) {
        posts.forEach(p => {
            console.log(`ID: ${p.id}`);
            console.log(`Title: ${p.title}`);
            console.log(`Document URL: ${p.document_url}`);
            console.log(`-----------------------------------`);
        });
    } else {
        console.log("Post not found.");
    }
}

inspect();

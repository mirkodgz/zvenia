
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
    const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .ilike('title', '%Modelos para previsão%');

    if (!posts || posts.length === 0) {
        console.log("Post not found.");
        return;
    }

    const post = posts[0];
    const url = post.document_url;
    console.log(`Checking URL: ${url}`);

    if (!url || !url.startsWith('http')) {
        console.log("Invalid or empty URL.");
        return;
    }

    try {
        const resp = await axios.head(url);
        console.log(`Status: ${resp.status}`);
        console.log(`Content-Type: ${resp.headers['content-type']}`);
        console.log(`Content-Length: ${resp.headers['content-length']}`);
    } catch (e: any) {
        console.log(`Error: ${e.message}`);
        if (e.response) console.log(`HTTP Status: ${e.response.status}`);
    }
}

verify();

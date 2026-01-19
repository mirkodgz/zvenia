
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    console.log('\n--- START CHECK ---');

    // Check for Cloudinary
    const { data: cloudData } = await supabase
        .from('posts')
        .select('featured_image_url')
        .ilike('featured_image_url', '%cloudinary%')
        .limit(1);

    if (cloudData && cloudData.length > 0) {
        console.log('CLOUDINARY_URL:', cloudData[0].featured_image_url);
    } else {
        console.log('NO CLOUDINARY URLs FOUND in sample.');
    }

    // Check for Zvenia
    const { data: zveniaData } = await supabase
        .from('posts')
        .select('featured_image_url')
        .ilike('featured_image_url', '%zvenia.com%')
        .limit(1);

    if (zveniaData && zveniaData.length > 0) {
        console.log('ZVENIA_URL:', zveniaData[0].featured_image_url);
    }

    console.log('--- END CHECK ---');
}

check();

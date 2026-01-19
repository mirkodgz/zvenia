
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    console.log('\n--- DIAGNOSIS ---');

    // Count Zvenia Legacy URLs
    const { count: zveniaCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .ilike('featured_image_url', '%zvenia.com%');

    // Count Cloudinary URLs
    const { count: cloudCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .ilike('featured_image_url', '%cloudinary%');

    console.log(`ZVENIA_COUNT: ${zveniaCount}`);
    console.log(`CLOUD_COUNT: ${cloudCount}`);

    // Get ONE full Zvenia URL to test
    const { data } = await supabase
        .from('posts')
        .select('featured_image_url')
        .ilike('featured_image_url', '%zvenia.com%')
        .limit(1);

    if (data && data.length > 0) {
        console.log('TEST_TARGET:', data[0].featured_image_url);
    }
}

check();

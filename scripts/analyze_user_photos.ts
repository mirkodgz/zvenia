import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import * as path from 'path';

import fs from 'fs';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function analyzePhotos() {
    console.log("📊 Starting Profile Photo Analysis...");

    // 1. Total Users
    const { count: total, error: totalError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

    if (totalError) {
        console.error('❌ Error fetching total count:', totalError);
        return;
    }

    // 2. Users WITH Photo
    // We check for not null. Sometimes empty strings might exist too.
    const { count: withPhoto, error: withError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .not('avatar_url', 'is', null);
    // If you suspect empty strings: .neq('avatar_url', '')

    if (withError) {
        console.error('❌ Error fetching photo count:', withError);
        return;
    }

    // 3. Sync calculation
    const withoutPhoto = (total || 0) - (withPhoto || 0);

    const output = `
📈 Analysis Results:
------------------------
👥 Total Users:       ${total}
🖼️  With Photo:       ${withPhoto} (${((withPhoto! / total!) * 100).toFixed(1)}%)
👤 Without Photo:    ${withoutPhoto} (${((withoutPhoto! / total!) * 100).toFixed(1)}%)
------------------------`;

    console.log(output);
    fs.writeFileSync('scripts/photo_stats.txt', output);
}

analyzePhotos();


const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const readline = require('readline');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const MIGRATION_CSV = 'd:/zvenia/migration_data/final_migrated_avatars.csv';

async function main() {
    console.log('Starting Final Database Update for Profile Pictures...');

    if (!fs.existsSync(MIGRATION_CSV)) {
        console.error('Migration CSV not found. Run remigrate_profile_pics.cjs first.');
        return;
    }

    const fileStream = fs.createReadStream(MIGRATION_CSV);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    let count = 0;
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for await (const line of rl) {
        if (line.startsWith('email,')) continue; // Header

        // Simple CSV parse
        const parts = line.split(',');
        if (parts.length < 3) continue;

        const email = parts[0];
        const cloudUrl = parts[2]; // Index 2 is cloudinary_url

        if (!email || !cloudUrl) {
            skippedCount++;
            continue;
        }

        // Update DB
        const { error } = await supabase
            .from('profiles')
            .update({ avatar_url: cloudUrl })
            .eq('email', email);

        if (error) {
            console.error(`Failed to update ${email}: ${error.message}`);
            errorCount++;
        } else {
            successCount++;
        }

        count++;
        if (count % 50 === 0) process.stdout.write('.');
    }

    console.log('\n------------------------------------------------');
    console.log('Database Update Complete.');
    console.log(`Total Processed in CSV: ${count}`);
    console.log(`Successfully Updated: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
}

main().catch(console.error);

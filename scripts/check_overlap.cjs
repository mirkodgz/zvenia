
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const readline = require('readline');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.PUBLIC_SUPABASE_ANON_KEY
);

const INPUT_CSV = 'd:/zvenia/migration_data/migrated_cloudinary_urls.csv';

async function main() {
    console.log('Checking overlap between CSV and DB Profiles...');

    const fileStream = fs.createReadStream(INPUT_CSV);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    const csvEmails = new Set();
    let isHeader = true;
    for await (const line of rl) {
        if (isHeader) { isHeader = false; continue; }
        const parts = line.split(',');
        if (parts.length > 0) csvEmails.add(parts[0].trim());
    }
    console.log(`CSV Emails loaded: ${csvEmails.size}`);

    // Fetch all profile emails (or as many as possible)
    // 660 is small enough to fetch all if DB isn't huge.
    // Let's fetch in chunks or just limit 1000.
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('email')
        .limit(2000);

    if (error) {
        console.error('Error fetching profiles:', error);
        return;
    }

    console.log(`DB Profiles fetched: ${profiles.length}`);

    let matchCount = 0;
    const matches = [];

    for (const p of profiles) {
        if (csvEmails.has(p.email)) {
            matchCount++;
            if (matches.length < 5) matches.push(p.email);
        }
    }

    console.log('------------------------------------------------');
    console.log(`Overlap Matches Found: ${matchCount}`);
    console.log('Sample Matches:', matches);
    console.log('------------------------------------------------');
}

main().catch(console.error);

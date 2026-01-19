
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const readline = require('readline');

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // Use Service Role Key to bypass RLS
);

// Files
const INPUT_CSV = 'd:/zvenia/migration_data/migrated_cloudinary_urls.csv';

// CSV Parser
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current);
    return values;
}

async function main() {
    console.log('Starting DB Profile Picture Update...');

    if (!fs.existsSync(INPUT_CSV)) {
        console.error('Input CSV not found.');
        return;
    }

    const fileStream = fs.createReadStream(INPUT_CSV);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    let headers = null;
    let count = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for await (const line of rl) {
        if (!headers) {
            headers = parseCSVLine(line);
            continue;
        }

        const cols = parseCSVLine(line);
        if (cols.length < 4) continue;

        const email = cols[0];
        // Col 1 is media_id
        // Col 2 is original_url
        let newUrl = cols[3].replace(/"/g, '');

        if (!newUrl || newUrl.trim() === '') {
            skipped++;
            continue;
        }

        // We only proceed if we have a valid email and new URL
        // Try to update profiles table
        const { data, error } = await supabase
            .from('profiles')
            .update({ avatar_url: newUrl })
            .eq('email', email)
            .select();

        if (error) {
            console.error(`Error updating ${email}: ${error.message}`);
            errors++;
        } else if (data && data.length > 0) {
            console.log(`Updated ${email}`);
            updated++;
        } else {
            // User not found in profiles (maybe only in auth or deleted)
            console.log(`Skipped (Not Found): ${email}`);
            skipped++;
        }
        count++;
    }

    console.log('------------------------------------------------');
    console.log(`Update Job Completed.`);
    console.log(`Total Processed from CSV: ${count}`);
    console.log(`Successfully Updated:     ${updated}`);
    console.log(`Skipped (Not Found/Empty): ${skipped}`);
    console.log(`Errors:                   ${errors}`);
}

main().catch(console.error);

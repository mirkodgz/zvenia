
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import * as path from 'path';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CSV_FILE = 'public/user-export-wordpress-1-697236a535238.csv';

async function restoreDates() {
    console.log("🚀 Starting User Date Restoration...");

    const filePath = path.resolve(process.cwd(), CSV_FILE);
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${CSV_FILE}`);
        return;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Parse CSV
    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true
    });

    console.log(`Found ${records.length} records in CSV.`);

    let updatedCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const record of records) {
        const email = record.user_email;
        const registeredDate = record.user_registered;

        if (!email || !registeredDate) {
            console.log(`⚠️ Skipping row with missing data: ${JSON.stringify(record)}`);
            skippedCount++;
            continue;
        }

        // Format date verify (optional, usually Postgres handles ISO strings well)
        // clean " characters if present
        const cleanDate = registeredDate.replace(/"/g, '').trim();

        // Update Supabase
        const { error } = await supabase
            .from('profiles')
            .update({ created_at: cleanDate })
            .eq('email', email);

        if (error) {
            console.error(`❌ Error updating ${email}: ${error.message}`);
            errorCount++;
        } else {
            // console.log(`✅ Updated ${email} to ${cleanDate}`); // Verbose
            updatedCount++;
            if (updatedCount % 50 === 0) process.stdout.write('.');
        }
    }

    console.log("\n\n🎉 Restoration Complete!");
    console.log(`✅ Updated: ${updatedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`⏩ Skipped: ${skippedCount}`);
}

restoreDates();

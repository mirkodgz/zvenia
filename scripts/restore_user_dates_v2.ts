
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

async function restoreDatesV2() {
    console.log("🚀 Starting User Date Restoration V2 (Case Insensitive)...");

    const filePath = path.resolve(process.cwd(), CSV_FILE);
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    interface WPExportRecord {
        user_email: string;
        user_registered: string;
        [key: string]: string;
    }

    // Parse CSV
    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true // Trim whitespace from values automatically
    }) as WPExportRecord[];

    console.log(`Found ${records.length} records in CSV.`);

    let updatedCount = 0;
    let errorCount = 0;
    let alreadyCorrectCount = 0;

    for (const record of records) {
        let email = record.user_email;
        const registeredDate = record.user_registered;

        if (!email || !registeredDate) continue;

        // Normalize email
        email = email.trim().toLowerCase();
        const cleanDate = registeredDate.replace(/"/g, '').trim();

        // Check if date is actually valuable (not empty, not default)
        if (cleanDate.startsWith('0000')) continue;

        // Update Supabase with case-insensitive email match
        // Note: Supabase 'eq' is case-sensitive? Usually Postgres text is.
        // But emails in profiles might be mixed case.
        // We really want: UPDATE profiles SET created_at = ... WHERE LOWER(email) = LOWER(csv_email)
        // RPC or just simple ilike might verify existence first.

        // Let's use ILIKE on email effectively by just matching exact email but checking if row exists
        // Actually, just doing .eq('email', email) might fail if DB has uppercase.
        // Use .ilike('email', email) is safer for finding the user.

        // First find the ID to be safe
        const { data: user } = await supabase.from('profiles').select('id, created_at').ilike('email', email).maybeSingle();

        if (!user) {
            // Uncomment to debug missing users
            // console.log(`Skipping: User not found in DB for email ${email}`);
            continue;
        }

        // Optimization: Don't update if already close (e.g. same day)
        // But for mass fix, just overwrite is fine.

        const { error } = await supabase
            .from('profiles')
            .update({ created_at: cleanDate })
            .eq('id', user.id);

        if (error) {
            console.error(`❌ Error ${email}: ${error.message}`);
            errorCount++;
        } else {
            updatedCount++;
            if (updatedCount % 50 === 0) process.stdout.write('.');
        }
    }

    console.log("\n\n🎉 V2 Restoration Complete!");
    console.log(`✅ Updated: ${updatedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
}

restoreDatesV2();

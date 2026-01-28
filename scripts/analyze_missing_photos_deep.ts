
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import * as path from 'path';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

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

const CSV_FILE = 'public/export-user27012026.csv';

async function deepAnalyze() {
    console.log("🕵️ Starting Deep Analysis for Missing Photos...");

    // 1. Get List of "Missing" Users from DB
    const { data: missingUsers, error } = await supabase
        .from('profiles')
        .select('email, full_name')
        .is('avatar_url', null);

    if (error || !missingUsers) {
        console.error("❌ DB Error:", error);
        return;
    }

    console.log(`📉 Database reports ${missingUsers.length} users without photos.`);

    // Create a Set for O(1) lookup
    const missingEmails = new Set(missingUsers.map(u => u.email?.toLowerCase().trim()));

    // 2. Load CSV
    const csvPath = path.resolve(process.cwd(), CSV_FILE);
    if (!fs.existsSync(csvPath)) {
        console.error("❌ CSV not found");
        return;
    }
    const records = parse(fs.readFileSync(csvPath, 'utf-8'), {
        columns: true,
        skip_empty_lines: true
    });

    // 3. Cross-Reference
    const findings = {
        numericId: 0,      // Should have been fixed, but maybe missed?
        httpUrl: 0,        // Direct links
        filename: 0,       // Just 'photo.jpg'
        emptyInCsv: 0,     // Truly empty
        totalAnalyzed: 0
    };

    const potentialRecoveries: any[] = [];

    for (const record of records as any[]) {
        const email = (record.user_email || record.email || '').toLowerCase().trim();

        if (missingEmails.has(email)) {
            findings.totalAnalyzed++;

            // Check photo columns
            const pic = (record['profile-picture'] || record['foto-de-perfil'] || '').trim();

            if (!pic) {
                findings.emptyInCsv++;
                continue;
            }

            if (!pic) {
                findings.emptyInCsv++;
                continue;
            }

            // 1. Try Numeric
            if (/^\d+$/.test(pic)) {
                findings.numericId++;
            }
            // 2. Try JSON (JetFormBuilder)
            else if (pic.trim().startsWith('{')) {
                try {
                    // Sometimes it's double encoded or weird format
                    // Easy regex first to be safe against bad JSON
                    const urlMatch = pic.match(/"url":"(https?:[^"]+)"/);
                    if (urlMatch) {
                        const extracted = urlMatch[1].replace(/\\/g, ''); // Unescape slashes
                        findings.httpUrl++;
                        potentialRecoveries.push({ type: 'JSON_URL', email, val: extracted });
                    } else {
                        findings.filename++; // Falied to parse URL from JSON
                    }
                } catch (e) {
                    findings.filename++;
                }
            }
            // 3. Direct URL
            else if (pic.startsWith('http')) {
                findings.httpUrl++;
                potentialRecoveries.push({ type: 'URL', email, val: pic });
            } else {
                findings.filename++;
                potentialRecoveries.push({ type: 'FILE', email, val: pic });
            }
        }
    }

    console.log("\n🔍 Findings for the missing users:");
    console.log(`-----------------------------------`);
    console.log(`Total Checked in CSV: ${findings.totalAnalyzed}`);
    console.log(`❌ Empty in CSV too:  ${findings.emptyInCsv}`);
    console.log(`🔢 Numeric IDs:       ${findings.numericId} (Review why skipped?)`);
    console.log(`🌐 HTTP URLs:         ${findings.httpUrl} (Recoverable!)`);
    console.log(`📄 Filenames:         ${findings.filename} (Might match XML)`);
    console.log(`-----------------------------------`);

    if (potentialRecoveries.length > 0) {
        console.log("\nSample Recoveries:");
        potentialRecoveries.slice(0, 10).forEach(r => console.log(`[${r.type}] ${r.email}: ${r.val}`));

        fs.writeFileSync('scripts/deep_recovery_candidates.json', JSON.stringify(potentialRecoveries, null, 2));
        console.log(`\n💾 Saved ${potentialRecoveries.length} candidates to scripts/deep_recovery_candidates.json`);
    }
}

deepAnalyze();

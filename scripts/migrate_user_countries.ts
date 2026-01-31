
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) { console.error('Missing Creds'); process.exit(1); }

const supabase = createClient(supabaseUrl, supabaseKey);

// Normalization Rules (Dictionary)
const MANUAL_MAPPING: Record<string, string> = {
    "cotedivoire": "Côte d'Ivoire",
    "burkinafaso": "Burkina Faso",
    "saudiarabia": "Saudi Arabia",
    "iranislamicrepublicof": "Iran",
    "sierraleone": "Sierra Leone",
    "southafrica": "South Africa",
    "hongkong": "Hong Kong",
    "papuanewguinea": "Papua New Guinea",
    "unitedstates": "United States",
    "unitedkingdom": "United Kingdom",
    "korea": "South Korea",
    "congo": "DR Congo", // Check if specific Congo
    "tanzaniaunitedrepublicof": "Tanzania"
};

function normalize(str: string) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function migrate() {
    console.log("Starting Country Migration...");

    // 1. Fetch Canonical Countries
    console.log("Fetching canonical countries...");
    const { data: countries } = await supabase.from('countries').select('name, display_name, code');
    if (!countries) throw new Error("Could not fetch countries");

    // Map normalize -> Canonical Name
    const countryMap = new Map<string, string>();
    countries.forEach(c => {
        countryMap.set(normalize(c.name), c.name);
        if (c.display_name) countryMap.set(normalize(c.display_name), c.name);
        if (c.code) countryMap.set(normalize(c.code), c.name);
    });

    // 2. Fetch Profiles for Email -> ID Lookup
    console.log("Fetching User Profiles...");
    // We need to fetch all to match emails. 
    // Optimization: Depending on volume, maybe batched. But 1500 is small enough for one go.
    // Note: RLS might block email reading if not Service Role.
    // Assuming we have service role or valid access.
    let { data: profiles, error } = await supabase.from('profiles').select('id, email, country');

    if (error || !profiles) {
        console.error("Error fetching profiles:", error);
        return;
    }
    console.log(`Fetched ${profiles.length} profiles.`);

    // Build Email Map
    const emailToId = new Map<string, any>();
    profiles.forEach(p => {
        if (p.email) emailToId.set(p.email.toLowerCase().trim(), p);
    });

    // 3. Process CSV
    const csvPath = path.join(process.cwd(), 'public', 'export-user27012026.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const records = parse(fileContent, { columns: true, skip_empty_lines: true });

    let updatedCount = 0;
    let skippedCount = 0;
    let notFoundCount = 0;

    const updates = [];

    console.log(`Processing ${records.length} CSV records...`);

    for (const record of records) {
        const email = record['user_email']?.toLowerCase().trim();
        const rawNat = record['nationality'];

        if (!email || !rawNat || rawNat.trim() === '' || rawNat.trim() === 'NULL') {
            continue;
        }

        const profile = emailToId.get(email);
        if (!profile) {
            // User not found in DB (maybe deleted or email changed)
            notFoundCount++;
            continue;
        }

        // Resolve Country
        const norm = normalize(rawNat);
        let resolvedCountry = countryMap.get(norm);

        // Try Manual Mapping
        if (!resolvedCountry && MANUAL_MAPPING[norm]) {
            resolvedCountry = MANUAL_MAPPING[norm];
        }

        if (resolvedCountry) {
            // Check if update needed
            if (profile.country !== resolvedCountry) {
                updates.push({ id: profile.id, email: email, country: resolvedCountry });
            } else {
                skippedCount++; // Already correct
            }
        } else {
            console.log(`[WARN] Unresolved Country: ${rawNat} for ${email}`);
        }
    }

    console.log(`\nFound ${updates.length} profiles to update.`);
    console.log(`Skipped (Already Set): ${skippedCount}`);
    console.log(`Users Not Found in DB: ${notFoundCount}`);

    // 4. Perform Updates (Batched or Sequential)
    // Supabase JS doesn't support bulk update with different values easily without upsert.
    // We will do sequential concurrent updates for safety and simplicity given only ~800 rows.

    if (updates.length > 0) {
        console.log("Applying updates...");
        // Split into chunks of 10 for concurrency
        const chunkSize = 10;
        for (let i = 0; i < updates.length; i += chunkSize) {
            const chunk = updates.slice(i, i + chunkSize);
            await Promise.all(chunk.map(async (u) => {
                const { error } = await supabase
                    .from('profiles')
                    .update({ country: u.country })
                    .eq('id', u.id);

                if (error) console.error(`Failed to update ${u.email}:`, error.message);
                else process.stdout.write('.');
            }));
        }
    }

    console.log("\n\nMigration Complete!");
}

migrate();


import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import * as path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const usersToCheck = [
    'William Garcia',
    'Walid Seif',
    'Vivian Seemola',
    'Telman Shuriyev',
    'Abdallah SALHI',
    'SADITH PEREZ'
];

async function investigate() {
    console.log("--- 1. Fetching Emails from DB ---");
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('full_name, email')
        .in('full_name', usersToCheck); // This might fail if names aren't exact, I'll use OR ILIKE if needed but let's try exact first or fetch all and filter in JS for fuzziness

    // Better approach: fetch all profiles matching partial names
    // Actually, I'll just search the CSVs for the NAMES directly if I can't find emails easily.
    // But emails are better. Let's try to find their emails first.

    for (const name of usersToCheck) {
        const { data } = await supabase
            .from('profiles')
            .select('email, full_name, created_at')
            .ilike('full_name', `%${name}%`)
            .limit(1);

        if (data && data.length > 0) {
            const user = data[0];
            console.log(`\nUser: ${user.full_name} (${user.email})`);
            console.log(`Current DB Date: ${user.created_at}`);
            checkCsvs(user.email, user.full_name);
        } else {
            console.log(`\nUser not found in DB: ${name}`);
        }
    }
}

const csvFiles = [
    'public/user-export-wordpress-1-697236a535238.csv',
    'public/users_complete_2026-01-22.csv',
    'public/users_export_2026-01-22.csv'
];

function checkCsvs(email: string, name: string) {
    csvFiles.forEach(file => {
        const filePath = path.resolve(process.cwd(), file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            // Simple string search for now
            if (content.includes(email)) {
                console.log(`✅ FOUND in ${file}`);
            } else if (content.toLowerCase().includes(name.toLowerCase())) {
                console.log(`⚠️ FOUND BY NAME ONLY in ${file}`);
            } else {
                // console.log(`❌ Not in ${file}`);
            }
        }
    });
}

investigate();

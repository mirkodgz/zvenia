
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
    let output = "--- Investigation Report ---\n";

    for (const name of usersToCheck) {
        const { data } = await supabase
            .from('profiles')
            .select('email, full_name, created_at')
            .ilike('full_name', `%${name}%`)
            .limit(1);

        if (data && data.length > 0) {
            const user = data[0];
            output += `\nUser: ${user.full_name} (${user.email})\n`;
            output += `Current DB Date: ${user.created_at}\n`;
            output += checkCsvs(user.email, user.full_name);
        } else {
            output += `\nUser not found in DB: ${name}\n`;
        }
    }

    fs.writeFileSync('investigation_clean.txt', output);
    console.log("Written to investigation_clean.txt");
}

const csvFiles = [
    'public/user-export-wordpress-1-697236a535238.csv',
    'public/users_complete_2026-01-22.csv',
    'public/users_export_2026-01-22.csv'
];

function checkCsvs(email: string, name: string) {
    let res = "";
    csvFiles.forEach(file => {
        const filePath = path.resolve(process.cwd(), file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            if (content.includes(email)) {
                res += `[FOUND] in ${file}\n`;
            } else if (content.toLowerCase().includes(name.toLowerCase())) {
                res += `[FOUND BY NAME] in ${file}\n`;
            } else {
                res += `[NOT FOUND] in ${file}\n`;
            }
        }
    });
    return res;
}

investigate();

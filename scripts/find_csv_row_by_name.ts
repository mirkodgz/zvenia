
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync'; // Using parse is safer

const file = 'public/user-export-wordpress-1-697236a535238.csv';
const filePath = path.resolve(process.cwd(), file);

if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true
    });

    const targetUsers = [
        'William Garcia',
        'Walid Seif',
        'Vivian Seemola'
    ];

    console.log("--- Detail Search in WP Export ---");

    for (const target of targetUsers) {
        // Search in all columns generally, or ideally in 'display_name' or 'user_login' or 'first_name' etc.
        // The WP export usually has user_login, user_email, display_name.
        // My previous script printed header: user_login,user_email, ...

        const found = records.find(r =>
            (r.display_name && r.display_name.toLowerCase().includes(target.toLowerCase())) ||
            (r.user_login && r.user_login.toLowerCase().includes(target.toLowerCase()))
        );

        if (found) {
            console.log(`\nMatch for: ${target}`);
            console.log(`Email in CSV: ${found.user_email}`);
            console.log(`Date in CSV: ${found.user_registered}`);
        } else {
            console.log(`\nNo CSV row found for name: ${target}`);
        }
    }
}

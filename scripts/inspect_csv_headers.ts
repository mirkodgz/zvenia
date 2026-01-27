
import fs from 'fs';
import path from 'path';

const csvFiles = [
    'public/users_complete_2026-01-22.csv',
    'public/user-export-wordpress-1-697236a535238.csv',
    'public/users_export_2026-01-22.csv'
];

csvFiles.forEach(file => {
    const filePath = path.resolve(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        console.log(`\n--- Headers for ${file} ---`);
        const content = fs.readFileSync(filePath, 'utf-8');
        const header = content.split('\n')[0];
        console.log(header);
    } else {
        console.log(`\nFile not found: ${file}`);
    }
});

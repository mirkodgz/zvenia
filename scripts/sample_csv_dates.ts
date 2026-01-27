
import fs from 'fs';
import path from 'path';

const files = [
    'public/user-export-wordpress-1-697236a535238.csv',
    'public/users_complete_2026-01-22.csv',
    'public/users_export_2026-01-22.csv'
];

files.forEach(file => {
    const filePath = path.resolve(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        console.log(`\n=== SAMPLE FROM ${file} ===`);
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n').slice(0, 3); // Header + 2 rows
        lines.forEach((line, i) => {
            console.log(`[Line ${i}] ${line.substring(0, 150)}...`); // Truncate to avoid huge output
        });
    } else {
        console.log(`\nFile not found: ${file}`);
    }
});

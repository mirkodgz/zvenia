
import fs from 'fs';
import path from 'path';

const file = 'public/user-export-wordpress-1-697236a535238.csv';
const filePath = path.resolve(process.cwd(), file);

if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const header = lines[0].split(',');

    const dateIndex = header.findIndex(h => h.includes('registered') || h.includes('date') || h.includes('created'));

    console.log(`Header found columns: ${header.join(', ')}`);
    console.log(`Date Column Index: ${dateIndex}`);

    if (dateIndex !== -1) {
        console.log(`Column Name: ${header[dateIndex]}`);
        const firstUser = lines[1].split(',');
        console.log(`Sample Value (Row 1): ${firstUser[dateIndex]}`);
    } else {
        console.log("❌ NO registration date column found in this CSV.");
    }
} else {
    console.log("File not found");
}

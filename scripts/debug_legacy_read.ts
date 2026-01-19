
import fs from 'fs';
import * as csv from 'fast-csv';

const FILE = 'd:/zvenia/migration_data/z-posts-full.csv';

console.log(`Checking ${FILE}...`);
if (fs.existsSync(FILE)) {
    const stats = fs.statSync(FILE);
    console.log(`File exists. Size: ${stats.size} bytes.`);
} else {
    console.error("File does NOT exist.");
    process.exit(1);
}

let count = 0;
fs.createReadStream(FILE)
    .pipe(csv.parse({ headers: true })) // CSV might be Malformed? 
    .on('data', () => {
        count++;
        if (count % 1000 === 0) process.stdout.write('.');
    })
    .on('error', (err) => {
        console.error("CSV Parse Error:", err.message);
    })
    .on('end', () => {
        console.log(`\nDone. Read ${count} rows.`);
    });

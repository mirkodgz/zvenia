
const fs = require('fs');
const readline = require('readline');

const INPUT_CSV = 'd:/zvenia/migration_data/migrated_cloudinary_urls.csv';

async function main() {
    console.log('Scanning for PDF profile pictures...');

    if (!fs.existsSync(INPUT_CSV)) {
        console.error('File not found');
        return;
    }

    const fileStream = fs.createReadStream(INPUT_CSV);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    let pdfCount = 0;
    const pdfUsers = [];

    for await (const line of rl) {
        const parts = line.split(','); // simple split, might break on complex CSVs but finding .pdf is tolerant
        if (parts.length < 4) continue;

        // Col 3 is cloudinary_url (last one usually)
        const url = parts[parts.length - 1].replace(/"/g, '').trim().toLowerCase();

        if (url.endsWith('.pdf')) {
            // Email is parts[0]
            pdfUsers.push(parts[0]);
            pdfCount++;
        }
    }

    console.log('------------------------------------------------');
    console.log(`Total Users with PDF "Images": ${pdfCount}`);
    console.log('Affected Users (Sample):');
    pdfUsers.slice(0, 10).forEach(u => console.log(` - ${u}`));
    console.log('------------------------------------------------');
}

main().catch(console.error);

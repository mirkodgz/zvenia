
const fs = require('fs');
const readline = require('readline');

const INPUT_CSV = 'd:/zvenia/migration_data/user_profile_urls.csv';
const OUTPUT_CSV = 'd:/zvenia/migration_data/user_url_sources.csv';

function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current);
    return values;
}

async function main() {
    console.log('Analyzing URL sources...');

    if (!fs.existsSync(INPUT_CSV)) {
        console.error('Input file not found.');
        return;
    }

    const fileStream = fs.createReadStream(INPUT_CSV);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    let headers = null;
    let stats = {
        cloudinary: 0,
        wordpress: 0,
        other: 0,
        total: 0
    };

    const writeStream = fs.createWriteStream(OUTPUT_CSV);
    writeStream.write('user_email,media_id,source,url\n');

    for await (const line of rl) {
        if (!headers) {
            headers = parseCSVLine(line); // Skip headers
            continue;
        }

        const cols = parseCSVLine(line);
        if (cols.length < 3) continue;

        const email = cols[0];
        const mediaId = cols[1];
        const url = cols[2].replace(/"/g, ''); // Remove quotes if present

        let source = 'Other';
        if (url.includes('cloudinary.com') || url.includes('res.cloudinary')) {
            source = 'Cloudinary';
            stats.cloudinary++;
        } else if (url.includes('zvenia.com') || url.includes('wp-content')) {
            source = 'WordPress';
            stats.wordpress++;
        } else {
            stats.other++;
        }
        stats.total++;

        writeStream.write(`${email},${mediaId},${source},"${url}"\n`);
    }

    writeStream.end();

    console.log('Analysis Complete.');
    console.log('------------------------------------------------');
    console.log(`Total URLs processed: ${stats.total}`);
    console.log(`Cloudinary (Safe):    ${stats.cloudinary}`);
    console.log(`WordPress (Risk):     ${stats.wordpress}`);
    console.log(`Other/Unknown:        ${stats.other}`);
    console.log('------------------------------------------------');
    console.log(`Detailed breakdown saved to: ${OUTPUT_CSV}`);
}

main().catch(console.error);


const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const readline = require('readline');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const INPUT_CSV = 'd:/zvenia/migration_data/user_url_sources.csv';
const OUTPUT_CSV = 'd:/zvenia/migration_data/migrated_cloudinary_urls.csv';
const FOLDER_NAME = 'user_profiles_migration';

// CSV Parser
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

async function uploadImage(url, email) {
    try {
        // Use the email as the public_id (sanitized) to keep things organized
        // or let cloudinary generate a random one. Let's use email for easier tracking but sanitize it.
        const publicId = email.replace(/[^a-zA-Z0-9]/g, '_');

        const result = await cloudinary.uploader.upload(url, {
            folder: FOLDER_NAME,
            public_id: publicId,
            resource_type: 'image',
            timeout: 60000 // 60 seconds timeout
        });
        return result.secure_url;
    } catch (error) {
        console.error(`Failed to upload for ${email}: ${error.message}`);
        return null;
    }
}

async function main() {
    console.log('Starting migration to Cloudinary...');

    if (!fs.existsSync(INPUT_CSV)) {
        console.error('Input file not found!');
        return;
    }

    const fileStream = fs.createReadStream(INPUT_CSV);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    // Prepare output stream
    const writeStream = fs.createWriteStream(OUTPUT_CSV);
    writeStream.write('email,media_id,original_url,cloudinary_url\n');

    let headers = null;
    let count = 0;
    let skipped = 0;
    let failed = 0;
    let success = 0;

    // Use a loop to process line by line
    // To avoid hitting rate limits or overwhelming memory, we process sequentially.
    // Ideally we could do small batches, but sequential is safest and simplest for < 1000 items.

    for await (const line of rl) {
        if (!headers) {
            headers = parseCSVLine(line);
            continue;
        }

        const cols = parseCSVLine(line);
        if (cols.length < 4) continue;

        const email = cols[0];
        const mediaId = cols[1];
        const source = cols[2];
        let url = cols[3].replace(/"/g, ''); // Remove quotes

        if (source === 'WordPress') {
            process.stdout.write(`Migrating ${email}... `);
            const newUrl = await uploadImage(url, email);

            if (newUrl) {
                console.log('OK');
                writeStream.write(`${email},${mediaId},"${url}","${newUrl}"\n`);
                success++;
            } else {
                console.log('FAILED');
                failed++;
                // Optionally write to an error log
            }
        } else if (source === 'Cloudinary') {
            // Already good, just copy over to keep the file complete if desired, 
            // OR ignore since we only want to update the ones that changed.
            // Let's copy it so the output file is a "Master List" of valid Cloudinary URLs.
            writeStream.write(`${email},${mediaId},"${url}","${url}"\n`);
            skipped++;
        } else {
            skipped++;
        }
        count++;
    }

    writeStream.end();
    console.log('------------------------------------------------');
    console.log(`Migration Finished.`);
    console.log(`Expected to process: ${count}`);
    console.log(`Successfully migrated: ${success}`);
    console.log(`Already Cloudinary / Skipped: ${skipped}`);
    console.log(`Failed: ${failed}`);
    console.log(`Output saved to: ${OUTPUT_CSV}`);
}

main().catch(console.error);

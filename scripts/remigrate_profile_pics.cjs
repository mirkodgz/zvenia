
const fs = require('fs');
const readline = require('readline');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const USER_EXPORT_CSV = 'd:/zvenia/migration_data/user-export-1-6951d2e937896.csv';
const MEDIA_CSV = 'd:/zvenia/mediawordpress_converted.csv';
const OUTPUT_CSV = 'd:/zvenia/migration_data/final_migrated_avatars.csv';

// Helper to parse CSV line containing quotes
function parseCsvLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}

async function loadMediaMap() {
    console.log('Loading Media Map...');
    const mediaMap = new Map(); // ID -> URL

    const fileStream = fs.createReadStream(MEDIA_CSV);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    let isHeader = true;
    for await (const line of rl) {
        if (isHeader) { isHeader = false; continue; }

        // mediawordpress_converted.csv: id,title,url,date,mime_type
        // Simple split might fail if quotes are used, let's use robust parser or simple split if safe
        // The generator used "id","title","url"... format in write_to_file previously? 
        // Let's check step 9638. It used: `${id},"${title}","${url}","${date}","${mime}"\n`
        // So we need to handle quotes.

        const parts = parseCsvLine(line);
        if (parts.length < 3) continue;

        const id = parts[0].trim();
        const url = parts[2].replace(/^"|"$/g, '').trim(); // Remove surrounding quotes

        if (id && url) {
            mediaMap.set(id, url);
        }
    }
    console.log(`Loaded ${mediaMap.size} media items.`);
    return mediaMap;
}

async function main() {
    const mediaMap = await loadMediaMap();

    if (fs.existsSync(OUTPUT_CSV)) {
        console.log('Output file already exists. Appending strictly new entries not recommended without logic check. Deleting and restarting for clean state.');
        fs.unlinkSync(OUTPUT_CSV);
    }

    const fileStream = fs.createReadStream(USER_EXPORT_CSV);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    // Create Write Stream
    const writeStream = fs.createWriteStream(OUTPUT_CSV, { flags: 'a' });
    writeStream.write('email,original_url,cloudinary_url\n');

    let headers = [];
    let processedCount = 0;
    let uploadCount = 0;
    let skippedCount = 0;

    // Indexes
    let emailIdx = -1;
    let profilePicIdx = -1;

    for await (const line of rl) {
        // user-export format is mostly clean but might have quotes. 
        // We know structure from verify step: 
        // Index 1: user_email
        // Index 33: profile-picture

        const parts = parseCsvLine(line);

        if (headers.length === 0) {
            headers = parts;
            emailIdx = headers.indexOf('user_email');

            // "profile-picture" column name might theoretically vary or I want to be 100% sure relative to known verified index
            // But let's trust the name found in previous step.
            profilePicIdx = headers.indexOf('profile-picture');

            console.log(`Mapping Columns: Email [${emailIdx}], ProfilePic [${profilePicIdx}]`);
            continue;
        }

        const email = parts[emailIdx];
        const mediaId = parts[profilePicIdx];

        if (!email || !mediaId) {
            skippedCount++;
            continue;
        }

        const originalUrl = mediaMap.get(mediaId);

        if (!originalUrl) {
            // Media ID not found in library
            // console.log(`Media ID ${mediaId} not found for ${email}`);
            skippedCount++;
            continue;
        }

        // Check if it's a PDF
        if (originalUrl.toLowerCase().endsWith('.pdf')) {
            console.log(`Skipping PDF for ${email}: ${originalUrl}`);
            skippedCount++;
            continue;
        }

        // Upload to Cloudinary
        try {
            // Generating a unique public_id based on email hash or just random to avoid collisions? 
            // Or use email prefix. 
            // Let's rely on Cloudinary's auto-naming or use folder `profiles`.
            // User requested: "migration" - let's keep it organized.

            const sanitizedEmail = email.replace(/[^a-z0-9]/gi, '_');
            const result = await cloudinary.uploader.upload(originalUrl, {
                folder: 'migrated_profiles_v2',
                public_id: `${sanitizedEmail}_avatar`,
                overwrite: true,
                format: 'jpg'
            });

            // Check if Cloudinary detected it as a PDF despite extension.
            // Update: We now force format: 'jpg' so PDFs are converted to images.
            // The check is no longer needed as we WANT the converted image.


            writeStream.write(`${email},${originalUrl},${result.secure_url}\n`);
            processedCount++;
            uploadCount++;

            if (processedCount % 10 === 0) process.stdout.write('.');

        } catch (err) {
            console.error(`\nFailed to upload for ${email}: ${err.message}`);
        }
    }

    console.log('\n------------------------------------------------');
    console.log(`Processing Complete.`);
    console.log(`Uploaded/Migrated: ${uploadCount}`);
    console.log(`Skipped (No ID/No Media/PDF): ${skippedCount}`);
    console.log(`Saved to: ${OUTPUT_CSV}`);
}

main().catch(console.error);

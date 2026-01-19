
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const BENITTA_URL = 'https://zvenia.com/wp-content/uploads/jet-form-builder/2a40d1041d6395d3718e6cf3d2b68e82/2025/12/IMG_9235.jpeg';

async function testUpload() {
    console.log(`Uploading Benitta's URL: ${BENITTA_URL}`);
    try {
        const result = await cloudinary.uploader.upload(BENITTA_URL, {
            folder: 'debug_test',
            public_id: 'debug_benitta_check_forced',
            overwrite: true,
            format: 'jpg'
        });
        console.log('Result:');
        console.log(`Format: ${result.format}`);
        console.log(`Resource Type: ${result.resource_type}`);
    } catch (err) {
        console.error(err);
    }
}

testUpload();

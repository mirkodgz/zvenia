
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const TEST_URL = 'https://zvenia.com/wp-content/uploads/jet-form-builder/128f4a48d61ad34dc72dbf594798f92c/2025/08/IMG_3595-scaled.jpeg';
const TEST_ID = 'debug_test_avatar';

async function testUpload() {
    console.log(`Uploading: ${TEST_URL}`);
    try {
        const result = await cloudinary.uploader.upload(TEST_URL, {
            folder: 'debug_test',
            public_id: TEST_ID,
            overwrite: true
        });
        console.log('Result:');
        console.log(JSON.stringify(result, null, 2));
    } catch (err) {
        console.error(err);
    }
}

testUpload();

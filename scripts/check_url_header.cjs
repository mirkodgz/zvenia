
const https = require('https');

const URL = 'https://zvenia.com/wp-content/uploads/jet-form-builder/128f4a48d61ad34dc72dbf594798f92c/2025/08/IMG_3595-scaled.jpeg';

function checkHeader() {
    console.log(`Checking headers for: ${URL}`);

    const req = https.request(URL, { method: 'HEAD' }, (res) => {
        console.log('Status:', res.statusCode);
        console.log('Headers:');
        console.log(JSON.stringify(res.headers, null, 2));
    });

    req.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
    });

    req.end();
}

checkHeader();

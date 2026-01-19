
import fs from 'fs';
import path from 'path';
import https from 'https';

const url = "https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.js";
const dest = "d:/zvenia/astro-frontend/public/pdf.worker.min.js";

const file = fs.createWriteStream(dest);
https.get(url, function (response) {
    response.pipe(file);
    file.on('finish', function () {
        file.close(() => {
            console.log("Download completed: " + dest);
            // Verify size
            const stats = fs.statSync(dest);
            console.log(`Size: ${stats.size} bytes`);
        });
    });
}).on('error', function (err) {
    fs.unlink(dest, () => { });
    console.error("Error downloading file: " + err.message);
});

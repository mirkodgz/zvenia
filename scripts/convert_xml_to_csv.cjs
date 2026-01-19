
const fs = require('fs');
const readline = require('readline');
const path = require('path');

const INPUT_XML = 'd:/zvenia/mediawordpress.xml';
const OUTPUT_CSV = 'd:/zvenia/mediawordpress_converted.csv';

async function main() {
    console.log('Converting XML to CSV...');

    if (!fs.existsSync(INPUT_XML)) {
        console.error(`File not found: ${INPUT_XML}`);
        return;
    }

    const fileStream = fs.createReadStream(INPUT_XML);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    const writeStream = fs.createWriteStream(OUTPUT_CSV);
    writeStream.write('id,title,url,date,mime_type\n');

    let processingItem = false;
    let currentItem = {};

    let count = 0;

    // Simple state machine to parse <item> blocks
    for await (const line of rl) {
        const trimmed = line.trim();

        if (trimmed.includes('<item>')) {
            processingItem = true;
            currentItem = {};
        } else if (trimmed.includes('</item>')) {
            if (processingItem && currentItem.id) {
                // Write row
                const id = currentItem.id || '';
                const title = (currentItem.title || '').replace(/"/g, '""'); // Escape quotes
                const url = currentItem.url || '';
                const date = currentItem.date || '';
                const mime = currentItem.mime || '';

                writeStream.write(`${id},"${title}","${url}","${date}","${mime}"\n`);
                count++;
            }
            processingItem = false;
        } else if (processingItem) {
            // Extract fields using Regex

            // ID
            const idMatch = trimmed.match(/<wp:post_id>(\d+)<\/wp:post_id>/);
            if (idMatch) currentItem.id = idMatch[1];

            // Title
            const titleMatch = trimmed.match(/<title>(.*?)<\/title>/); // Capture content inside title
            if (titleMatch) {
                // Often title is wrapped in CDATA, need to handle that or standard text
                // Case: <title>IMG_2434</title> or <title><![CDATA[IMG_2434]]></title>
                let t = titleMatch[1];
                if (t.includes('<![CDATA[')) {
                    t = t.replace('<![CDATA[', '').replace(']]>', '');
                }
                currentItem.title = t;
            }

            // URL
            const urlMatch = trimmed.match(/<wp:attachment_url>(.*?)<\/wp:attachment_url>/);
            if (urlMatch) {
                let u = urlMatch[1];
                if (u.includes('<![CDATA[')) {
                    u = u.replace('<![CDATA[', '').replace(']]>', '');
                }
                currentItem.url = u;
            }

            // Date
            const dateMatch = trimmed.match(/<wp:post_date>(.*?)<\/wp:post_date>/);
            if (dateMatch) {
                let d = dateMatch[1];
                if (d.includes('<![CDATA[')) {
                    d = d.replace('<![CDATA[', '').replace(']]>', '');
                }
                currentItem.date = d;
            }

            // Mime Type
            const mimeMatch = trimmed.match(/<wp:post_mime_type>(.*?)<\/wp:post_mime_type>/);
            if (mimeMatch) {
                let m = mimeMatch[1];
                if (m.includes('<![CDATA[')) {
                    m = m.replace('<![CDATA[', '').replace(']]>', '');
                }
                currentItem.mime = m;
            }
        }
    }

    writeStream.end();
    console.log('------------------------------------------------');
    console.log(`Conversion Complete.`);
    console.log(`Total Items Extracted: ${count}`);
    console.log(`Saved to: ${OUTPUT_CSV}`);
}

main().catch(console.error);

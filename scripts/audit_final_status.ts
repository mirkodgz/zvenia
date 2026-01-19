
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function fullAudit() {
    console.log("📊 GENERATING FULL DATABASE REPORT...");

    // Fetch all posts
    let allPosts = [];
    let page = 0;
    const pageSize = 1000;

    while (true) {
        const { data, error } = await supabase
            .from('posts')
            .select('id, slug, title, featured_image_url, document_url')
            .range(page * pageSize, (page + 1) * pageSize - 1);

        if (error) {
            console.error("DB Error:", error);
            process.exit(1);
        }
        if (!data || data.length === 0) break;
        allPosts.push(...data);
        page++;
    }

    const total = allPosts.length;

    // Counters
    let hasBoth = 0;
    let imgOnly = 0;
    let pdfOnly = 0;
    let neither = 0;

    let brokenImg = 0; // zvenia.com links
    let brokenPdf = 0; // zvenia.com links

    const missingSamples = [];

    for (const p of allPosts) {
        const hasImg = p.featured_image_url && p.featured_image_url.length > 5;
        const hasPdf = p.document_url && p.document_url.length > 5;

        // Quality check
        if (hasImg && p.featured_image_url.includes('zvenia.com')) brokenImg++;
        if (hasPdf && p.document_url.includes('zvenia.com')) brokenPdf++;

        if (hasImg && hasPdf) {
            hasBoth++;
        } else if (hasImg && !hasPdf) {
            imgOnly++;
        } else if (!hasImg && hasPdf) {
            pdfOnly++;
        } else {
            neither++;
            if (missingSamples.length < 10) missingSamples.push(p.title || p.slug);
        }
    }

    console.log(`\n---------------------------------------------`);
    console.log(`📡 TOTAL POSTS IN DB: ${total}`);
    console.log(`---------------------------------------------`);
    console.log(`✅ COMPLETE (Img + PDF):     ${hasBoth}  (${((hasBoth / total) * 100).toFixed(1)}%)`);
    console.log(`🖼️ IMAGE ONLY (No PDF):      ${imgOnly}  (${((imgOnly / total) * 100).toFixed(1)}%)`);
    console.log(`📄 PDF ONLY (No Image):      ${pdfOnly}  (${((pdfOnly / total) * 100).toFixed(1)}%)`);
    console.log(`⚠️ MISSING BOTH:             ${neither}  (${((neither / total) * 100).toFixed(1)}%)`);
    console.log(`---------------------------------------------`);
    console.log(`🚧 BROKEN LINKS (zvenia.com domain):`);
    console.log(`   - Images: ${brokenImg}`);
    console.log(`   - PDFs:   ${brokenPdf}`);
    console.log(`---------------------------------------------`);
    if (missingSamples.length > 0) {
        console.log(`🔍 Posts Missing EVERYTHING (sample 10):`);
        missingSamples.forEach(s => console.log(`   - ${s}`));
    }
}

fullAudit().catch(console.error);

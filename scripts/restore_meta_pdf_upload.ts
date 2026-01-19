
import fs from 'fs';
import * as csv from 'fast-csv';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import https from 'https';

dotenv.config();

// Config Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const CSV_PATH_POSTS = 'd:/zvenia/migration_data/datos nuevos/z-post-limpio.csv';

// Full List (96 items)
const targetListRaw = `
Modelos para previsão do TML de finos de minério de ferro — Doutorado (2019)
Final Wall Control
O ensino da engenharia de minas na Escola de Minas de Ouro Preto: ontem, hoje e perspectivas futuras (2013)
Mineração em Terras Indígenas na América Latina: Desenvolvimento e Meio Ambiente (2023)
Permisología Minera (57 Pages)
Recherche d’opportunité en Grade Control – Technicien motivé disponible immédiatement
What is a Deep Mine?
COMPLIANCE
ETICA
GERENTE DE OPERACIONES
Tratado de Topografía (300 pages)
Maximum de Vraisemblance (MLE) & Méthodes
Itératives dans l’ajustement automatique des
variogrammes (49 pages)
100 Innovations in Mining
CADENA DE SUMINISTROS
Planning and Design of Underground Mining Operations (102 pages)
Pit Limits (10 pages)
Inteligencia Emocional
Vertical Distance Rate Adjustment_Open Pit Mining Contract (9 Pages)
Qué no preguntar en una entrevista de trabajo
Seguridad y Salud
KPI campamento Minero
Time Secrets of 100+ CEOs (29 pages)
Habilidades sociales
POR QUÉ CUESTA LIDERAR
Delegar, pero Delegar Bien
Unlocking the Secrets of Gold Ore: Types and Processing Methods!
Mastering the Soft Skills of Leadership (23 Pages)
Liderazgo orientado a la tarea
Mine Design Highlights (138 Pages)
De la recopilación de datos a la “Toma de Decisiones”: Uso de Power BI en la gestión de mantenimiento de Equipos Mineros
The Role of Product Selection in Blasting: Optimising Energy Delivery and Resulting Performance (8 pages)
Why You Need To Be Recording Your Blasts (4 pages)
Critical Role in Mine Projects (9 pages)
Truck and shovel queue visualisation (8 pages)
Manuel : Les professions de l'industrie minière
Classification of Resources and Reserves & Technical Terms, Turkish and English equivalents (3 pages)
Gestión Ambiental
Preguntas sorpresa : Enfoque Gerente de Recursos Humanos (7 pages)
Importance of Cut-Off Grade – Maximizing Mining Profits & Sustainability (8 pages)
Norme IRMA pour une Exploitation Minière Responsable (228 pages)
Development - Cost for Miners - Understanding and Managing Mine Costs (30 pages)
How underground mines can achieve the best in mine ventilation ? (4 pages)
Le potentiel minier de l’Afrique : Panorama, enjeux et défis
Guia de Izaje Seguro (124 pages)
Preventing Falls in Scaffolding Operations (68 pages)
Development of Komatsu's lunar construction equipment began in 2021 (13 pages)
Work At Heights Toolkit for Supervisors (74 pages)
DIY Accounting System in Excel (34 pages)
100 risk assessments (267 pages)
Las Reglas Que Salvan Vidas (17 pages)
The Need for Critical Minerals Supply Chain Diversification
The Complete Data Terms Dictionary (24 pages)
Ore Grade Reconciliation Techniques – A Review (6 pages)
Maintenance Excellence: A Balance Between Speed and Quality (7 pages)
Global Commodity Insights for 2024 (25 pages)
Finance Cheat Sheet (4 pages)
Guia de Controles Criticos que Salvan Vidas (54 pages)
The State of Critical Minerals Report 2024 (24 pages)
¿Qué Prioridades Estratégicas tiene tu Área de RRHH para el año 2025? (12 pages)
9 Types of Maintenance: How to choose the right maintenance strategy (14 pages)
Oportunidades de IA y ML en las soluciones de planificación minera (116 pages)
How to Read a Financial Statement (41 pages)
Corporate finance Cheat Sheet (6 pages)
Reconciliation principles for the mining industry (17 pages)
Strategic Mine Planning for Open Pit Mines – The Integrated Way!!! Part 1 (8 pages)
Storytelling with data (284 pages)
50 Business Diagrams for Strategic Planning (56 pages)
30 Things: Sports Edition (68 pages)
GUIDELINES AND CONSIDERATIONS FOR OPEN PIT DESIGNERS (16 pages)
Switchbacks and Truck Cycle Modelling in Schedules (5 pages)
Autonomous Haulage Systems: The Future of Mine Transportation (3 pages)
MODEL VALIDATION IN MINERAL RESOURCE ESTIMATION (17 pages)
The Trendline - Resource-rich countries step up intervention in extractives sector in 2023Q2 (5 pages)
Minerals-plus strategy (46 pages)
Cost Control Guide: Maximise your Profits (10 pages)
JORC Code draft 2024 (53 pages)
Revista Minería & Planificación (58 pages)
TABLEAU DE BORD MAINTENANCE (6 pages)
SUPPLY CHAIN MANAGEMENT (116 pages)
Drilling operations guidelines (123 pages)
DRILLING FLUIDS FUNCTIONS (28 pages)
Probability, Statistics and Estimation (191 pages)
LES CLÉS POUR PRÉVENIR LE RISQUE DE RENVERSEMENT D'ENGINS (13 pages)
Eye Safety (17 pages)
The World Justice Project Rule of Law Index® 2023 (223 pages)
Gestión del cierre de minas (73 pages)
Space Mining ?What if asteroid mining could solve Earth's resource crisis and pave the way for a new era of space exploration?
Do you know your safe zone (14 pages)
Specific surface area of polydispersions as a function of size distribution sharpness (2020)
`;

function normalize(str: string) {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function run() {
    console.log("🚀 Starting Restoration: Meta PDF -> Cloudinary -> Supabase");
    if (!process.env.CLOUDINARY_API_KEY) {
        console.error("❌ CLOUDINARY_API_KEY Missing!");
        process.exit(1);
    }

    const targets = targetListRaw.split('\n')
        .map(t => t.trim())
        .filter(t => t.length > 5);

    const targetSet = new Set(targets.map(normalize));
    const targetMap = new Map<string, string>();
    targets.forEach(t => targetMap.set(normalize(t), t));

    // 1. Scan CSV to find meta_pdf for each target
    console.log(`\n🔍 Scanning CSV for ${targets.length} items...`);
    const foundData = new Map<string, string>(); // OriginalTitle -> MetaPDF

    const stream = fs.createReadStream(CSV_PATH_POSTS);
    await new Promise((resolve) => {
        stream
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                const title = row.post_title || row.title || '';
                const key = normalize(title);

                let originalTitle = targetMap.get(key);
                if (!originalTitle) {
                    for (const t of targets) {
                        const tKey = normalize(t);
                        if (key.includes(tKey.substring(0, 40)) || tKey.includes(key.substring(0, 40))) {
                            if (Math.abs(key.length - tKey.length) < 20) {
                                originalTitle = t;
                                break;
                            }
                        }
                    }
                }

                if (originalTitle && !foundData.has(originalTitle)) {
                    const metaPdf = row.meta_pdf || '';
                    if (metaPdf && metaPdf.length > 5 && metaPdf.startsWith('http')) {
                        foundData.set(originalTitle, metaPdf);
                    }
                }
            })
            .on('end', resolve);
    });

    console.log(`✅ Found valid 'meta_pdf' for ${foundData.size} / ${targets.length} targets.`);

    // 2. Process Sync (Download -> Upload -> Update)
    let successCount = 0;
    let failCount = 0;

    for (const [title, pdfUrl] of foundData.entries()) {
        try {
            console.log(`\n------------------------------------------------`);
            console.log(`PROCESSING: "${title.substring(0, 40)}..."`);
            console.log(`URL: ${pdfUrl}`);

            // A. Download URL to temp file? Or stream to Cloudinary?
            // Cloudinary upload can take a remote URL directly!
            // BUT: zvenia.com might be slow or block. Let's try direct URL upload first.

            console.log(`☁️ Uploading to Cloudinary...`);
            const uploadRes = await cloudinary.uploader.upload(pdfUrl, {
                folder: 'cloud-files',
                resource_type: 'auto',
                use_filename: true,
                unique_filename: false
            });

            const newUrl = uploadRes.secure_url;
            console.log(`✅ Uploaded! New URL: ${newUrl}`);

            // B. Update Supabase
            console.log(`💾 Updating DB...`);

            // Need post ID. Search by title
            // Use ilike logic similar to verify
            const { data: posts, error: searchError } = await supabase
                .from('posts')
                .select('id, title, document_url')
                .ilike('title', `%${title.substring(0, 20)}%`); // Loose match to find cand

            let matchedPost = null;
            if (posts) {
                // strict filter in JS
                matchedPost = posts.find(p => normalize(p.title) === normalize(title));
                if (!matchedPost && posts.length > 0) matchedPost = posts[0]; // Fallback
            }

            if (matchedPost) {
                const { error: updateError } = await supabase
                    .from('posts')
                    .update({ document_url: newUrl })
                    .eq('id', matchedPost.id);

                if (updateError) throw updateError;
                console.log(`✅ Database Updated (ID: ${matchedPost.id})`);
                successCount++;
            } else {
                console.log(`⚠️ Post not found in Supabase (Title mismatch?)`);
                failCount++;
            }

        } catch (e: any) {
            console.error(`❌ FAILED: ${e.message}`);
            failCount++;
        }
    }

    console.log(`\n================================================`);
    console.log(`FINAL REPORT`);
    console.log(`Success: ${successCount}`);
    console.log(`Failed: ${failCount}`);
    console.log(`================================================`);
}

run();

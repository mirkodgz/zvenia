
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import axios from 'axios';
import path from 'path';
import * as csv from 'fast-csv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const CSV_PATH_POSTS = 'd:/zvenia/migration_data/datos nuevos/z-post-limpio.csv';
const DOWNLOAD_DIR = 'd:/zvenia/astro-frontend/temp_downloads';

if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR);

// List of FAILURES/PENDING from previous run (subset + user specific)
const targetListRaw = `
Modelos para previsão do TML de finos de minério de ferro — Doutorado (2019)
Recherche d’opportunité en Grade Control – Technicien motivé disponible immédiatement
O ensino da engenharia de minas na Escola de Minas de Ouro Preto: ontem, hoje e perspectivas futuras (2013)
Mineração em Terras Indígenas na América Latina: Desenvolvimento e Meio Ambiente (2023)
What is a Deep Mine?
Maximum de Vraisemblance (MLE) & Méthodes
Itératives dans l’ajustement automatique des
variogrammes (49 pages)
Mineração em Terras Indígenas na América Latina
(Add other failed items dynamically if needed, but let's re-scan all 96 and filter only those without Cloudinary URL)
`;

// Helper: Normalize
function normalize(str: string) {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function downloadFile(url: string, dest: string) {
    const writer = fs.createWriteStream(dest);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
        timeout: 30000 // 30s timeout
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

async function run() {
    console.log("🚀 Starting Retry Restoration (Download -> Local -> Cloudinary)");

    // 1. Re-Scan CSV to get Maps
    console.log("Scanning CSV for metadata...");
    const urlMap = new Map<string, string>(); // NormTitle -> MetaPDF

    // We used a list before, let's just create a quick map of ALL meta_pdf in memory for the target lookup
    // Actually, streaming valid meta_pdfs into a map is safer if memory allows (it's big csv).
    // Let's stick to the target list logic for safety.

    // Let's reload the FULL 96 list provided by user earlier to catch all failures
    const fullTargetList = `
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
    `.split('\n').map(t => t.trim()).filter(t => t.length > 5);

    const titleMap = new Map();
    fullTargetList.forEach(t => titleMap.set(normalize(t), t));

    // Get Meta PDFs
    await new Promise((resolve) => {
        fs.createReadStream(CSV_PATH_POSTS)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                const title = row.post_title || row.title || '';
                const key = normalize(title);
                let originalTitle = titleMap.get(key);

                // Fuzzy match fallback
                if (!originalTitle) {
                    for (const t of fullTargetList) {
                        const tKey = normalize(t);
                        if (key.includes(tKey.substring(0, 30)) || tKey.includes(key.substring(0, 30))) {
                            originalTitle = t;
                            break;
                        }
                    }
                }

                if (originalTitle) {
                    if (row.meta_pdf && row.meta_pdf.startsWith('http')) {
                        urlMap.set(originalTitle, row.meta_pdf);
                        urlMap.set(normalize(originalTitle), row.meta_pdf);
                    }
                }
            })
            .on('end', resolve);
    });

    // 2. Filter for those that are NOT yet fixed (check Supabase)
    console.log("Checking DB status for pending items...");
    let pendingItems = [];

    for (const t of fullTargetList) {
        const { data } = await supabase.from('posts').select('document_url').ilike('title', `%${t.substring(0, 20)}%`).maybeSingle();
        if (data) {
            if (!data.document_url || !data.document_url.includes('cloudinary')) {
                const metaUrl = urlMap.get(t) || urlMap.get(normalize(t));
                if (metaUrl) {
                    pendingItems.push({ title: t, url: metaUrl });
                }
            }
        }
    }

    console.log(`Found ${pendingItems.length} items still needing restoration.`);

    // 3. Process
    for (const item of pendingItems) {
        try {
            console.log(`\nProcessing: ${item.title.substring(0, 30)}...`);
            const filename = path.basename(item.url || 'temp.pdf');
            const localPath = path.join(DOWNLOAD_DIR, filename);

            console.log(`⬇️ Downloading ${item.url}...`);
            await downloadFile(item.url, localPath);

            // Validate size
            const stats = fs.statSync(localPath);
            if (stats.size < 1000) {
                console.log("⚠️ File too small (<1KB). Likely failed/redirect.");
                continue;
            }

            console.log(`☁️ Uploading to Cloudinary (Size: ${stats.size})...`);
            const uploadRes = await cloudinary.uploader.upload(localPath, {
                folder: 'cloud-files',
                resource_type: 'auto',
                use_filename: true,
                unique_filename: false
            });

            console.log(`✅ Uploaded! ${uploadRes.secure_url}`);

            // Update DB
            const { data: posts } = await supabase
                .from('posts')
                .select('id')
                .ilike('title', `%${item.title.substring(0, 20)}%`); // Fuzzy

            if (posts && posts.length > 0) {
                const { error } = await supabase.from('posts').update({ document_url: uploadRes.secure_url }).eq('id', posts[0].id);
                if (!error) console.log("💾 DB Saved.");
            }

            // Cleanup
            fs.unlinkSync(localPath);

        } catch (e: any) {
            console.error(`❌ Error: ${e.message}`);
        }
    }
}

run();

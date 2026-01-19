
import fs from 'fs';
import * as csv from 'fast-csv';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const CSV_PATH_POSTS = 'd:/zvenia/migration_data/datos nuevos/z-post-limpio.csv';
const CSV_PATH_MEDIA = 'd:/zvenia/migration_data/datos nuevos/media-limpio.csv';

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

const filenameMap = new Map<string, string>(); // Filename -> Cloudinary URL

async function loadMedia() {
    process.stdout.write("📂 Loading Media CSV... ");
    return new Promise((resolve) => {
        fs.createReadStream(CSV_PATH_MEDIA)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                const cloudUrl = row['wp_attachment_url'] || row['guid'];
                if (cloudUrl && cloudUrl.includes('res.cloudinary.com')) {
                    const filename = cloudUrl.split('/').pop() || '';
                    filenameMap.set(normalize(filename), cloudUrl);
                    // Also strict title match logic uses filename without ext
                    const noExt = filename.replace(/\.[^/.]+$/, "");
                    filenameMap.set(normalize(noExt), cloudUrl);
                }
            })
            .on('end', () => {
                console.log(`✅ Loaded ${filenameMap.size} Cloudinary files.`);
                resolve(true);
            });
    });
}

async function dryRun() {
    await loadMedia();

    // Normalize targets
    const targets = targetListRaw.split('\n')
        .map(t => t.trim())
        .filter(t => t.length > 5);

    console.log(`\n🔍 Checking ${targets.length} posts against 'meta_pdf'...\n`);

    const stats = {
        total: targets.length,
        found_meta_pdf: 0,
        linked_to_cloud: 0,
        missing_cloud: 0,
        no_meta_found: 0
    };

    const targetSet = new Set(targets.map(normalize));
    const targetMap = new Map<string, string>(); // NormTitle -> OriginalTitle
    targets.forEach(t => targetMap.set(normalize(t), t));

    const foundResults = new Map<string, { meta: string, cloud: string }>();

    const stream = fs.createReadStream(CSV_PATH_POSTS);
    await new Promise((resolve) => {
        stream
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                const title = row.post_title || row.title || '';
                const key = normalize(title);

                let originalTitle = targetMap.get(key);
                if (!originalTitle) {
                    // Try partial match for long targets
                    for (const t of targets) {
                        const tKey = normalize(t);
                        if (key.includes(tKey.substring(0, 40)) || tKey.includes(key.substring(0, 40))) {
                            if (Math.abs(key.length - tKey.length) < 20) { // Safety length check
                                originalTitle = t;
                                break;
                            }
                        }
                    }
                }

                if (originalTitle && !foundResults.has(originalTitle)) {
                    const metaPdf = row.meta_pdf || '';
                    if (metaPdf && metaPdf.length > 5 && !metaPdf.includes('false')) {
                        // Check Cloudinary
                        const filename = metaPdf.split('/').pop();
                        const fileKey = normalize(filename);
                        const cloudUrl = filenameMap.get(fileKey) || filenameMap.get(normalize(filename.replace(/\.[^/.]+$/, "")));

                        foundResults.set(originalTitle, {
                            meta: metaPdf,
                            cloud: cloudUrl || ''
                        });
                    }
                }
            })
            .on('end', resolve);
    });

    // Analyze results
    const missingItems = [];

    for (const t of targets) {
        const res = foundResults.get(t);
        if (res) {
            stats.found_meta_pdf++;
            if (res.cloud) {
                stats.linked_to_cloud++;
            } else {
                stats.missing_cloud++;
                missingItems.push(`[MISSING CLOUD] ${t} (Meta: ${res.meta})`);
            }
        } else {
            stats.no_meta_found++;
            missingItems.push(`[Not Found In CSV/No Meta] ${t}`);
        }
    }

    const reportLines = [
        "\n--- DRY RUN RESULTS ---",
        `Total Targets provided: ${stats.total}`,
        `✅ Ready to Recover (Meta PDF + Cloudinary): ${stats.linked_to_cloud}`,
        `⚠️ Has Meta PDF but NO Cloudinary File: ${stats.missing_cloud}`,
        `❌ Not Found / No Meta PDF: ${stats.no_meta_found}`,
        "",
        (missingItems.length > 0 ? "--- ATTENTION REQUIRED ---\n" + missingItems.slice(0, 15).join('\n') : "")
    ];

    const report = reportLines.join('\n');
    console.log(report);
    fs.writeFileSync('dry_run_report_utf8.txt', report, 'utf8');
}

dryRun();

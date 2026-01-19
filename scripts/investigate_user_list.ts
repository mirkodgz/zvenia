
import fs from 'fs';
import * as csv from 'fast-csv';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const MEDIA_CSV = 'd:/zvenia/migration_data/datos nuevos/media-limpio.csv';

// User provided list (cleaned up slightly)
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
Drilling operations guidelines (123 pages)
DRILLING FLUIDS FUNCTIONS (28 pages)
Probability, Statistics and Estimation (191 pages)
LES CLÉS POUR PRÉVENIR LE RISQUE DE RENVERSEMENT D'ENGINS (13 pages)
Eye Safety (17 pages)
The World Justice Project Rule of Law Index® 2023 (223 pages)
Gestión del cierre de minas (73 pages)
Space Mining ?What if asteroid mining could solve Earth's resource crisis and pave the way for a new era of space exploration?
Do you know your safe zone (14 pages)
`;

// Normalize logic
function normalize(str: string) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Map: Normalized Filename -> URL
const mediaMap = new Map<string, string>();
const urlMap = new Map<string, string>(); // Normalized URL -> URL (for checking if what we have in DB is "kinda" valid)

async function loadMedia() {
    return new Promise((resolve) => {
        fs.createReadStream(MEDIA_CSV)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                const url = row['wp_attachment_url'] || row['guid'];
                if (url) {
                    const filename = url.split('/').pop() || '';
                    // Key by simplified filename
                    mediaMap.set(normalize(filename), url);
                    // Also key by full simplified url just in case
                    urlMap.set(normalize(url), url);

                    // Also key by filename without extension
                    const noExt = filename.replace(/\.[^/.]+$/, "");
                    mediaMap.set(normalize(noExt), url);
                }
            })
            .on('end', resolve);
    });
}

async function investigate() {
    await loadMedia();
    console.log(`Loaded ${mediaMap.size} media items.`);

    const targets = targetListRaw.split('\n').map(t => t.trim()).filter(t => t.length > 2 && !t.startsWith('-'));

    console.log(`\n🔍 Investigating ${targets.length} titles from user list...\n`);

    const results = {
        already_ok: 0,
        found_in_media_csv: 0,
        found_in_db_but_missing_media: 0,
        not_found_in_db: 0,
        details: [] as string[]
    };

    for (const title of targets) {
        // 1. Search DB for Post
        // Use ILIKE with some flexibility (take first 15 chars approx)
        const searchTitle = title.replace(/['"]/g, '').substring(0, 20);
        const { data: posts } = await supabase.from('posts').select('id, title, document_url, slug').ilike('title', `%${searchTitle}%`);

        if (!posts || posts.length === 0) {
            results.not_found_in_db++;
            results.details.push(`❌ DB MISSING: "${title}"`);
            continue;
        }

        // Check each match (duplicate titles possible)
        for (const post of posts) {
            const currentUrl = post.document_url;
            const isCloudinary = currentUrl && currentUrl.includes('res.cloudinary.com');

            if (isCloudinary) {
                // User says they are missing, but DB says OK. Maybe broken link?
                // Double check if filename matches title somewhat?
                results.already_ok++;
                // results.details.push(`❓ ALREADY CLOUDINARY: "${post.title}" -> ${currentUrl}`);
            } else {
                // 2. Try to match Title to Media CSV
                // Heuristic: Remove "(X pages)", common words, look for match in mediaMap
                let cleanTitle = title
                    .replace(/\(\d+\s*pages?\)/gi, '') // Remove (13 pages)
                    .replace(/\(\d+\)/gi, '') // Remove (2019)
                    .trim();

                const key = normalize(cleanTitle);
                const mediaMatch = mediaMap.get(key);

                if (mediaMatch) {
                    results.found_in_media_csv++;
                    results.details.push(`✅ MATCH FOUND IN MEDIA: "${title}" \n      -> Current DB: ${currentUrl || 'NULL'} \n      -> SUGGESTION: ${mediaMatch}`);
                } else if (currentUrl) {
                    // Maybe we can recover from the legacy URL if it exists
                    const legacyFilename = currentUrl.split('/').pop() || '';
                    const legacyKey = normalize(legacyFilename);
                    const legacyMatch = mediaMap.get(legacyKey);

                    if (legacyMatch) {
                        results.found_in_media_csv++;
                        results.details.push(`✅ RECOVERABLE VIA LEGACY URL: "${title}" \n      -> Old URL: ${currentUrl} \n      -> SUGGESTION: ${legacyMatch}`);
                    } else {
                        results.found_in_db_but_missing_media++;
                        results.details.push(`⚠️ DB FOUND, NO MEDIA MATCH: "${title}" -> Current: ${currentUrl}`);
                    }
                } else {
                    results.found_in_db_but_missing_media++;
                    results.details.push(`⚠️ DB FOUND, IS NULL, NO NAME MATCH: "${title}"`);
                }
            }
        }
    }

    console.log('\n--- REPORT SUMMARY ---');
    console.log(`Total Targets: ${targets.length}`);
    console.log(`Already Cloudinary (False Positives?): ${results.already_ok}`);
    console.log(`Recoverable (Found in Media CSV): ${results.found_in_media_csv}`);
    console.log(`DB Found but No Media Match: ${results.found_in_db_but_missing_media}`);
    console.log(`Not Found in DB (Title Mismatch?): ${results.not_found_in_db}`);

    console.log('\n--- DETAILS ---');
    console.log(results.details.join('\n'));
}

investigate().catch(console.error);

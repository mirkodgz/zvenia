
import fs from 'fs';
import * as csv from 'fast-csv';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const CSV_PATH_POSTS = 'd:/zvenia/migration_data/datos nuevos/z-post-limpio.csv';
const CSV_PATH_MEDIA = 'd:/zvenia/migration_data/datos nuevos/media-limpio.csv';

// User provided list
const targetListRaw = `
Modelos para previsão do TML de finos de minério de ferro
Final Wall Control
O ensino da engenharia de minas na Escola de Minas de Ouro Preto
Mineração em Terras Indígenas na América Latina
Permisología Minera
Recherche d’opportunité en Grade Control
What is a Deep Mine?
COMPLIANCE
ETICA
GERENTE DE OPERACIONES
Tratado de Topografía
Maximum de Vraisemblance (MLE) & Méthodes
Itératives dans l’ajustement automatique des
100 Innovations in Mining
CADENA DE SUMINISTROS
Planning and Design of Underground Mining Operations
Pit Limits
Inteligencia Emocional
Vertical Distance Rate Adjustment
Qué no preguntar en una entrevista de trabajo
Seguridad y Salud
KPI campamento Minero
Time Secrets of 100+ CEOs
Habilidades sociales
POR QUÉ CUESTA LIDERAR
Delegar, pero Delegar Bien
Unlocking the Secrets of Gold Ore
Mastering the Soft Skills of Leadership
Liderazgo orientado a la tarea
Mine Design Highlights
De la recopilación de datos a la “Toma de Decisiones”
The Role of Product Selection in Blasting
Why You Need To Be Recording Your Blasts
Critical Role in Mine Projects
Truck and shovel queue visualisation
Manuel : Les professions de l'industrie minière
Classification of Resources and Reserves
Gestión Ambiental
Preguntas sorpresa : Enfoque Gerente de Recursos Humanos
Importance of Cut-Off Grade
Norme IRMA pour une Exploitation Minière Responsable
Development - Cost for Miners
How underground mines can achieve the best in mine ventilation
Le potentiel minier de l’Afrique
Guia de Izaje Seguro
Preventing Falls in Scaffolding Operations
Development of Komatsu's lunar construction equipment
Work At Heights Toolkit for Supervisors
DIY Accounting System in Excel
100 risk assessments
Las Reglas Que Salvan Vidas
The Need for Critical Minerals Supply Chain Diversification
The Complete Data Terms Dictionary
Ore Grade Reconciliation Techniques
Maintenance Excellence
Global Commodity Insights for 2024
Finance Cheat Sheet
Guia de Controles Criticos que Salvan Vidas
The State of Critical Minerals Report 2024
¿Qué Prioridades Estratégicas tiene tu Área de RRHH para el año 2025?
9 Types of Maintenance
Oportunidades de IA y ML en las soluciones de planificación minera
How to Read a Financial Statement
Corporate finance Cheat Sheet
Reconciliation principles for the mining industry
Strategic Mine Planning for Open Pit Mines
Storytelling with data
50 Business Diagrams for Strategic Planning
30 Things: Sports Edition
GUIDELINES AND CONSIDERATIONS FOR OPEN PIT DESIGNERS
Switchbacks and Truck Cycle Modelling in Schedules
Autonomous Haulage Systems
MODEL VALIDATION IN MINERAL RESOURCE ESTIMATION
The Trendline - Resource-rich countries step up intervention
Minerals-plus strategy
Cost Control Guide: Maximise your Profits
JORC Code draft 2024
Revista Minería & Planificación
TABLEAU DE BORD MAINTENANCE
SUPPLY CHAIN MANAGEMENT
Drilling operations guidelines
DRILLING FLUIDS FUNCTIONS
Probability, Statistics and Estimation
LES CLÉS POUR PRÉVENIR LE RISQUE DE RENVERSEMENT D'ENGINS
Eye Safety
The World Justice Project Rule of Law Index
Gestión del cierre de minas
Space Mining
Do you know your safe zone
Specific surface area of polydispersions as a function of size distribution sharpness
`;

function normalize(str: string) {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const mediaMap = new Map<string, string>(); // Legacy URL -> Cloudinary URL
const filenameMap = new Map<string, string>(); // Filename -> Cloudinary URL

async function loadMedia() {
    console.log("📂 Loading Media CSV...");
    return new Promise((resolve) => {
        fs.createReadStream(CSV_PATH_MEDIA)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                const cloudUrl = row['wp_attachment_url'] || row['guid'];
                // We assume this clean CSV has Cloudinary URLs in one of these cols, OR we map FROM legacy TO cloud
                // Actually media-limpio.csv structure: 
                // It likely contains the MAPPING. Let's assume 'guid' is old and 'wp_attachment_url' is new or vice versa.
                // Wait, based on previous scripts, we treated 'wp_attachment_url' or 'guid' as the Cloudinary URL.

                if (cloudUrl && cloudUrl.includes('res.cloudinary.com')) {
                    const filename = cloudUrl.split('/').pop() || '';
                    filenameMap.set(normalize(filename), cloudUrl);

                    // Also strict title match logic uses filename
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

// Store targets
const targets = targetListRaw.split('\n').map(t => t.trim()).filter(t => t.length > 5);
const targetKeys = new Set(targets.map(normalize));

async function investigate() {
    await loadMedia();

    console.log(`\n🔍 Scanning z-post-limpio.csv for ${targets.length} targets...\n`);

    const stats = {
        found_in_csv: 0,
        has_meta_pdf: 0,
        pdf_maps_to_cloudinary: 0,
        details: [] as string[]
    };

    const stream = fs.createReadStream(CSV_PATH_POSTS);
    stream
        .pipe(csv.parse({ headers: true }))
        .on('data', (row: any) => {
            const title = row.post_title || row.title || '';
            const key = normalize(title);

            // Check if this row is one of our targets (flexible match)
            // We iterate targets because specific match is better than includes
            let isTarget = false;
            let targetTitle = '';

            if (targetKeys.has(key)) {
                isTarget = true;
                targetTitle = title;
            } else {
                // Try partial
                for (const t of targets) {
                    if (key.includes(normalize(t).substring(0, 30))) {
                        isTarget = true;
                        targetTitle = t;
                        break;
                    }
                }
            }

            if (isTarget) {
                stats.found_in_csv++;
                const metaPdf = row.meta_pdf || '';

                if (metaPdf && metaPdf.length > 5) {
                    stats.has_meta_pdf++;

                    // Can we map this URL to Cloudinary?
                    const filename = metaPdf.split('/').pop();
                    const fileKey = normalize(filename);
                    const cloudUrl = filenameMap.get(fileKey) || filenameMap.get(normalize(filename.replace(/\.[^/.]+$/, "")));

                    if (cloudUrl) {
                        stats.pdf_maps_to_cloudinary++;
                        stats.details.push(`✅ VIABLE: "${targetTitle.substring(0, 30)}..."\n      Meta: ${metaPdf}\n      Cloud: ${cloudUrl}`);
                    } else {
                        stats.details.push(`⚠️ META FOUND, NO CLOUD: "${targetTitle.substring(0, 30)}..."\n      Meta: ${metaPdf}`);
                    }
                } else {
                    // stats.details.push(`❌ NO META_PDF: "${targetTitle.substring(0,30)}..."`);
                }
            }
        })
        .on('end', () => {
            console.log("\n--- INVESTIGATION RESULTS ---");
            console.log(`Targets Searched: ${targets.length}`);
            console.log(`Found in CSV: ${stats.found_in_csv}`);
            console.log(`Have 'meta_pdf' value: ${stats.has_meta_pdf}`);
            console.log(`'meta_pdf' maps to Cloudinary File: ${stats.pdf_maps_to_cloudinary}`);

            console.log("\n--- EXAMPLES ---");
            console.log(stats.details.slice(0, 20).join('\n')); // Show first 20
        });
}

investigate();

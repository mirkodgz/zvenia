
import fs from 'fs';
import * as csv from 'fast-csv';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const MEDIA_CSV = 'd:/zvenia/migration_data/datos nuevos/media-limpio.csv';

// Exact list from user
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
`;

function normalize(str: string) {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const mediaMap = new Map<string, string>();

async function loadMedia() {
    console.log("📂 Loading Media CSV...");
    return new Promise((resolve, reject) => {
        fs.createReadStream(MEDIA_CSV)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {
                const url = row['wp_attachment_url'] || row['guid'];
                if (url) {
                    const filename = url.split('/').pop() || '';
                    // Key 1: Full filename normalized
                    const key = normalize(filename);
                    if (key) mediaMap.set(key, url);

                    // Key 2: No extension normalized
                    const noExt = filename.replace(/\.[^/.]+$/, "");
                    const keyNoExt = normalize(noExt);
                    if (keyNoExt) mediaMap.set(keyNoExt, url);
                }
            })
            .on('end', () => {
                console.log(`✅ Loaded ${mediaMap.size} keys from Media CSV.`);
                resolve(true);
            })
            .on('error', reject);
    });
}

async function restore() {
    await loadMedia();

    const targets = targetListRaw.split('\n')
        .map(t => t.trim())
        .filter(t => t.length > 3);

    console.log(`\n🚑 Attempting restoration for ${targets.length} targets...\n`);

    let successCount = 0;
    let failCount = 0;

    for (const title of targets) {
        // Find Post
        const cleanSearch = title.replace(/['":]/g, '').split(' ').slice(0, 4).join(' ');
        const { data: posts } = await supabase
            .from('posts')
            .select('id, slug, title, document_url')
            .ilike('title', `%${cleanSearch}%`)
            .limit(1);

        if (!posts || posts.length === 0) {
            console.log(`❌ Skipped (Not found in DB): "${title}"`);
            continue;
        }

        const post = posts[0];

        // Skip if already good? User said force check, but let's be safe.
        // Actually, user wants these restored because they "don't show".
        // Trust the map match over current DB state if current DB is not Cloudinary.
        if (post.document_url && post.document_url.includes('res.cloudinary.com')) {
            // console.log(`⏩ Skipped (Already OK): ${post.slug}`);
            continue;
        }

        // Try Match
        const key = normalize(title);
        const match = mediaMap.get(key);

        if (match) {
            // Update
            const { error } = await supabase
                .from('posts')
                .update({ document_url: match })
                .eq('id', post.id);

            if (!error) {
                console.log(`✅ RESTORED: "${post.title}"\n    -> ${match}`);
                successCount++;
            } else {
                console.error(`🔥 DB Error updating ${post.slug}:`, error.message);
                failCount++;
            }
        } else {
            console.log(`⚠️ No file match found for: "${title}" (Key: ${key})`);
            failCount++;
        }
    }

    console.log(`\nDONE! Restored: ${successCount}, Failed/Skipped: ${failCount}`);
}

restore().catch(console.error);

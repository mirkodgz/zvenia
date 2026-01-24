import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('❌ Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

// Normalizar email para matching
function normalizeEmail(email: string): string {
    if (!email) return '';
    return email.toLowerCase().trim();
}

// Parsear array serializado PHP a array JavaScript
function parsePhpArray(phpString: string): string[] {
    if (!phpString || phpString.trim() === '') return [];
    
    // Formato: a:N:{i:0;s:7:"English";i:1;s:7:"Spanish";}
    // o: a:1:{i:0;s:7:"English";}
    try {
        const matches = phpString.match(/s:\d+:"([^"]+)"/g);
        if (!matches) return [];
        
        return matches.map(match => {
            const valueMatch = match.match(/s:\d+:"([^"]+)"/);
            return valueMatch ? valueMatch[1] : '';
        }).filter(v => v !== '');
    } catch (error) {
        console.warn(`⚠️ Error parsing PHP array: ${phpString}`, error);
        return [];
    }
}

// Buscar país por nombre (fuzzy matching)
async function findCountryId(countryName: string, countriesMap: Map<string, number>): Promise<number | null> {
    if (!countryName || countryName.trim() === '') return null;
    
    const normalized = countryName.trim();
    
    // Búsqueda exacta
    if (countriesMap.has(normalized)) {
        return countriesMap.get(normalized)!;
    }
    
    // Búsqueda case-insensitive
    for (const [name, id] of countriesMap.entries()) {
        if (name.toLowerCase() === normalized.toLowerCase()) {
            return id;
        }
    }
    
    return null;
}

// Buscar mining topic por nombre o slug
async function findMiningTopicId(topicName: string, topicsMap: Map<string, number>): Promise<number | null> {
    if (!topicName || topicName.trim() === '') return null;
    
    const normalized = topicName.trim();
    
    // Búsqueda exacta
    if (topicsMap.has(normalized)) {
        return topicsMap.get(normalized)!;
    }
    
    // Búsqueda case-insensitive
    for (const [name, id] of topicsMap.entries()) {
        if (name.toLowerCase() === normalized.toLowerCase()) {
            return id;
        }
    }
    
    // Buscar por número (ej: "01 General mining" -> buscar "01")
    const numberMatch = normalized.match(/^(\d+)/);
    if (numberMatch) {
        const num = numberMatch[1].padStart(2, '0');
        for (const [name, id] of topicsMap.entries()) {
            if (name.startsWith(num)) {
                return id;
            }
        }
    }
    
    return null;
}

// Buscar idioma por nombre
async function findLanguageId(languageName: string, languagesMap: Map<string, number>): Promise<number | null> {
    if (!languageName || languageName.trim() === '') return null;
    
    const normalized = languageName.trim();
    
    // Búsqueda exacta
    if (languagesMap.has(normalized)) {
        return languagesMap.get(normalized)!;
    }
    
    // Búsqueda case-insensitive
    for (const [name, id] of languagesMap.entries()) {
        if (name.toLowerCase() === normalized.toLowerCase()) {
            return id;
        }
    }
    
    return null;
}

// Generar slug del email
function generateSlugFromEmail(email: string): string {
    if (!email) return '';
    return email
        .toLowerCase()
        .replace('@', '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

async function matchAndMergeUsers() {
    console.log('🚀 Iniciando matching y merge de usuarios...');
    console.log('');

    // Paso 1: Cargar tablas de referencia desde Supabase
    console.log('📊 Cargando tablas de referencia...');
    
    const { data: countries, error: countriesError } = await supabase
        .from('countries')
        .select('id, name, display_name');
    
    if (countriesError || !countries) {
        console.error('❌ Error cargando countries:', countriesError);
        return;
    }
    
    const { data: miningTopics, error: topicsError } = await supabase
        .from('mining_topics')
        .select('id, slug, name, display_name');
    
    if (topicsError || !miningTopics) {
        console.error('❌ Error cargando mining_topics:', topicsError);
        return;
    }
    
    const { data: languages, error: languagesError } = await supabase
        .from('languages')
        .select('id, code, name, display_name');
    
    if (languagesError || !languages) {
        console.error('❌ Error cargando languages:', languagesError);
        return;
    }
    
    // Crear mapas para búsqueda rápida
    const countriesMap = new Map<string, number>();
    countries.forEach(c => {
        countriesMap.set(c.name, c.id);
        countriesMap.set(c.display_name, c.id);
    });
    
    const topicsMap = new Map<string, number>();
    miningTopics.forEach(t => {
        topicsMap.set(t.name, t.id);
        topicsMap.set(t.display_name, t.id);
        topicsMap.set(t.slug, t.id);
    });
    
    const languagesMap = new Map<string, number>();
    languages.forEach(l => {
        languagesMap.set(l.name, l.id);
        languagesMap.set(l.display_name, l.id);
        languagesMap.set(l.code, l.id);
    });
    
    console.log(`✅ Countries: ${countries.length}`);
    console.log(`✅ Mining Topics: ${miningTopics.length}`);
    console.log(`✅ Languages: ${languages.length}`);
    console.log('');

    // Paso 2: Leer CSV de Supabase
    console.log('📥 Leyendo CSV de Supabase...');
    const supabaseCsvPath = path.resolve(process.cwd(), 'public', 'users_export_2026-01-22.csv');
    const supabaseCsvContent = fs.readFileSync(supabaseCsvPath, 'utf-8');
    const supabaseRecords: any[] = parse(supabaseCsvContent, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true
    });
    
    // Crear mapa por email normalizado
    const supabaseMap = new Map<string, any>();
    supabaseRecords.forEach(record => {
        const email = normalizeEmail(record.email);
        if (email) {
            supabaseMap.set(email, record);
        }
    });
    
    console.log(`✅ Usuarios en Supabase: ${supabaseRecords.length}`);
    console.log('');

    // Paso 3: Leer CSV de WordPress
    console.log('📥 Leyendo CSV de WordPress...');
    const wpCsvPath = path.resolve(process.cwd(), 'public', 'user-export-wordpress-1-697236a535238.csv');
    const wpCsvContent = fs.readFileSync(wpCsvPath, 'utf-8');
    const wpRecords: any[] = parse(wpCsvContent, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true
    });
    
    console.log(`✅ Usuarios en WordPress: ${wpRecords.length}`);
    console.log('');

    // Paso 4: Procesar cada usuario de WordPress
    console.log('🔄 Procesando usuarios...');
    const results: any[] = [];
    let updateCount = 0;
    let insertCount = 0;
    
    for (const wpUser of wpRecords) {
        const email = normalizeEmail(wpUser.user_email || wpUser.user_email);
        if (!email) {
            console.warn(`⚠️ Usuario sin email: ${wpUser.user_login}`);
            continue;
        }
        
        const existingUser = supabaseMap.get(email);
        const isNewUser = !existingUser;
        
        // Preparar datos del usuario
        const userData: any = {
            action: isNewUser ? 'INSERT' : 'UPDATE',
            is_new_user: isNewUser,
            email: email,
        };
        
        if (isNewUser) {
            // Usuario nuevo - usar todos los datos de WordPress
            userData.id = null; // Se generará al crear
            userData.username = wpUser.user_login || email;
            userData.full_name = wpUser.display_name || '';
            userData.first_name = wpUser.first_name || '';
            userData.last_name = wpUser.last_name || '';
            userData.role = wpUser.role || 'Basic';
            userData.profile_slug = generateSlugFromEmail(email);
        } else {
            // Usuario existente - solo llenar vacíos
            userData.id = existingUser.id;
            userData.username = existingUser.username || wpUser.user_login || email;
            userData.full_name = existingUser.full_name || wpUser.display_name || '';
            userData.first_name = existingUser.first_name || wpUser.first_name || '';
            userData.last_name = existingUser.last_name || wpUser.last_name || '';
            userData.role = existingUser.role || wpUser.role || 'Basic';
            userData.profile_slug = existingUser.profile_slug || generateSlugFromEmail(email);
        }
        
        // Campos directos (solo llenar si está vacío para UPDATE)
        if (isNewUser || !existingUser.company) {
            userData.company = wpUser['user-company'] || '';
        } else {
            userData.company = existingUser.company;
        }
        
        if (isNewUser || !existingUser.profession) {
            userData.profession = wpUser['user-profession'] || '';
        } else {
            userData.profession = existingUser.profession;
        }
        
        if (isNewUser || !existingUser.position) {
            userData.position = wpUser['current-position'] || '';
        } else {
            userData.position = existingUser.position;
        }
        
        if (isNewUser || !existingUser.current_location) {
            userData.current_location = wpUser['current-location'] || '';
        } else {
            userData.current_location = existingUser.current_location;
        }
        
        if (isNewUser || !existingUser.headline_user) {
            userData.headline_user = wpUser['headline-user'] || '';
        } else {
            userData.headline_user = existingUser.headline_user;
        }
        
        if (isNewUser || !existingUser.phone_number) {
            userData.phone_number = wpUser['user_phone_number'] || '';
        } else {
            userData.phone_number = existingUser.phone_number;
        }
        
        // Campos con tablas de referencia
        const nationalityId = await findCountryId(wpUser.nationality || '', countriesMap);
        if (isNewUser || !existingUser.nationality) {
            userData.nationality_id = nationalityId;
            userData.nationality = wpUser.nationality || '';
        } else {
            userData.nationality_id = null;
            userData.nationality = existingUser.nationality;
        }
        
        const workCountryId = await findCountryId(wpUser.work_country || '', countriesMap);
        if (isNewUser || !existingUser.work_country) {
            userData.work_country_id = workCountryId;
            userData.work_country = wpUser.work_country || '';
        } else {
            userData.work_country_id = null;
            userData.work_country = existingUser.work_country;
        }
        
        const mainTopicId = await findMiningTopicId(wpUser['main-areaofexpertise'] || '', topicsMap);
        if (isNewUser || !existingUser.main_area_of_expertise) {
            userData.main_area_of_expertise_id = mainTopicId;
            userData.main_area_of_expertise = wpUser['main-areaofexpertise'] || '';
        } else {
            userData.main_area_of_expertise_id = null;
            userData.main_area_of_expertise = existingUser.main_area_of_expertise;
        }
        
        const mainLanguageId = await findLanguageId(wpUser['main-language'] || '', languagesMap);
        if (isNewUser || !existingUser.main_language) {
            userData.main_language_id = mainLanguageId;
            userData.main_language = wpUser['main-language'] || '';
        } else {
            userData.main_language_id = null;
            userData.main_language = existingUser.main_language;
        }
        
        // Metadata - Arrays
        const othersLanguages = parsePhpArray(wpUser['others-language'] || wpUser['others-languages'] || '');
        const othersLanguagesIds = await Promise.all(
            othersLanguages.map(lang => findLanguageId(lang, languagesMap))
        );
        userData.metadata_others_languages = othersLanguagesIds.filter(id => id !== null).join('; ');
        userData.metadata_others_languages_raw = othersLanguages.join('; ');
        
        const othersAreas = parsePhpArray(wpUser['others-areasofexpertise'] || wpUser['others-areas'] || '');
        const othersAreasIds = await Promise.all(
            othersAreas.map(area => findMiningTopicId(area, topicsMap))
        );
        userData.metadata_others_areas_of_expertise = othersAreasIds.filter(id => id !== null).join('; ');
        userData.metadata_others_areas_of_expertise_raw = othersAreas.join('; ');
        
        // Z-PROMOTER
        userData.metadata_z_promoter_why = wpUser.why_do_you_want || '';
        userData.metadata_z_promoter_contribute = wpUser.how_can_you_contribute || '';
        
        const priority1Id = await findMiningTopicId(wpUser.priority_1 || '', topicsMap);
        userData.metadata_z_promoter_priority_1_id = priority1Id;
        userData.metadata_z_promoter_priority_1 = wpUser.priority_1 || '';
        
        const priority2Id = await findMiningTopicId(wpUser.priority_2 || '', topicsMap);
        userData.metadata_z_promoter_priority_2_id = priority2Id;
        userData.metadata_z_promoter_priority_2 = wpUser.priority_2 || '';
        
        const priority3Id = await findMiningTopicId(wpUser.priority_3 || '', topicsMap);
        userData.metadata_z_promoter_priority_3_id = priority3Id;
        userData.metadata_z_promoter_priority_3 = wpUser.priority_3 || '';
        
        // Z-ADS
        userData.metadata_z_ads_company_name = wpUser.company_name_zads || '';
        userData.metadata_z_ads_company_website = wpUser.company_website_zads || '';
        userData.metadata_z_ads_primary_contact_name = wpUser.primary_contact_name_z_ads || '';
        userData.metadata_z_ads_primary_contact_email = wpUser.primary_contact_email_z_ads || '';
        userData.metadata_z_ads_primary_contact_phone = wpUser.primary_contact_phone_z_ads || '';
        userData.metadata_z_ads_product_description = wpUser.product_description_zads || '';
        
        const whereToAdvertise = parsePhpArray(wpUser.where_to_advertise || '');
        const whereToAdvertiseIds = await Promise.all(
            whereToAdvertise.map(area => findMiningTopicId(area, topicsMap))
        );
        userData.metadata_z_ads_where_to_advertise = whereToAdvertiseIds.filter(id => id !== null).join('; ');
        userData.metadata_z_ads_where_to_advertise_raw = whereToAdvertise.join('; ');
        
        results.push(userData);
        
        if (isNewUser) {
            insertCount++;
        } else {
            updateCount++;
        }
        
        if (results.length % 100 === 0) {
            console.log(`   Procesados: ${results.length}/${wpRecords.length}`);
        }
    }
    
    console.log('');
    console.log('✅ Procesamiento completado');
    console.log(`   UPDATE: ${updateCount}`);
    console.log(`   INSERT: ${insertCount}`);
    console.log('');

    // Paso 5: Generar CSV final
    console.log('📝 Generando CSV final...');
    
    const csvHeaders = [
        'action', 'is_new_user', 'id', 'email', 'username', 'role',
        'first_name', 'last_name', 'full_name', 'profile_slug',
        'phone_number', 'nationality', 'nationality_id',
        'profession', 'work_country', 'work_country_id',
        'current_location', 'headline_user',
        'main_language', 'main_language_id',
        'main_area_of_expertise', 'main_area_of_expertise_id',
        'company', 'position', 'linkedin_url',
        'metadata_others_languages', 'metadata_others_languages_raw',
        'metadata_others_areas_of_expertise', 'metadata_others_areas_of_expertise_raw',
        'metadata_z_promoter_why', 'metadata_z_promoter_contribute',
        'metadata_z_promoter_priority_1', 'metadata_z_promoter_priority_1_id',
        'metadata_z_promoter_priority_2', 'metadata_z_promoter_priority_2_id',
        'metadata_z_promoter_priority_3', 'metadata_z_promoter_priority_3_id',
        'metadata_z_ads_company_name', 'metadata_z_ads_company_website',
        'metadata_z_ads_primary_contact_name', 'metadata_z_ads_primary_contact_email',
        'metadata_z_ads_primary_contact_phone', 'metadata_z_ads_product_description',
        'metadata_z_ads_where_to_advertise', 'metadata_z_ads_where_to_advertise_raw'
    ];
    
    // Función para escapar CSV
    function escapeCsv(value: any): string {
        if (value === null || value === undefined) return '';
        const str = String(value);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    }
    
    let csvContent = csvHeaders.map(escapeCsv).join(',') + '\n';
    
    results.forEach(result => {
        const row = csvHeaders.map(header => escapeCsv(result[header] || ''));
        csvContent += row.join(',') + '\n';
    });
    
    // Guardar archivo
    const fileName = `users_complete_${new Date().toISOString().split('T')[0]}.csv`;
    const filePath = path.resolve(process.cwd(), 'public', fileName);
    
    fs.writeFileSync(filePath, csvContent, 'utf-8');
    
    console.log('✅ CSV generado exitosamente!');
    console.log('');
    console.log('📁 Archivo guardado en:');
    console.log(`   ${filePath}`);
    console.log('');
    console.log('🌐 URL para descargar:');
    console.log(`   http://localhost:4321/${fileName}`);
    console.log('');
    console.log('📊 Estadísticas:');
    console.log(`   Total usuarios procesados: ${results.length}`);
    console.log(`   Usuarios a actualizar: ${updateCount}`);
    console.log(`   Usuarios nuevos a crear: ${insertCount}`);
    console.log('');
}

matchAndMergeUsers().catch(console.error);


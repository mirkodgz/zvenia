import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

const POSTS_CSV = path.resolve(process.cwd(), 'public', 'posts-export-wordpress.csv');

async function findPostInWordPress() {
    const slug = 'loading-and-hauling-in-open-pit-mining-the-heart-of-production';
    
    console.log(`🔍 Buscando post en CSV de WordPress: ${slug}\n`);
    
    if (!fs.existsSync(POSTS_CSV)) {
        console.error(`❌ CSV no encontrado: ${POSTS_CSV}`);
        console.log('\n💡 Archivos CSV disponibles en public/:');
        const publicDir = path.resolve(process.cwd(), 'public');
        const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.csv'));
        files.forEach(f => console.log(`   - ${f}`));
        return;
    }

    let found = false;
    const parser = fs.createReadStream(POSTS_CSV).pipe(
        parse({ columns: true, skip_empty_lines: true })
    );

    for await (const row of parser) {
        const postSlug = row['wp_post_name'] || row['post_name'] || row['slug'];
        
        if (postSlug && postSlug.toLowerCase().includes('loading-and-hauling')) {
            found = true;
            console.log('✅ POST ENCONTRADO EN CSV DE WORDPRESS:\n');
            console.log('='.repeat(60));
            
            // Mostrar campos relevantes para video
            console.log('\n📋 CAMPOS PRINCIPALES:');
            console.log(`   post_name/slug: ${postSlug}`);
            console.log(`   post_title: ${row['post_title'] || row['title'] || '(vacío)'}`);
            console.log(`   post_content: ${(row['post_content'] || row['content'] || '').substring(0, 200)}...`);
            
            console.log('\n🎥 CAMPOS DE VIDEO:');
            console.log(`   meta_external-video: ${row['meta_external-video'] || '(vacío)'}`);
            console.log(`   meta_video_url: ${row['meta_video_url'] || '(vacío)'}`);
            console.log(`   meta_youtube_url: ${row['meta_youtube_url'] || '(vacío)'}`);
            console.log(`   meta_video: ${row['meta_video'] || '(vacío)'}`);
            
            console.log('\n📄 CAMPOS DE PDF:');
            console.log(`   meta_pdf-text-url: ${row['meta_pdf-text-url'] || '(vacío)'}`);
            console.log(`   meta_file: ${row['meta_file'] || '(vacío)'}`);
            console.log(`   meta_upload_file: ${row['meta_upload_file'] || '(vacío)'}`);
            
            console.log('\n🖼️  CAMPOS DE IMAGEN:');
            console.log(`   meta_featured_image: ${row['meta_featured_image'] || '(vacío)'}`);
            console.log(`   meta_thumbnail_id: ${row['meta_thumbnail_id'] || '(vacío)'}`);
            
            console.log('\n📦 TODOS LOS METADATOS (meta_*):');
            const metaKeys = Object.keys(row).filter(k => k.startsWith('meta_'));
            metaKeys.forEach(key => {
                const value = row[key];
                if (value && value.length > 0 && value !== 'false' && value !== 'true') {
                    console.log(`   ${key}: ${value.substring(0, 100)}${value.length > 100 ? '...' : ''}`);
                }
            });
            
            console.log('\n' + '='.repeat(60));
            break;
        }
    }

    if (!found) {
        console.log('❌ Post no encontrado en el CSV');
        console.log('💡 Verifica que el archivo CSV tenga el campo correcto para el slug');
    }
}

findPostInWordPress().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
});


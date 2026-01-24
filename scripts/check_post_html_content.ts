import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

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

async function checkPostHTMLContent() {
    const slug = 'loading-and-hauling-in-open-pit-mining-the-heart-of-production';
    
    console.log(`🔍 Analizando contenido HTML del post: ${slug}\n`);
    
    const { data: post, error } = await supabase
        .from('posts')
        .select('id, title, content, excerpt')
        .eq('slug', slug)
        .single();

    if (error || !post) {
        console.error(`❌ Post no encontrado: ${slug}`);
        console.error('Error:', error);
        return;
    }

    console.log(`✅ Post encontrado: ${post.title}\n`);
    console.log('='.repeat(60));
    
    // Buscar videos en el contenido HTML
    const allContent = [
        post.content || '',
        post.excerpt || ''
    ].join(' ');

    console.log('\n🔍 BUSCANDO VIDEOS EN CONTENIDO HTML:\n');
    
    // Buscar YouTube embeds
    const youtubePatterns = [
        /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/gi,
        /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/gi,
        /youtu\.be\/([a-zA-Z0-9_-]+)/gi,
        /youtube\.com\/v\/([a-zA-Z0-9_-]+)/gi
    ];
    
    const youtubeMatches: string[] = [];
    youtubePatterns.forEach(pattern => {
        const matches = allContent.match(pattern);
        if (matches) {
            matches.forEach(m => {
                const idMatch = m.match(/([a-zA-Z0-9_-]{11})/);
                if (idMatch) youtubeMatches.push(idMatch[1]);
            });
        }
    });
    
    if (youtubeMatches.length > 0) {
        console.log('✅ YouTube videos encontrados:');
        youtubeMatches.forEach((id, idx) => {
            console.log(`   ${idx + 1}. Video ID: ${id}`);
            console.log(`      URL: https://www.youtube.com/watch?v=${id}`);
            console.log(`      Embed: https://www.youtube.com/embed/${id}`);
        });
    } else {
        console.log('❌ No se encontraron videos de YouTube en el contenido');
    }
    
    // Buscar iframes de video
    const iframePattern = /<iframe[^>]*src=["']([^"']+)["'][^>]*>/gi;
    const iframeMatches = Array.from(allContent.matchAll(iframePattern));
    
    if (iframeMatches.length > 0) {
        console.log('\n✅ iframes encontrados:');
        iframeMatches.forEach((match, idx) => {
            console.log(`   ${idx + 1}. ${match[1]}`);
        });
    }
    
    // Buscar tags <video>
    const videoTagPattern = /<video[^>]*>[\s\S]*?<\/video>/gi;
    const videoTagMatches = allContent.match(videoTagPattern);
    
    if (videoTagMatches && videoTagMatches.length > 0) {
        console.log('\n✅ Tags <video> encontrados:');
        videoTagMatches.forEach((match, idx) => {
            console.log(`   ${idx + 1}. ${match.substring(0, 200)}...`);
        });
    }
    
    // Buscar URLs de video directas
    const videoUrlPattern = /https?:\/\/[^\s<>"']+\.(mp4|webm|ogg|mov)/gi;
    const videoUrlMatches = allContent.match(videoUrlPattern);
    
    if (videoUrlMatches && videoUrlMatches.length > 0) {
        console.log('\n✅ URLs de video directas encontradas:');
        videoUrlMatches.forEach((url, idx) => {
            console.log(`   ${idx + 1}. ${url}`);
        });
    }
    
    // Mostrar muestra del contenido
    console.log('\n' + '='.repeat(60));
    console.log('\n📄 MUESTRA DEL CONTENIDO (primeros 500 caracteres):');
    console.log(allContent.substring(0, 500));
    if (allContent.length > 500) {
        console.log('...');
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('\n💡 RECOMENDACIÓN:');
    
    if (youtubeMatches.length > 0) {
        const videoId = youtubeMatches[0];
        console.log(`\n✅ Se encontró un video de YouTube. Para restaurarlo, ejecuta:`);
        console.log(`\n   npx tsx scripts/restore_video_to_post.ts "${slug}" "${videoId}"`);
    } else {
        console.log('\n❌ No se encontró video en el contenido HTML.');
        console.log('   El video podría estar en:');
        console.log('   1. Un CSV de migración de WordPress (no encontrado)');
        console.log('   2. Metadatos de WordPress que no se migraron');
        console.log('   3. Necesitas agregarlo manualmente desde el admin panel');
    }
}

checkPostHTMLContent().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});


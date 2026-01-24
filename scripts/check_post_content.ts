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

async function checkPostContent() {
    const slug = 'loading-and-hauling-in-open-pit-mining-the-heart-of-production';
    
    console.log(`🔍 Buscando post: ${slug}\n`);
    
    const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !post) {
        console.error(`❌ Post no encontrado: ${slug}`);
        console.error('Error:', error);
        return;
    }

    console.log(`✅ Post encontrado:`);
    console.log(`   ID: ${post.id}`);
    console.log(`   Title: ${post.title}`);
    console.log(`   Slug: ${post.slug}`);
    console.log('');

    console.log('📊 CONTENIDO MULTIMEDIA:');
    console.log('='.repeat(60));
    
    // Verificar campos de video
    console.log(`\n🎥 VIDEO:`);
    console.log(`   metadata?.youtube_url: ${post.metadata?.youtube_url || '(vacío)'}`);
    console.log(`   metadata?.video_url: ${post.metadata?.video_url || '(vacío)'}`);
    
    // Verificar PDF
    console.log(`\n📄 PDF:`);
    console.log(`   document_url: ${post.document_url || '(vacío)'}`);
    
    // Verificar imágenes
    console.log(`\n🖼️  IMÁGENES:`);
    console.log(`   featured_image_url: ${post.featured_image_url || '(vacío)'}`);
    console.log(`   metadata?.gallery: ${post.metadata?.gallery ? JSON.stringify(post.metadata.gallery) : '(vacío)'}`);
    
    // Verificar metadata completo
    console.log(`\n📦 METADATA COMPLETO:`);
    console.log(JSON.stringify(post.metadata, null, 2));
    
    console.log('\n' + '='.repeat(60));
    console.log('\n💡 DIAGNÓSTICO:');
    
    const hasYoutube = !!post.metadata?.youtube_url;
    const hasVideo = !!post.metadata?.video_url;
    const hasPdf = !!post.document_url;
    const hasImage = !!post.featured_image_url;
    const hasGallery = Array.isArray(post.metadata?.gallery) && post.metadata.gallery.length > 0;
    
    if (hasYoutube) {
        console.log('✅ YouTube URL encontrado en metadata.youtube_url');
    } else if (hasVideo) {
        console.log('✅ Video URL encontrado en metadata.video_url');
    } else if (hasPdf) {
        console.log('✅ PDF encontrado en document_url');
    } else if (hasImage || hasGallery) {
        console.log('✅ Imagen(es) encontrada(s)');
    } else {
        console.log('❌ NO se encontró contenido multimedia');
        console.log('   El post no tiene:');
        console.log('   - metadata.youtube_url');
        console.log('   - metadata.video_url');
        console.log('   - document_url');
        console.log('   - featured_image_url');
        console.log('   - metadata.gallery');
    }
}

checkPostContent().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});



import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
    // Debug
    console.log('[Proxy] Request URL:', request.url);
    const url = new URL(request.url);
    const rawTarget = url.searchParams.get('url');
    console.log('[Proxy] Target Raw:', rawTarget);

    // Ensure we handle encoded/decoded states
    // searchParams.get() already decodes the URI component
    const targetUrl = rawTarget;

    if (!targetUrl) {
        return new Response(`Missing URL parameter. Input: ${request.url}`, { status: 400 });
    }

    // Safety check for absolute URL
    if (!targetUrl.startsWith('http')) {
        console.error('[Proxy] Invalid URL (must be absolute):', targetUrl);
        return new Response(`Invalid URL: ${targetUrl}`, { status: 400 });
    }

    try {
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            console.error(`[Proxy] Fetch failed: ${response.status} ${response.statusText}`);
            return new Response(`Failed to fetch PDF: ${response.statusText}`, { status: response.status });
        }

        const blob = await response.blob();

        return new Response(blob, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Cache-Control': 'public, max-age=3600',
                'Access-Control-Allow-Origin': '*', // Allow all
            }
        });
    } catch (err: any) {
        console.error('[Proxy] Detailed Error:', err);
        return new Response(`Internal Server Error: ${err.message}`, { status: 500 });
    }
}

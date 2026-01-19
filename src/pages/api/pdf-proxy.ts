
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
    // Debug
    console.log('[Proxy] Request URL:', request.url);
    const url = new URL(request.url);
    const rawTarget = url.searchParams.get('url');
    console.log('[Proxy] Target Raw:', rawTarget);

    // Ensure we handle encoded/decoded states
    const targetUrl = rawTarget ? decodeURIComponent(rawTarget) : null;
    // Double decode check: if it starts with http it is fine, if it keeps having % ...
    // Actually searchParams.get() already decodes ONCE. 
    // If we passed valid URL, it should be fine. 
    // But let's log the final targetUrl.

    if (!targetUrl) {
        return new Response(`Missing URL parameter. Input: ${request.url}`, { status: 400 });
    }

    try {
        const response = await fetch(targetUrl);

        if (!response.ok) {
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
    } catch (err) {
        return new Response('Internal Server Error', { status: 500 });
    }
}

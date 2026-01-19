export { renderers } from '../../renderers.mjs';

const GET = async ({ request }) => {
  console.log("[Proxy] Request URL:", request.url);
  const url = new URL(request.url);
  const rawTarget = url.searchParams.get("url");
  console.log("[Proxy] Target Raw:", rawTarget);
  const targetUrl = rawTarget ? decodeURIComponent(rawTarget) : null;
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
        "Content-Type": "application/pdf",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*"
        // Allow all
      }
    });
  } catch (err) {
    return new Response("Internal Server Error", { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

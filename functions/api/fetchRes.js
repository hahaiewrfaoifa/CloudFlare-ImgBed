export async function onRequest(context) {
    const { request } = context;

    // 如果是OPTIONS请求，返回允许的方法
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    }

    try {
        const jsonRequest = await request.json();
        const url = jsonRequest.url;

        if (!url) {
            return new Response('URL is required', { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
        }

        const response = await fetch(url);
        const contentType = response.headers.get('content-type');

        if (contentType.startsWith('image') || contentType.startsWith('video')) {
            const headers = new Headers(response.headers);
            headers.set('Access-Control-Allow-Origin', '*');
            return new Response(response.body, {
                headers: headers
            });
        } else {
            return new Response('URL is not an image or video', { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
        }
    } catch (error) {
        return new Response('Error processing request', { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
    }
}

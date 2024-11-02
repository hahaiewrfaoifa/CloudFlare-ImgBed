export async function onRequest(context) {
    const { request } = context;

    // 定义允许的域名
    const allowedOrigins = [
        'https://cesi.jizhang100.us.kg',
        'https://jizhang.jizhang100.us.kg'
    ];

    // 获取请求的来源
    const origin = request.headers.get('Origin');

    // 检查请求的来源是否在允许的列表中
    const isOriginAllowed = allowedOrigins.includes(origin);

    // 如果是OPTIONS请求，返回允许的方法
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': isOriginAllowed ? origin : 'null',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    }

    // 处理其他请求
    const jsonRequest = await request.json();
    const url = jsonRequest.url;
    if (url === undefined) {
        return new Response('URL is required', { status: 400 });
    }
    const response = await fetch(url);
    const contentType = response.headers.get('content-type');
    if (contentType.startsWith('image') || contentType.startsWith('video')) {
        const headers = new Headers(response.headers);
        if (isOriginAllowed) {
            headers.set('Access-Control-Allow-Origin', origin);
        }
        return new Response(response.body, {
            headers: headers
        });
    } else {
        return new Response('URL is not an image or video', { status: 400 });
    }
}

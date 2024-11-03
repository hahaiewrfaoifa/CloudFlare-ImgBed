export async function onRequest(context) {
    // 获取请求对象
    const {
        request,
    } = context;
    
    // 辅助函数：添加 CORS 头部
    const addCORS = (response, status = 200, statusText = 'OK') => {
        const headers = new Headers(response.headers);
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        headers.set('Access-Control-Allow-Headers', 'Content-Type');
        return new Response(response.body, {
            status: status,
            statusText: statusText,
            headers: headers
        });
    }

    // 处理 OPTIONS 请求以支持 CORS
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    }

    // 仅允许 POST 方法
    if (request.method !== 'POST') {
        return addCORS(new Response('Method Not Allowed', { status: 405 }), 405, 'Method Not Allowed');
    }

    try {
        // 解析请求体中的 JSON 数据
        const jsonRequest = await request.json();
        const url = jsonRequest.url;

        if (url === undefined) {
            return addCORS(new Response('URL is required', { status: 400 }), 400, 'Bad Request');
        }

        // 获取资源
        const response = await fetch(url);
        const contentType = response.headers.get('content-type');

        if (contentType.startsWith('image') || contentType.startsWith('video')) {
            // 增加 CORS 头后返回
            return addCORS(new Response(response.body, {
                headers: response.headers
            }));
        } else {
            return addCORS(new Response('URL is not an image or video', { status: 400 }), 400, 'Bad Request');
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return addCORS(new Response('Internal Server Error', { status: 500 }), 500, 'Internal Server Error');
    }
}

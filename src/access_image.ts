  


export default {
    async fetch(request, env): Promise<Response> {
        let headers = new Headers();
		headers.set('Content-Type', 'image/png');
        const a = request.url.split('/')
        let name = a[a.length - 1]
        if (!name || !name.endsWith('.png')) {
            return new Response(null, {
                status: 404,
            });
        }
        const image = await env.MY_BUCKET.get(name);
        if (!image) {
            return new Response(null, {
                status: 404,
            });
        }
        return new Response(image.body, {
            headers: headers
        });
    },
} satisfies ExportedHandler<Env>;



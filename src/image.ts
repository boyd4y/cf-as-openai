  
import MODELS from '../config/models.json'

const MODELS_ID_MAP = MODELS.images_models.reduce(function (map, obj) {
	map[obj.id] = obj;
	return map;
}, {});

const MODELS_NAME_MAP = MODELS.images_models.reduce(function (map, obj) {
	map[obj.name] = obj;
	return map;
}, {});

function uint8ArrayToBase64(uint8Array) {
	let text = '';
	uint8Array.forEach(byte => {
		text += String.fromCharCode(byte);
	});
	return btoa(text);
}

async function readStream(stream) {
    const chunks = [];
    const reader = stream.getReader();
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
        }
        const concatenated = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
        let offset = 0;
        for (const chunk of chunks) {
            concatenated.set(chunk, offset);
            offset += chunk.length;
        }

        return concatenated;
    } finally {
        reader.releaseLock();
    }
}

export default {
    async fetch(request, env): Promise<Response> {
        let headers = new Headers();
		headers.set('Access-Control-Allow-Origin', '*');
		headers.set('Access-Control-Allow-Credentials', true);
		headers.set('Access-Control-Allow-Methods', '*');
		headers.set('Access-Control-Allow-Headers', '*');
		headers.set('Cache-Control', 'no-cache, must-revalidate');

		let data = await request.json()
		let model = data.model
		let id = null
		if (model.startsWith(env.IMAGE_MODEL_PREFIX)) {
			model = model.substring(env.IMAGE_MODEL_PREFIX.length)
		}
		if (model.endsWith('-beta')) {
			model = model.substring(0, model.length - '-beta'.length)
		}
		if (model in MODELS_ID_MAP) {
			id = MODELS_ID_MAP[model].id
		} else if (model in MODELS_NAME_MAP) {
			id = MODELS_NAME_MAP[model].id
		}
		if (!id) {
			return new Response(`invalid model ${model}`, { status: 400, headers: headers });
		}
		if (!data.prompt) {
			return new Response(`missing prompt`, { status: 400, headers: headers });
		}

        const stream = await env.AI.run(
            id,
            {
                "prompt": data.prompt
            }
        );
        const format = data.response_format || 'url';
        const buffer = await readStream(stream);
        const created = Math.floor(Date.now() / 1000);
        if (format === 'b64_json') {
            return new Response(JSON.stringify({
                data: [{b64_json: uint8ArrayToBase64(buffer)}],
                created
            }), {
                headers: {
                  "content-type": "application/json",
                },
            });
        } else {
            const name = crypto.randomUUID() + '.png';
            let res = await env.MY_BUCKET.put(name, buffer);
            let url =  new URL(request.url).origin + '/v1/images/get/' + name;
            if (env.R2_PUBLIC_DOMAIN) {
                url = `${env.R2_PUBLIC_DOMAIN}/${name}`
            }
            return new Response(JSON.stringify({
                data: [{ url: url }],
                created,
            }), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    },
} satisfies ExportedHandler<Env>;



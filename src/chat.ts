// we normally allow only the beta model

const decoder = new TextDecoder('utf-8');  // 默认就是 'utf-8', 也可以显式指定
const encoder = new TextEncoder('utf-8');  // 默认就是 'utf-8', 也可以显式指定
import MODELS from '../config/models.json'

const MODELS_ID_MAP = MODELS.text_models.reduce(function (map, obj) {
	map[obj.id] = obj;
	return map;
}, {});

const MODELS_NAME_MAP = MODELS.text_models.reduce(function (map, obj) {
	map[obj.name] = obj;
	return map;
}, {});

export default {
	async fetch(request, env: any) {
		let headers = new Headers();
		headers.set('content-type', 'text/event-stream');
		headers.set('Cache-Control', 'no-cache, must-revalidate');
		headers.set('Access-Control-Allow-Origin', '*');
		headers.set('Access-Control-Allow-Credentials', true);
		headers.set('Access-Control-Allow-Methods', '*');
		headers.set('Access-Control-Allow-Headers', '*');
		let data = await request.json()
		let model = data.model
		let id = null
		if (model.startsWith(env.TEXT_MODEL_PREFIX)) {
			model = model.substring(env.TEXT_MODEL_PREFIX.length)
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

		const llm_response = await env.AI.run(id, {
			messages: data.messages,
			stream: true
		});

		const created = Math.floor(Date.now() / 1000);
		const uuid = crypto.randomUUID();
		let buffer = ''
		const transformer = new TransformStream({
			transform(chunk, controller) {
				buffer += decoder.decode(chunk);
				while (true) {
					const newlineIndex = buffer.indexOf('\n');
					if (newlineIndex === -1) {
						break;
					}
					const line = buffer.slice(0, newlineIndex + 1);
					buffer = buffer.slice(newlineIndex + 1);
					try {
						if (line.startsWith('data: ')) {
							const content = line.slice('data: '.length);
							const doneflag = content.trim() == '[DONE]';
							if (doneflag) {
								controller.enqueue(encoder.encode("data: [DONE]\n\n"));
								return;
							}

							const data = JSON.parse(content);
							const newChunk =
								'data: ' +
								JSON.stringify({
									id: uuid,
									created,
									object: 'chat.completion.chunk',
									model: id,
									choices: [
										{
											delta: { content: data.response },
											index: 0,
											finish_reason: null,
										},
									],
								}) +
								'\n\n';
							controller.enqueue(encoder.encode(newChunk));
						}
					} catch (err) {
						console.error('Error parsing line:', err);
					}
				}
			},
		});

		return new Response(llm_response.pipeThrough(transformer), {
			headers: headers
		});
	},
} satisfies ExportedHandler;
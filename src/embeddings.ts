  
import MODELS from '../config/models.json'

const MODELS_ID_MAP = MODELS.embeddings_models.reduce(function (map, obj) {
	map[obj.id] = obj;
	return map;
}, {});

const MODELS_NAME_MAP = MODELS.embeddings_models.reduce(function (map, obj) {
	map[obj.name] = obj;
	return map;
}, {});

export default {
    async fetch(request, env): Promise<Response> {
		let data = await request.json()
		let model = data.model
		let id = null
		if (model.startsWith(env.EMBEDDING_MODEL_PREFIX)) {
			model = model.substring(env.EMBEDDING_MODEL_PREFIX.length)
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
		if (!data.input) {
			return new Response(`missing input`, { status: 400, headers: headers });
		}
		const response = await env.AI.run(
            id,
            {
                "text": [data.input]
            }
        );
        return new Response(JSON.stringify(
			{
				"object": "list",
				"data": [
				  {
					"object": "embedding",
					"index": 0,
					"embedding": response['data'][0],
				  }
				],
				"model": id,
			  }
		), {
            headers: {
              "content-type": "application/json",
            },
        });
    },
} satisfies ExportedHandler<Env>;
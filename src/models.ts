// we normally allow only the beta model

import MODELS from '../config/models.json'

export default {
    async fetch(request, env: any) {
		const created = Math.floor(Date.now() / 1000);
		let all_models = []
		all_models = all_models.concat(MODELS.text_models.map(x => {
			return {
				"id": `${env.TEXT_MODEL_PREFIX}${x.name}${x.beta ? '-beta' : ''}`,
				"name": x.name,
				"created": created,
				"object": "model",
				"owned_by": "cloudflare"
			}
		}))
		all_models = all_models.concat(MODELS.embeddings_models.map(x => {
			return {
				"id": `${env.EMBEDDING_MODEL_PREFIX}${x.name}${x.beta ? '-beta' : ''}`,
				"name": x.name,
				"created": created,
				"object": "model",
				"owned_by": "cloudflare"
			}
		}))
		all_models = all_models.concat(MODELS.images_models.map(x => {
			return {
				"id": `${env.IMAGE_MODEL_PREFIX}${x.name}${x.beta ? '-beta' : ''}`,
				"name": x.name,
				"created": created,
				"object": "model",
				"owned_by": "cloudflare"
			}
		}))
		return new Response(JSON.stringify({
			"object": "list",
			"data": all_models
		}), { status: 200});
    },
  } satisfies ExportedHandler;
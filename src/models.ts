// we normally allow only the beta model

import MODELS from '../config/models.json'

export default {
    async fetch(request, env: any) {
		let headers = new Headers();
		headers.set('Access-Control-Allow-Origin', '*');
		headers.set('Access-Control-Allow-Headers', '*');
		const created = Math.floor(Date.now() / 1000);
		return new Response(JSON.stringify({
			"object": "list",
			"data": MODELS.map(x => {
				return {
					"id": `${env.MODEL_PREFIX}${x.name}${x.beta ? '-beta' : ''}`,
					"name": x.name,
					"created": created,
					"object": "model",
					"owned_by": "cloudflare"
				}
			})
		}), { status: 200, headers: headers});
    },
  } satisfies ExportedHandler;
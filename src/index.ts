/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import chatHandler from './chat';
import modelsHandler from './models';
import embeddingsHandler from './embeddings';
import imageHandler from './image';
import accessImageHandler from './access_image';

export default {
	// and should return a Response (optionally wrapped in a Promise)
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		let response = null
		const url = new URL(request.url);
		if (request.type === 'OPTIONS' || request.method === 'OPTIONS') {
			response = new Response('', { status: 200 });
		}
		if (url.pathname.startsWith('/v1/images/get')) {
			console.log('fetch public image')
			response = accessImageHandler.fetch(request, env, ctx);
		} else {
			const auth_header = request.headers.get('Authorization')
			if (!auth_header || !auth_header.startsWith('Bearer ')) {
				response = new Response('missing key', { status: 400 });
			} else {
				const api_key = auth_header.substring(7).trim()
				// auth check env.API_KEY
				if (env.API_KEY != api_key) {
					response = new Response('invalid key', { status: 400 });
				}
				if (url.pathname === '/v1/chat/completions') {
					response = chatHandler.fetch(request, env, ctx);
				} else if (url.pathname === '/v1/models') {
					response = modelsHandler.fetch(request, env, ctx);
				} else if (url.pathname === '/v1/embeddings') {
					response = embeddingsHandler.fetch(request, env, ctx);
				} else if (url.pathname === '/v1/images/generations') {
					response = imageHandler.fetch(request, env, ctx);
				} else {
					response = new Response('Bad request', { status: 400});
				}
			}
		}
		
		if (!response.headers) {
			response.headers = new Headers();
		}
		response.headers.set('Access-Control-Allow-Origin', '*');
		response.headers.set('Access-Control-Allow-Credentials', true);
		response.headers.set('Access-Control-Allow-Methods', '*');
		response.headers.set('Access-Control-Allow-Headers', '*');
		return response
	},
};

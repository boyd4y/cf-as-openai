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

export default {
	// and should return a Response (optionally wrapped in a Promise)
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		let headers = new Headers();
		headers.set('Access-Control-Allow-Origin', '*');
		headers.set('Access-Control-Allow-Headers', '*');
  
		const url = new URL(request.url);
		if (request.type === 'OPTIONS' || request.method === 'OPTIONS') {
			return new Response('', { status: 200, headers: headers });
		}
		const auth_header = request.headers.get('Authorization')
		if (!auth_header || !auth_header.startsWith('Bearer ')) {
			return new Response('missing key', { status: 400, headers: headers });
		}
		const api_key = auth_header.substring(7).trim()
		// auth check env.API_KEY
		if (env.API_KEY != api_key) {
			return new Response('invalid key', { status: 400, headers: headers });
		}
		if (url.pathname === '/v1/chat/completions') {
			return chatHandler.fetch(request, env, ctx);
		} else if (url.pathname === '/v1/models') {
			return modelsHandler.fetch(request, env, ctx);
		}
		return new Response('Bad request', { status: 200, headers: headers});
	},
};

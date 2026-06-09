import type { Env } from '../../../src/index';

export const POST = async (request: Request, env: Env): Promise<Response> => {
	try {
		const res = await fetch(`https://api.bunny.net/videolibrary/${env.BUNNY_LIBRARY_ID}`, {
			method: 'POST',
			headers: {
				'AccessKey': env.BUNNY_STREAM_API_KEY,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				EnabledResolutions: '240p,360p,480p,720p',
			}),
		});

		if (!res.ok) {
			return new Response(JSON.stringify({ error: 'Bunny API алдаа гарлаа' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		return new Response(JSON.stringify({ success: true, message: '1080p хязгаарлагдлаа' }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Алдаа гарлаа' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
};

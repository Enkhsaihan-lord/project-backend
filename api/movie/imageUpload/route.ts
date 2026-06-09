import type { Env } from '../../../src/index';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(request: Request, env: Env): Promise<Response> {
	const contentType = request.headers.get('Content-Type') ?? '';

	let imageBuffer: ArrayBuffer;
	let imageType: string;

	if (ALLOWED_TYPES.includes(contentType)) {
		imageBuffer = await request.arrayBuffer();
		imageType = contentType;
	} else {
		const body = (await request.json()) as { image: string; contentType: string };

		if (!ALLOWED_TYPES.includes(body.contentType)) {
			return new Response(JSON.stringify({ error: 'Зөвшөөрөгдөөгүй зургийн төрөл' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const base64Data = body.image.includes(',') ? body.image.split(',')[1] : body.image;
		const dataUrl = `data:${body.contentType};base64,${base64Data.trim().replace(/\s/g, '')}`;
		const decoded = await fetch(dataUrl);
		imageBuffer = await decoded.arrayBuffer();
		imageType = body.contentType;
	}

	const ext = imageType.split('/')[1];
	const fileName = `movies/${crypto.randomUUID()}.${ext}`;
	await env.R2_BUCKET.put(fileName, imageBuffer, {
		httpMetadata: { contentType: imageType },
	});

	const workerOrigin = new URL(request.url).origin;
	const imageUrl = `${workerOrigin}/api/image/${fileName}`;

	return new Response(JSON.stringify({ url: imageUrl }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

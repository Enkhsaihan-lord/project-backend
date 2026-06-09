import { getPrisma } from '../../../lib/prisma';
import type { Env } from '../../../src/index';

interface MovieBody {
	name: string;
	description: string;
	image: string;
	videoUrl?: string;
	releaseDate?: string;
	subscription?: 'PREMIUM' | 'NORMAL';
}

export const POST = async (request: Request, env: Env): Promise<Response> => {
	const body = (await request.json()) as MovieBody;
	const { name, description, image, videoUrl, releaseDate, subscription } = body;

	const prisma = getPrisma(env.DB);
	try {
		const movie = await prisma.movie.create({
			data: { name, description, image, videoUrl, releaseDate, subscription },
		});
		return new Response(JSON.stringify(movie), {
			status: 201,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: 'aldaa garlaa' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
};
export const DELETE = async (req: Request, env: Env): Promise<Response> => {
	const { id } = (await req.json()) as { id: string };
	if (!id) {
		return new Response(JSON.stringify({ error: 'id шаардлагатай' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}
	const prisma = getPrisma(env.DB);
	const movie = await prisma.movie.findUnique({ where: { id } });
	if (!movie) {
		return new Response(JSON.stringify({ error: 'Кино олдсонгүй' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' },
		});
	}
	if (movie.videoUrl) {
		await fetch(`https://video.bunnycdn.com/library/${env.BUNNY_LIBRARY_ID}/videos/${movie.videoUrl}`, {
			method: 'DELETE',
			headers: { AccessKey: env.BUNNY_STREAM_API_KEY },
		});
	}
	await prisma.movie.delete({ where: { id } });
	return new Response(JSON.stringify({ message: 'Кино устгалаа' }), {
		headers: { 'Content-Type': 'application/json' },
	});
};

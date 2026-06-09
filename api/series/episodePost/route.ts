import { getPrisma } from '../../../lib/prisma';
import type { Env } from '../../../src/index';

interface EpisodeBody {
	episodeNumber: string;
	videoUrl?: string;
	subscription?: 'PREMIUM' | 'NORMAL';
}

export const POST = async (request: Request, env: Env, seriesId: string): Promise<Response> => {
	const body = (await request.json()) as EpisodeBody;
	const { episodeNumber, videoUrl, subscription } = body;

	const prisma = getPrisma(env.DB);
	try {
		const episode = await prisma.seriesInfo.create({
			data: { episodeNumber, videoUrl, seriesId, subscription },
		});
		return new Response(JSON.stringify(episode), {
			status: 201,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch {
		return new Response(JSON.stringify({ error: 'Алдаа гарлаа' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
};

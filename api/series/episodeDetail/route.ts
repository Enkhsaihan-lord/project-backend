import { getPrisma } from '../../../lib/prisma';
import type { Env } from '../../../src/index';

export const GET = async (_req: Request, env: Env, episodeId: string): Promise<Response> => {
	const prisma = getPrisma(env.DB);
	const episode = await prisma.seriesInfo.findUnique({ where: { id: episodeId } });
	if (!episode) {
		return new Response(JSON.stringify({ error: 'Анги олдсонгүй' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' },
		});
	}
	return new Response(JSON.stringify(episode), {
		headers: { 'Content-Type': 'application/json' },
	});
};

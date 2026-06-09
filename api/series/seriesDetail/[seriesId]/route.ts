import { getPrisma } from '../../../../lib/prisma';
import type { Env } from '../../../../src/index';

export const GET = async (
	_req: Request,
	env: Env,
	{ params }: { params: Promise<{ seriesId: string }> },
): Promise<Response> => {
	const { seriesId } = await params;
	const prisma = getPrisma(env.DB);
	const series = await prisma.series.findUnique({
		where: { id: seriesId },
		include: { episodes: { orderBy: { episodeNumber: 'asc' } } },
	});
	if (!series) {
		return new Response(JSON.stringify({ error: 'Series олдсонгүй' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' },
		});
	}
	return new Response(JSON.stringify(series), {
		headers: { 'Content-Type': 'application/json' },
	});
};

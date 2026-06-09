import { getPrisma } from '../../../../lib/prisma';
import type { Env } from '../../../../src/index';

export const GET = async (
	req: Request,
	env: Env,
	{ params }: { params: Promise<{ movieInfoId: string }> },
): Promise<Response> => {
	const prisma = getPrisma(env.DB);
	const { movieInfoId } = await params;
	const movie = await prisma.movie.findFirst({ where: { id: movieInfoId } });
	if (!movie) {
		return new Response(JSON.stringify({ error: 'Movie олдсонгүй' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' },
		});
	}
	return new Response(JSON.stringify(movie), {
		headers: { 'Content-Type': 'application/json' },
	});
};

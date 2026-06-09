import { getPrisma } from '../../../lib/prisma';
import type { Env } from '../../../src/index';

export const GET = async (_req: Request, env: Env): Promise<Response> => {
	const prisma = getPrisma(env.DB);
	const series = await prisma.series.findMany();
	return new Response(JSON.stringify(series), {
		headers: { 'Content-Type': 'application/json' },
	});
};

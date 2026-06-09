import { getPrisma } from '../../../lib/prisma';
import type { Env } from '../../../src/index';
export const GET = async (env: Env, req: Request) => {
	const prisma = getPrisma(env.DB);
	const allSeries = await prisma.series.findMany({});
	return new Response(JSON.stringify(allSeries), {
		headers: { 'Content-Type': 'application/json' },
	});
};

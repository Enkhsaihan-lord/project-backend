import { getPrisma } from '../../../lib/prisma';
import type { Env } from '../../../src/index';

interface SeriesBody {
	name: string;
	description: string;
	seriesNumber: string;
	image: string;
	videoUrl?: string;
	subscription?: 'PREMIUM' | 'NORMAL';
}

export const POST = async (request: Request, env: Env): Promise<Response> => {
	const body = (await request.json()) as SeriesBody;
	const { name, description, seriesNumber, image, videoUrl, subscription } = body;

	const prisma = getPrisma(env.DB);
	try {
		const series = await prisma.series.create({
			data: { name, description, seriesNumber, image, videoUrl, subscription },
		});
		return new Response(JSON.stringify(series), {
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
interface DeleteBody {
	id: string;
}

export const DELETE = async (request: Request, env: Env) => {
	const { id } = (await request.json()) as DeleteBody;
	const prisma = getPrisma(env.DB);
	try {
		const series = await prisma.series.delete({ where: { id } });
		return new Response(JSON.stringify(series), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch {
		return new Response(JSON.stringify({ error: 'Алдаа гарлаа' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
};

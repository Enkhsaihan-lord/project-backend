import { getPrisma } from '../../../lib/prisma';
import type { Env } from '../../../src/index';

export const GET = async (_req: Request, env: Env): Promise<Response> => {
	const prisma = getPrisma(env.DB);

	const [series, movies] = await Promise.all([
		prisma.series.findMany({
			select: { id: true, name: true, seriesNumber: true },
			orderBy: { seriesNumber: 'asc' },
		}),
		prisma.movie.findMany({
			select: { id: true, name: true, movieNumber: true },
			orderBy: { movieNumber: 'asc' },
		}),
	]);

	return new Response(JSON.stringify({ series, movies }), {
		headers: { 'Content-Type': 'application/json' },
	});
};

export const POST = async (req: Request, env: Env): Promise<Response> => {
	const prisma = getPrisma(env.DB);

	const body = await req.json() as {
		series: { id: string; seriesNumber: string }[];
		movies: { id: string; movieNumber: string }[];
	};

	const [updatedSeries, updatedMovies] = await Promise.all([
		Promise.all(
			body.series.map((item) =>
				prisma.series.update({
					where: { id: item.id },
					data: { seriesNumber: item.seriesNumber },
					select: { id: true, name: true, seriesNumber: true },
				})
			)
		),
		Promise.all(
			body.movies.map((item) =>
				prisma.movie.update({
					where: { id: item.id },
					data: { movieNumber: item.movieNumber },
					select: { id: true, name: true, movieNumber: true },
				})
			)
		),
	]);

	return new Response(JSON.stringify({ series: updatedSeries, movies: updatedMovies }), {
		headers: { 'Content-Type': 'application/json' },
	});
};

import { NextResponse } from 'next/server';
import { getPrisma } from '../../../lib/prisma';
import { Subscription } from '../../../src/generated/prisma/client';
import type { Env } from '../../../src/index';
export async function GET(req: Request, context: { params: Promise<{ movieInfoId: string }> }, env: Env) {
	const prisma = getPrisma(env.DB);
	const { movieInfoId } = await context.params;
	const getMovie = await prisma.movieInfo.findUnique({
		where: { id: movieInfoId },
	});

	if (!getMovie) {
		return NextResponse.json({ error: 'Movie NOT FOUND' }, { status: 404 });
	}
	return NextResponse.json(getMovie);
}

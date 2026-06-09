import { getPrisma } from '../../../lib/prisma';
import type { Env } from '../../../src/index';
import { NextRequest, NextResponse } from 'next/server';

interface type {
	role?: string;
	subscription?: string;
}

export const POST = async (req: NextRequest, { env }: { env: Env }) => {
	try {
		const prisma = getPrisma(env.DB);
		const body = (await req.json()) as type;
		const { subscription, role } = body;

		const whereClause: any = {};

		if (subscription) {
			whereClause.subscription = subscription;
		}

		if (role) {
			whereClause.role = role;
		}

		const users = await prisma.user.findMany({
			where: whereClause,
		});

		return NextResponse.json(users);
	} catch (error) {
		console.error('Шүүлт хийхэд алдаа гарлаа:', error);
		return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 });
	}
};

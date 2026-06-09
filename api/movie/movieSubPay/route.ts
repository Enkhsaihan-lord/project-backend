import { getPrisma } from '../../../lib/prisma';
import type { Env } from '../../../src/index';

export const GET = async (request: Request, env: Env): Promise<Response> => {
	const prisma = getPrisma(env.DB);
	try {
		const payments = await prisma.$queryRaw`
			SELECT id, email, duration,
				COALESCE(status, 'PENDING') as status,
				createdAt
			FROM "SubPayment"
			ORDER BY createdAt DESC
		`;
		const serialized = JSON.parse(JSON.stringify(payments, (_key, val) =>
			typeof val === 'bigint' ? Number(val) : val
		));
		return new Response(JSON.stringify(serialized), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Алдаа гарлаа' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
};

export const POST = async (request: Request, env: Env): Promise<Response> => {
	const prisma = getPrisma(env.DB);
	const body = await request.json() as { email: string; duration: '1month' | '3month' | '1year' };
	const { email, duration } = body;

	try {
		const payment = await prisma.subPayment.create({
			data: { email, duration },
		});

		return new Response(JSON.stringify(payment), {
			status: 201,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Алдаа гарлаа' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
};

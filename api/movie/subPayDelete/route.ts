import { getPrisma } from '../../../lib/prisma';
import type { Env } from '../../../src/index';

export const DELETE = async (request: Request, env: Env): Promise<Response> => {
	const prisma = getPrisma(env.DB);
	const body = await request.json() as { id: number };
	const { id } = body;

	try {
		await prisma.subPayment.delete({
			where: { id },
		});

		return new Response(JSON.stringify({ success: true }), {
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

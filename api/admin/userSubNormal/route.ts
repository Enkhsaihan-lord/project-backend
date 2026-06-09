import { getPrisma } from '../../../lib/prisma';
import type { Env } from '../../../src/index';

export const POST = async (request: Request, env: Env): Promise<Response> => {
	const { email } = (await request.json()) as { email: string };

	const prisma = getPrisma(env.DB);
	try {
		const updated = await prisma.user.update({
			where: { email },
			data: { subscription: 'NORMAL', subscriptionExpiresAt: null },
		});
		return new Response(JSON.stringify(updated), {
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

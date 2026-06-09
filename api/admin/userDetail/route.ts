import { getPrisma } from '../../../lib/prisma';
import type { Env } from '../../../src/index';

function json(data: unknown, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

export const GET = async (request: Request, env: Env): Promise<Response> => {
	const url = new URL(request.url);
	const email = url.searchParams.get('email');

	if (!email) return json({ error: 'Email шаардлагатай' }, 400);

	const prisma = getPrisma(env.DB);
	try {
		const user = await prisma.user.findUnique({
			where: { email },
			select: { id: true, name: true, email: true, role: true, subscription: true, subscriptionExpiresAt: true },
		});
		if (!user) return json({ error: 'Хэрэглэгч олдсонгүй' }, 404);
		return json(user);
	} catch {
		return json({ error: 'Серверийн алдаа гарлаа' }, 500);
	}
};

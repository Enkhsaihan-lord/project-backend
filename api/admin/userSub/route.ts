import { getPrisma } from '../../../lib/prisma';
import type { Env } from '../../../src/index';

type Duration = '1month' | '3month' | '1year';

interface UserSubBody {
	email: string;
	duration: Duration;
}

function calcExpiry(duration: Duration): Date {
	const now = new Date();
	if (duration === '1month') now.setMonth(now.getMonth() + 1);
	else if (duration === '3month') now.setMonth(now.getMonth() + 3);
	else now.setFullYear(now.getFullYear() + 1);
	return now;
}

export const POST = async (request: Request, env: Env): Promise<Response> => {
	const { email, duration } = (await request.json()) as UserSubBody;

	const prisma = getPrisma(env.DB);
	try {
		const updated = await prisma.user.update({
			where: { email },
			data: { subscription: 'PREMIUM', subscriptionExpiresAt: calcExpiry(duration) },
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

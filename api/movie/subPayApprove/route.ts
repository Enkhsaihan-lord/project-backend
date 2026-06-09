import { getPrisma } from '../../../lib/prisma';
import type { Env } from '../../../src/index';

export const POST = async (request: Request, env: Env): Promise<Response> => {
	const prisma = getPrisma(env.DB);
	const body = await request.json() as { id: number };
	const { id } = body;

	try {
		// Хүсэлтийг олох
		const payment = await prisma.subPayment.findUnique({
			where: { id },
		});

		if (!payment) {
			return new Response(JSON.stringify({ error: 'Хүсэлт олдсонгүй' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Expiry тооцоолох
		const now = new Date();
		if (payment.duration === '1month') {
			now.setMonth(now.getMonth() + 1);
		} else if (payment.duration === '3month') {
			now.setMonth(now.getMonth() + 3);
		} else if (payment.duration === '1year') {
			now.setFullYear(now.getFullYear() + 1);
		}

		// User subscription идэвхжүүлэх
		await prisma.user.update({
			where: { email: payment.email },
			data: { subscription: 'PREMIUM', subscriptionExpiresAt: now },
		});

		// SubPayment статус шинэчлэх (raw SQL — status column migration pending)
		await prisma.$executeRaw`UPDATE "SubPayment" SET status = 'APPROVED' WHERE id = ${id}`;

		return new Response(JSON.stringify({ success: true, id }), {
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

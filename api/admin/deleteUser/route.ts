import { getPrisma } from '../../../lib/prisma';
import type { Env } from '../../../src/index';

function json(data: unknown, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

export const DELETE = async (request: Request, env: Env): Promise<Response> => {
	const body = (await request.json()) as { requesterEmail: string; email: string };
	const { requesterEmail, email } = body;

	if (!requesterEmail || !email) {
		return json({ error: 'requesterEmail болон email шаардлагатай' }, 400);
	}

	const prisma = getPrisma(env.DB);
	try {
		const requester = await prisma.user.findUnique({
			where: { email: requesterEmail },
			select: { role: true },
		});

		if (!requester || (requester.role !== 'ADMIN' && requester.role !== 'SUPERADMIN')) {
			return json({ error: 'Зөвхөн Admin хэрэглэгч устгах эрхтэй' }, 403);
		}

		const target = await prisma.user.findUnique({
			where: { email },
			select: { role: true },
		});

		if (!target) {
			return json({ error: 'Хэрэглэгч олдсонгүй' }, 404);
		}

		if (target.role === 'ADMIN' && requester.role !== 'SUPERADMIN') {
			return json({ error: 'Admin хэрэглэгчийг зөвхөн SuperAdmin устгах боломжтой' }, 403);
		}

		await prisma.user.delete({ where: { email } });

		return json({ message: 'Хэрэглэгч амжилттай устгагдлаа' });
	} catch {
		return json({ error: 'Алдаа гарлаа' }, 500);
	}
};

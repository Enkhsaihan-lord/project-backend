import { getPrisma } from '../../../lib/prisma';
import type { Env } from '../../../src/index';

function json(data: unknown, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

export async function GET(_req: Request, env: Env) {
	try {
		const prisma = getPrisma(env.DB);
		const users = await prisma.user.findMany();
		return json(users);
	} catch (err) {
		console.error('GET USERS ERROR 👉', err);
		return json({ error: 'Серверийн алдаа гарлаа' }, 500);
	}
}

export async function DELETE(req: Request, env: Env) {
	try {
		const { userId } = (await req.json()) as { userId: number };
		if (!userId) {
			return json({ error: 'userId шаардлагатай' }, 400);
		}

		const prisma = getPrisma(env.DB);
		await prisma.user.delete({ where: { id: userId } });
		return json({ message: 'Хэрэглэгч устгагдлаа' });
	} catch (err) {
		console.error('DELETE USER ERROR 👉', err);
		return json({ error: 'Серверийн алдаа гарлаа' }, 500);
	}
}

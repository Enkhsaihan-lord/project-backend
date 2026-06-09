import { getPrisma } from '../../../lib/prisma';
import { hashPassword } from '../../../lib/password';
import type { Env } from '../../../src/index';

function json(data: unknown, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

export const POST = async (req: Request, env: Env): Promise<Response> => {
	try {
		const { email, newPassword } = (await req.json()) as { email: string; newPassword: string };

		if (!email || !newPassword) return json({ error: 'Имэйл болон шинэ нууц үг шаардлагатай' }, 400);

		const prisma = getPrisma(env.DB);
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) return json({ error: 'Хэрэглэгч олдсонгүй' }, 404);

		await prisma.user.update({
			where: { email },
			data: {
				password: await hashPassword(newPassword),
				verificationCode: null,
				codeExpiresAt: null,
			},
		});

		return json({ message: 'Нууц үг амжилттай солигдлоо' });
	} catch {
		return json({ error: 'Серверийн алдаа гарлаа' }, 500);
	}
};

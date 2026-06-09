import { getPrisma } from '../../../lib/prisma';
import type { Env } from '../../../src/index';

function json(data: unknown, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

export const POST = async (req: Request, env: Env): Promise<Response> => {
	try {
		const { email, code } = (await req.json()) as { email: string; code: string };

		if (!email || !code) return json({ error: 'Имэйл болон код шаардлагатай' }, 400);

		const prisma = getPrisma(env.DB);
		const user = await prisma.user.findUnique({ where: { email } });

		if (!user) return json({ error: 'Хэрэглэгч олдсонгүй' }, 404);
		if (user.verificationCode !== code) return json({ error: 'Код буруу байна' }, 400);
		if (!user.codeExpiresAt || new Date() > user.codeExpiresAt) {
			return json({ error: 'Кодын хугацаа дууссан' }, 400);
		}

		return json({ message: 'Код зөв байна' });
	} catch {
		return json({ error: 'Серверийн алдаа гарлаа' }, 500);
	}
};

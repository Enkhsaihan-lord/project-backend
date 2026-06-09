import { getPrisma } from '../../lib/prisma';
import { verifyPassword } from '../../lib/password';
import type { Env } from '../../src/index';

interface UserLogin {
	email: string;
	password: string;
}

function json(data: unknown, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

export async function handleSignIn(req: Request, env: Env) {
	try {
		const prisma = getPrisma(env.DB);
		const { email, password } = (await req.json()) as UserLogin;

		if (!email || !password) {
			return json({ error: 'Email болон нууц үг шаардлагатай' }, 400);
		}

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return json({ error: 'Хэрэглэгч олдсонгүй' }, 404);
		}

		if (!(await verifyPassword(password, user.password))) {
			return json({ error: 'Нууц үг буруу байна' }, 401);
		}

		return json({
			message: 'Амжилттай нэвтэрлээ',
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
				subscription: user.subscription,
			},
		});
	} catch (err) {
		console.error('SIGNIN ERROR 👉', err);
		return json({ error: 'Серверийн алдаа гарлаа' }, 500);
	}
}

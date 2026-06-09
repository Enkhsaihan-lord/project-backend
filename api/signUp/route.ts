import { getPrisma } from '../../lib/prisma';
import { hashPassword } from '../../lib/password';
import type { Env } from '../../src/index';

interface UserRegister {
	email: string;
	name: string;
	password: string;
	role?: string;
	subscription?: string;
}

function json(data: unknown, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

export async function handleSignUp(req: Request, env: Env) {
	try {
		const prisma = getPrisma(env.DB);
		const body = (await req.json()) as UserRegister;
		const { email, name, password, role, subscription } = body;

		if (!email || !name || !password) {
			return json({ error: 'Email, нэр болон нууц үг шаардлагатай' }, 400);
		}

		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return json({ error: 'Энэ имэйл бүртгэлтэй байна' }, 400);
		}

		const newUser = await prisma.user.create({
			data: {
				email,
				name,
				password: await hashPassword(password),
				role: role === 'ADMIN' || role === 'SUPERADMIN' ? role : 'USER',
				subscription: subscription === 'PREMIUM' ? 'PREMIUM' : 'NORMAL',
			},
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				subscription: true,
			},
		});

		return json({ message: 'Амжилттай бүртгэгдлээ', user: newUser }, 201);
	} catch (err) {
		console.error('SIGNUP ERROR 👉', err);
		return json({ error: 'Серверийн алдаа гарлаа' }, 500);
	}
}

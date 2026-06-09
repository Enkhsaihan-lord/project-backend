import { getPrisma } from '../../../lib/prisma';
import type { Env } from '../../../src/index';

function json(data: unknown, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

function generateCode(): string {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

export const POST = async (req: Request, env: Env): Promise<Response> => {
	try {
		const { email } = (await req.json()) as { email: string };

		if (!email) return json({ error: 'Имэйл шаардлагатай' }, 400);

		const prisma = getPrisma(env.DB);
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) return json({ error: 'Хэрэглэгч олдсонгүй' }, 404);

		const code = generateCode();
		const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

		await prisma.user.update({
			where: { email },
			data: { verificationCode: code, codeExpiresAt: expiresAt },
		});

		const res = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${env.RESEND_API_KEY}`,
			},
			body: JSON.stringify({
				from: 'onboarding@resend.dev',
				to: email,
				subject: 'Нууц үг сэргээх код',
				html: `<p>Таны баталгаажуулах код: <strong>${code}</strong></p><p>15 минутын дотор ашиглана уу.</p>`,
			}),
		});

		if (!res.ok) {
			const errBody = await res.text();
			console.error('Resend error:', res.status, errBody);
			return json({ error: 'Имэйл илгээхэд алдаа гарлаа', detail: errBody }, 500);
		}

		return json({ message: 'Код имэйл рүү илгээлээ' });
	} catch (err) {
		console.error('sendCode error:', err);
		return json({ error: 'Серверийн алдаа гарлаа' }, 500);
	}
};

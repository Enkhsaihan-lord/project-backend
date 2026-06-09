import { getPrisma } from '../../../lib/prisma';
import { Role } from '../../../src/generated/prisma/client';
import type { Env } from '../../../src/index';

function json(data: unknown, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

interface UserRoleBody {
	requesterEmail: string;
	email: string;
	role: Role;
}

export const POST = async (request: Request, env: Env): Promise<Response> => {
	const body = (await request.json()) as UserRoleBody;
	const { requesterEmail, email, role } = body;

	const prisma = getPrisma(env.DB);
	try {
		const requester = await prisma.user.findUnique({
			where: { email: requesterEmail },
			select: { role: true },
		});

		if (!requester || requester.role !== 'SUPERADMIN') {
			return json({ error: 'Зөвхөн SuperAdmin хэрэглэгч role өөрчлөх эрхтэй' }, 403);
		}

		const updated = await prisma.user.update({
			where: { email },
			data: { role },
		});
		return json(updated);
	} catch {
		return json({ error: 'Алдаа гарлаа' }, 500);
	}
};

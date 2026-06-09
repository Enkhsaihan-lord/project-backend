import { getPrisma } from '../../../lib/prisma';
import { Subscription } from '../../../src/generated/prisma/client';
import type { Env } from '../../../src/index';

interface MovieSubBody {
  id: string;
  subscription: Subscription;
}

export const POST = async (request: Request, env: Env): Promise<Response> => {
  const body = (await request.json()) as MovieSubBody;
  const { id, subscription } = body;

  const prisma = getPrisma(env.DB);
  try {
    const updated = await prisma.movie.update({
      where: { id },
      data: { subscription },
    });
    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'aldaa garlaa' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

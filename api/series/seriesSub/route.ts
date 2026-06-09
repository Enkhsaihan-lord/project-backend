import { getPrisma } from '../../../lib/prisma';
import { Subscription } from '../../../src/generated/prisma/client';
import type { Env } from '../../../src/index';

interface SeriesSubBody {
  id: string;
  subscription: Subscription;
}

export const POST = async (request: Request, env: Env): Promise<Response> => {
  const body = (await request.json()) as SeriesSubBody;
  const { id, subscription } = body;

  const prisma = getPrisma(env.DB);
  try {
    const [updated] = await prisma.$transaction([
      prisma.series.update({ where: { id }, data: { subscription } }),
      prisma.seriesInfo.updateMany({ where: { seriesId: id }, data: { subscription } }),
    ]);
    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Алдаа гарлаа' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

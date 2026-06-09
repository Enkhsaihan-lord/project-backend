import type { Env } from '../../../src/index';

export async function POST(request: Request, env: Env): Promise<Response> {
	const { title, collection } = (await request.json()) as {
		title: string;
		collection?: 'series' | 'movie';
	};

	const collectionId =
		collection === 'series'
			? env.BUNNY_SERIES_COLLECTION_ID
			: collection === 'movie'
				? env.BUNNY_MOVIE_COLLECTION_ID
				: undefined;

	const body: Record<string, string> = { title };
	if (collectionId) body.collectionId = collectionId;

	const createRes = await fetch(
		`https://video.bunnycdn.com/library/${env.BUNNY_LIBRARY_ID}/videos`,
		{
			method: 'POST',
			headers: { AccessKey: env.BUNNY_STREAM_API_KEY, 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		},
	);
	if (!createRes.ok) {
		return new Response(JSON.stringify({ error: 'Failed to create video' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
	const { guid: videoGuid } = (await createRes.json()) as { guid: string };

	return new Response(JSON.stringify({ videoGuid, libraryId: env.BUNNY_LIBRARY_ID }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}

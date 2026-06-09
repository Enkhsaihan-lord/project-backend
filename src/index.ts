import { getPrisma } from '../lib/prisma';
import { handleSignIn } from '../api/signIn/route';
import { handleSignUp } from '../api/signUp/route';
import { GET as handleGetAllUsers, DELETE as handleDeleteUser } from '../api/admin/allUsersGet/route';
import { POST as handleSendCode } from '../api/forgotPassword/sendCode/route';
import { POST as handleVerifyCode } from '../api/forgotPassword/verifyCode/route';
import { POST as handleChangePassword } from '../api/forgotPassword/changePassword/route';
import { POST as handleImageUpload } from '../api/movie/imageUpload/route';
import { POST as handleMoviePost, DELETE as handleMovieDelete } from '../api/movie/moviePost/route';
import { POST as handleUserSub } from '../api/admin/userSub/route';
import { POST as handleUserSubNormal } from '../api/admin/userSubNormal/route';
import { POST as handleUserRole } from '../api/admin/userRole/route';
import { POST as handleBunnyConfig } from '../api/admin/bunnyConfig/route';
import { POST as handleMovieSub } from '../api/admin/movieSub/route';
import { POST as handleSeriesSub } from '../api/series/seriesSub/route';
import { POST as handleVideoUpload } from '../api/movie/videoUpload/route';
import { GET as handleMovieDetail } from '../api/movie/movieDetail/[movieInfoId]/route';
import { GET as handleMovieList } from '../api/movie/allMovies/route';
import { GET as handleAllSeries } from '../api/series/allSeries/route';
import { GET as handleAllMoviesNew } from '../api/allMovies/route';
import { GET as handleAllSeriesNew } from '../api/allSeries/route';
import { POST as handleSeriesPost } from '../api/series/seriesPost/route';
import { POST as handleEpisodePost } from '../api/series/episodePost/route';
import { GET as handleSeriesDetail } from '../api/series/seriesDetail/[seriesId]/route';
import { GET as handleEpisodeDetail } from '../api/series/episodeDetail/route';
import { GET as handleUserDetail } from '../api/admin/userDetail/route';
import { GET as handleMovieSubPayGet, POST as handleMovieSubPay } from '../api/movie/movieSubPay/route';
import { POST as handleSubPayApprove } from '../api/movie/subPayApprove/route';
import { DELETE as handleSubPayDelete } from '../api/movie/subPayDelete/route';
import { GET as handleSetMovies, POST as handleSetMoviesPost } from '../api/admin/setMovies/route';

export interface Env {
	DB: D1Database;
	CLERK_SECRET_KEY: string;
	RESEND_API_KEY: string;
	R2_BUCKET: R2Bucket;
	R2_PUBLIC_URL: string;
	BUNNY_STREAM_API_KEY: string;
	BUNNY_LIBRARY_ID: string;
	BUNNY_SERIES_COLLECTION_ID: string;
	BUNNY_MOVIE_COLLECTION_ID: string;
}

const CORS_HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Video-Title',
};

function withCors(response: Response): Response {
	const newHeaders = new Headers(response.headers);
	for (const [key, value] of Object.entries(CORS_HEADERS)) {
		newHeaders.set(key, value);
	}
	return new Response(response.body, { status: response.status, headers: newHeaders });
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		if (request.method === 'OPTIONS') {
			return new Response(null, { status: 204, headers: CORS_HEADERS });
		}

		if (url.pathname === '/api/signIn' && request.method === 'POST') {
			return withCors(await handleSignIn(request, env));
		}

		if (url.pathname === '/api/signUp' && request.method === 'POST') {
			return withCors(await handleSignUp(request, env));
		}

		if (url.pathname === '/api/users' && request.method === 'GET') {
			return withCors(await handleGetAllUsers(request, env));
		}

		if (url.pathname === '/api/forgotPassword/sendCode' && request.method === 'POST') {
			return withCors(await handleSendCode(request, env));
		}

		if (url.pathname === '/api/forgotPassword/verifyCode' && request.method === 'POST') {
			return withCors(await handleVerifyCode(request, env));
		}

		if (url.pathname === '/api/forgotPassword/changePassword' && request.method === 'POST') {
			return withCors(await handleChangePassword(request, env));
		}

		if (url.pathname === '/api/movie/imageUpload' && request.method === 'POST') {
			return withCors(await handleImageUpload(request, env));
		}

		if (url.pathname === '/api/movie/allMovies' && request.method === 'GET') {
			return withCors(await handleMovieList(request, env));
		}

		if (url.pathname === '/api/allMovies' && request.method === 'GET') {
			return withCors(await handleAllMoviesNew(request, env));
		}

		if (url.pathname === '/api/series' && request.method === 'GET') {
			return withCors(await handleAllSeries(request, env));
		}

		if (url.pathname === '/api/allSeries' && request.method === 'GET') {
			return withCors(await handleAllSeriesNew(request, env));
		}

		if ((url.pathname === '/api/series' || url.pathname === '/api/series/seriesPost') && request.method === 'POST') {
			return withCors(await handleSeriesPost(request, env));
		}

		if (url.pathname.match(/^\/api\/series\/[^/]+\/episode$/) && request.method === 'POST') {
			const seriesId = url.pathname.split('/')[3];
			return withCors(await handleEpisodePost(request, env, seriesId));
		}

		if (url.pathname.match(/^\/api\/series\/episodeDetail\/[^/]+$/) && request.method === 'GET') {
			const episodeId = url.pathname.split('/')[4];
			return withCors(await handleEpisodeDetail(request, env, episodeId));
		}

		if (url.pathname.startsWith('/api/series/') && request.method === 'GET') {
			const seriesId = url.pathname.split('/api/series/')[1];
			return withCors(await handleSeriesDetail(request, env, { params: Promise.resolve({ seriesId }) }));
		}

		if (url.pathname === '/api/movie' && request.method === 'POST') {
			return withCors(await handleMoviePost(request, env));
		}

		if (url.pathname === '/api/movie' && request.method === 'DELETE') {
			return withCors(await handleMovieDelete(request, env));
		}

		if (url.pathname === '/api/userDetail' && request.method === 'GET') {
			return withCors(await handleUserDetail(request, env));
		}

		if (url.pathname === '/api/admin/userSub' && request.method === 'POST') {
			return withCors(await handleUserSub(request, env));
		}

		if (url.pathname === '/api/admin/userSubNormal' && request.method === 'POST') {
			return withCors(await handleUserSubNormal(request, env));
		}

		if (url.pathname === '/api/admin/userRole' && request.method === 'POST') {
			return withCors(await handleUserRole(request, env));
		}

		if (url.pathname === '/api/admin/bunnyConfig' && request.method === 'POST') {
			return withCors(await handleBunnyConfig(request, env));
		}

		if (url.pathname === '/api/admin/movieSub' && request.method === 'POST') {
			return withCors(await handleMovieSub(request, env));
		}

		if (url.pathname === '/api/admin/seriesSub' && request.method === 'POST') {
			return withCors(await handleSeriesSub(request, env));
		}

if (url.pathname === '/api/movie/videoUpload' && request.method === 'POST') {
			return withCors(await handleVideoUpload(request, env));
		}

		if (url.pathname === '/api/movie/movieSubPay' && request.method === 'GET') {
			return withCors(await handleMovieSubPayGet(request, env));
		}

		if (url.pathname === '/api/movie/movieSubPay' && request.method === 'POST') {
			return withCors(await handleMovieSubPay(request, env));
		}

		if (url.pathname === '/api/movie/subPayApprove' && request.method === 'POST') {
			return withCors(await handleSubPayApprove(request, env));
		}

		if (url.pathname === '/api/movie/subPayDelete' && request.method === 'DELETE') {
			return withCors(await handleSubPayDelete(request, env));
		}

		if (url.pathname === '/api/admin/setMovies' && request.method === 'GET') {
			return withCors(await handleSetMovies(request, env));
		}

		if (url.pathname === '/api/admin/setMovies' && request.method === 'POST') {
			return withCors(await handleSetMoviesPost(request, env));
		}

		if (url.pathname.startsWith('/api/movie/movieDetail/') && request.method === 'GET') {
			const movieInfoId = url.pathname.split('/api/movie/movieDetail/')[1];
			return withCors(await handleMovieDetail(request, env, { params: Promise.resolve({ movieInfoId }) }));
		}

		if (url.pathname.startsWith('/api/image/') && request.method === 'GET') {
			const key = url.pathname.slice('/api/image/'.length);
			const object = await env.R2_BUCKET.get(key);
			if (!object) return withCors(new Response('Not found', { status: 404 }));
			const headers = new Headers(CORS_HEADERS);
			headers.set('Content-Type', object.httpMetadata?.contentType ?? 'image/jpeg');
			headers.set('Cache-Control', 'public, max-age=31536000');
			return new Response(object.body, { headers });
		}

		const prisma = getPrisma(env.DB);
		const users = await prisma.user.findMany();
		ctx.waitUntil(prisma.$disconnect());
		return withCors(new Response(JSON.stringify(users)));
	},
};

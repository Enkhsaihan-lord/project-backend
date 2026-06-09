import { verifyToken } from "@clerk/backend";
import type { Env } from "../src/index";

export async function clerkMiddleware(
  request: Request,
  env: Env
): Promise<{ userId: string } | Response> {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = authHeader.slice(7);

  try {
    const payload = await verifyToken(token, { secretKey: env.CLERK_SECRET_KEY });
    return { userId: payload.sub };
  } catch {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}

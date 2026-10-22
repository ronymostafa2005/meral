import { cookies } from "next/headers";
import { connection } from "next/server";
import { cookieName, credentialsMatch, signToken } from "@/lib/ownerAuth";

export async function POST(request: Request) {
  await connection();
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!credentialsMatch(email, password)) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const jar = await cookies();
  jar.set(cookieName(), signToken(email), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
    secure: process.env.NODE_ENV === "production",
  });

  return Response.json({ ok: true });
}

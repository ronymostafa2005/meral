import { cookies } from "next/headers";
import { connection } from "next/server";
import { cookieName, verifyToken } from "@/lib/ownerAuth";

export async function GET() {
  await connection();
  const jar = await cookies();
  const session = verifyToken(jar.get(cookieName())?.value);
  if (!session) return Response.json({ ok: false }, { status: 401 });
  return Response.json({ ok: true, email: session.email });
}

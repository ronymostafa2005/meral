import { cookies } from "next/headers";
import { connection } from "next/server";
import { cookieName } from "@/lib/ownerAuth";

export async function POST() {
  await connection();
  const jar = await cookies();
  jar.set(cookieName(), "", { httpOnly: true, path: "/", maxAge: 0 });
  return Response.json({ ok: true });
}

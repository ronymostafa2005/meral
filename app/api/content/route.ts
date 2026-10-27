import { cookies } from "next/headers";
import { connection } from "next/server";
import { readContentAsync, writeContentAsync } from "@/lib/contentStore";
import { cookieName, verifyToken } from "@/lib/ownerAuth";
import { mergeContent } from "@/lib/siteContent";

export async function GET() {
  await connection();
  const content = await readContentAsync();
  return Response.json(content, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(request: Request) {
  await connection();
  const jar = await cookies();
  if (!verifyToken(jar.get(cookieName())?.value)) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const saved = await writeContentAsync(mergeContent(body));
  return Response.json(saved);
}

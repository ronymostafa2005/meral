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
  if (!body) {
    return Response.json({ ok: false, error: "Invalid content payload." }, { status: 400 });
  }

  try {
    const saved = await writeContentAsync(mergeContent(body));
    return Response.json(saved, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    // Never answer 200 here: the dashboard would tell the owner their work
    // was published when nothing was actually stored.
    console.error("[content] Could not persist content:", err);
    return Response.json(
      { ok: false, error: "Could not save your changes. Please try again." },
      { status: 500 },
    );
  }
}

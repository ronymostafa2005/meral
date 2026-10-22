import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { cookieName, verifyToken } from "@/lib/ownerAuth";

const TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["image/svg+xml", "svg"],
]);

export async function POST(request: Request) {
  await connection();
  const jar = await cookies();
  if (!verifyToken(jar.get(cookieName())?.value)) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ ok: false, error: "Missing file." }, { status: 400 });
  }

  const ext = TYPES.get(file.type);
  if (!ext) {
    return Response.json({ ok: false, error: "Use a JPG, PNG, WEBP, GIF, or SVG." }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return Response.json({ ok: false, error: "Image is larger than 8MB." }, { status: 400 });
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  fs.mkdirSync(dir, { recursive: true });
  const name = `${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(dir, name), bytes);

  return Response.json({ ok: true, url: `/uploads/${name}` });
}

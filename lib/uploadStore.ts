/**
 * uploadStore.ts
 * --------------
 * Persistent storage for images uploaded from the owner dashboard.
 *
 * • On Vercel (production): uses @vercel/blob and returns the blob's public
 *   CDN url. The serverless filesystem is read-only apart from /tmp, and
 *   anything written there is neither served as a static asset nor kept past
 *   a cold start, so writing into public/uploads cannot work once deployed.
 *   Requires BLOB_READ_WRITE_TOKEN env variable (set in Vercel dashboard).
 *
 * • Locally (development): writes to public/uploads and returns the
 *   /uploads/<name> path that Next serves from there.
 *
 * Server-only module, same as contentStore.
 */

import fs from "fs";
import path from "path";
import { assertWritableStorage, blobConfigured } from "./storageEnv";

const UPLOAD_DIR = "uploads";

async function blobUpload(name: string, bytes: Buffer, contentType: string): Promise<string> {
  const { put } = await import("@vercel/blob");
  const { url } = await put(`${UPLOAD_DIR}/${name}`, bytes, {
    access: "public",
    contentType,
    addRandomSuffix: false,
  });
  return url;
}

function localUpload(name: string, bytes: Buffer): string {
  // On Vercel this path cannot succeed; say so instead of throwing EROFS.
  assertWritableStorage();
  const dir = path.join(process.cwd(), "public", UPLOAD_DIR);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, name), bytes);
  return `/${UPLOAD_DIR}/${name}`;
}

/**
 * Store an uploaded image and return the url the site should reference.
 * Throws if the image could not be stored.
 */
export async function saveUpload(
  name: string,
  bytes: Buffer,
  contentType: string,
): Promise<string> {
  return blobConfigured() ? blobUpload(name, bytes, contentType) : localUpload(name, bytes);
}

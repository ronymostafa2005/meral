/**
 * contentStore.ts
 * ---------------
 * Persistent storage for portfolio content.
 *
 * • On Vercel (production): uses @vercel/blob to store site-content.json
 *   so saves survive serverless function restarts.
 *   Requires BLOB_READ_WRITE_TOKEN env variable (set in Vercel dashboard).
 *
 * • Locally (development): falls back to writing data/site-content.json
 *   to disk, exactly as before.
 *
 * Server-only module: it is imported by app/api/content/route.ts and must
 * never be pulled into a client component, because it reads the filesystem.
 */

import fs from "fs";
import path from "path";
import { mergeContent, type SiteContent } from "./siteContent";
import { assertWritableStorage, blobConfigured } from "./storageEnv";

// ─── In-memory cache ─────────────────────────────────────────────────────────
// Each serverless instance has its own cache, and a save only refreshes the
// instance that handled it. Without an expiry, every other warm instance would
// keep serving pre-save content until it cold-started, so the owner saves and
// visitors still see the old site. The TTL bounds that staleness.
let memCache: SiteContent | null = null;
let memCacheAt = 0;

const CACHE_TTL_MS = 5000;
const BLOB_KEY = "site-content.json";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isVercel() {
  return blobConfigured();
}

/** Returns the cached content while it is still fresh, otherwise null. */
function fresh(): SiteContent | null {
  if (memCache && Date.now() - memCacheAt < CACHE_TTL_MS) return memCache;
  return null;
}

function remember(content: SiteContent): SiteContent {
  memCache = content;
  memCacheAt = Date.now();
  return content;
}

// ─── Vercel Blob helpers (dynamic import to avoid errors locally) ────────────

async function blobRead(): Promise<SiteContent | null> {
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: BLOB_KEY });
    const blob = blobs.find((b) => b.pathname === BLOB_KEY);
    if (!blob) return null;

    /* The content always lands on the same pathname, so every publish reuses
       one URL — and blobs are served from the edge cache. `cache: "no-store"`
       only bypasses this runtime's own fetch cache, not the CDN, so a read
       after the memory cache expired could be answered with a previous
       publish: a save appeared to work, then the site quietly reverted.
       `uploadedAt` changes on every overwrite, so hanging it off the URL
       makes each publish a distinct cache key and the read always current. */
    const version = blob.uploadedAt instanceof Date ? blob.uploadedAt.getTime() : Date.now();
    const res = await fetch(`${blob.url}?v=${version}`, { cache: "no-store" });
    if (!res.ok) return null;
    return mergeContent(await res.json());
  } catch {
    return null;
  }
}

async function blobWrite(content: SiteContent): Promise<void> {
  const { put } = await import("@vercel/blob");
  await put(BLOB_KEY, JSON.stringify(content, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    // The content always lands on the same key, and @vercel/blob throws on an
    // existing pathname unless told otherwise. Without this the first publish
    // of a deployment succeeds and every one after it fails.
    allowOverwrite: true,
    // Blobs default to a one-month edge cache, which is right for an image
    // under a unique name and wrong for a document rewritten in place. The
    // read above is versioned so freshness does not depend on this, but a
    // month-old copy should not be sitting at the edge either. 60s is the
    // SDK's floor.
    cacheControlMaxAge: 60,
  });
}

// ─── Local file helpers ───────────────────────────────────────────────────────

function contentPath() {
  return path.join(process.cwd(), "data", "site-content.json");
}

function localRead(): SiteContent | null {
  try {
    return mergeContent(JSON.parse(fs.readFileSync(contentPath(), "utf8")));
  } catch {
    return null;
  }
}

function localWrite(content: SiteContent): void {
  // On Vercel this path cannot succeed; say so instead of throwing EROFS.
  assertWritableStorage();
  const filePath = contentPath();
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), "utf8");
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Read the current site content. Prefers blob in production.
 */
export async function readContentAsync(): Promise<SiteContent> {
  const cached = fresh();
  if (cached) return cached;

  if (isVercel()) {
    const remote = await blobRead();
    if (remote) return remember(remote);
  }
  const local = localRead();
  if (local) return remember(local);

  return remember(mergeContent(null));
}

/**
 * Write new content and persist it. Throws if persistence fails, so the
 * caller can tell the owner their save did not stick.
 */
export async function writeContentAsync(content: SiteContent): Promise<SiteContent> {
  const next = mergeContent(content);

  if (isVercel()) {
    await blobWrite(next);
  } else {
    localWrite(next);
  }

  return remember(next);
}

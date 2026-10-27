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
 */

import { mergeContent, type SiteContent } from "./siteContent";

// ─── In-memory cache (survives within the same function instance) ───────────
let memCache: SiteContent | null = null;

const BLOB_KEY = "site-content.json";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isVercel() {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

// ─── Vercel Blob helpers (dynamic import to avoid errors locally) ────────────

async function blobRead(): Promise<SiteContent | null> {
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: BLOB_KEY });
    const blob = blobs.find((b) => b.pathname === BLOB_KEY);
    if (!blob) return null;
    const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) return null;
    return mergeContent(await res.json());
  } catch {
    return null;
  }
}

async function blobWrite(content: SiteContent): Promise<void> {
  try {
    const { put } = await import("@vercel/blob");
    await put(BLOB_KEY, JSON.stringify(content, null, 2), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    });
  } catch (err) {
    console.error("[contentStore] Blob write failed:", err);
  }
}

// ─── Local file helpers ───────────────────────────────────────────────────────

function localRead(): SiteContent | null {
  try {
    const fs = require("fs") as typeof import("fs");
    const path = require("path") as typeof import("path");
    const filePath = path.join(process.cwd(), "data", "site-content.json");
    const raw = fs.readFileSync(filePath, "utf8");
    return mergeContent(JSON.parse(raw));
  } catch {
    return null;
  }
}

function localWrite(content: SiteContent): void {
  try {
    const fs = require("fs") as typeof import("fs");
    const path = require("path") as typeof import("path");
    const filePath = path.join(process.cwd(), "data", "site-content.json");
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), "utf8");
  } catch (err) {
    console.error("[contentStore] Local write failed:", err);
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Read the current site content.
 * Returns memCache if available, otherwise reads from blob/file.
 */
export function readContent(): SiteContent {
  if (memCache) return memCache;
  // Sync fallback: local file (works in dev and for initial Vercel cold boot)
  const local = localRead();
  if (local) {
    memCache = local;
    return local;
  }
  const defaulted = mergeContent(null);
  memCache = defaulted;
  return defaulted;
}

/**
 * Async version — prefers blob in production. Use this in API routes.
 */
export async function readContentAsync(): Promise<SiteContent> {
  if (memCache) return memCache;
  if (isVercel()) {
    const remote = await blobRead();
    if (remote) {
      memCache = remote;
      return remote;
    }
  }
  const local = localRead();
  if (local) {
    memCache = local;
    return local;
  }
  const defaulted = mergeContent(null);
  memCache = defaulted;
  return defaulted;
}

/**
 * Write new content and persist it.
 */
export async function writeContentAsync(content: SiteContent): Promise<SiteContent> {
  const next = mergeContent(content);
  memCache = next;

  if (isVercel()) {
    await blobWrite(next);
  } else {
    localWrite(next);
  }
  return next;
}

/** Sync write — local only (kept for backward-compat, no-op on Vercel). */
export function writeContent(content: SiteContent): SiteContent {
  const next = mergeContent(content);
  memCache = next;
  if (!isVercel()) {
    localWrite(next);
  }
  return next;
}

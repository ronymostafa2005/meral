import { createHash, createHmac, timingSafeEqual } from "crypto";
import fs from "fs";
import path from "path";

const COOKIE = "meral_owner";

function readEnvFile() {
  const values: Record<string, string> = {};
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      values[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
    }
  } catch {
    return values;
  }
  return values;
}

function setting(name: string) {
  return process.env[name] || readEnvFile()[name] || "";
}

export function cookieName() {
  return COOKIE;
}

export function credentialsMatch(email: string, password: string) {
  const expectedEmail = setting("DASHBOARD_EMAIL").toLowerCase();
  const expectedPassword = setting("DASHBOARD_PASSWORD");
  // Keyboard layouts that swap " and @ (Arabic, French, and others) make the
  // owner type merall22"gmail.com. Treat that as the @ they meant rather than
  // failing the sign-in; a real address never contains a double quote.
  const given = email.trim().toLowerCase().replace(/"/g, "@");
  if (!expectedEmail || !expectedPassword) return false;
  return safeEqual(given, expectedEmail) && safeEqual(password, expectedPassword);
}

export function signToken(email: string) {
  const exp = Date.now() + 14 * 24 * 60 * 60 * 1000;
  const body = Buffer.from(`${email.toLowerCase()}|${exp}`).toString("base64url");
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyToken(token: string | undefined | null) {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  if (!safeEqual(sig, expected)) return null;
  const decoded = Buffer.from(body, "base64url").toString("utf8");
  const [email, exp] = decoded.split("|");
  if (!email || Number(exp) < Date.now()) return null;
  if (!safeEqual(email, setting("DASHBOARD_EMAIL").toLowerCase())) return null;
  return { email };
}

function secret() {
  return setting("DASHBOARD_SECRET") || "meral-owner-session";
}

function safeEqual(a: string, b: string) {
  const left = createHash("sha256").update(a).digest();
  const right = createHash("sha256").update(b).digest();
  return timingSafeEqual(left, right);
}

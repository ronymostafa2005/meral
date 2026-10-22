import fs from "fs";
import path from "path";
import { mergeContent, type SiteContent } from "./siteContent";

const filePath = path.join(process.cwd(), "data", "site-content.json");

let cachedContent: SiteContent | null = null;

export function readContent(): SiteContent {
  if (cachedContent) return cachedContent;
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    cachedContent = mergeContent(JSON.parse(raw));
    return cachedContent;
  } catch {
    cachedContent = mergeContent(null);
    return cachedContent;
  }
}

export function writeContent(content: SiteContent) {
  const next = mergeContent(content);
  cachedContent = next;
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(next, null, 2), "utf8");
  } catch (err) {
    console.error("Failed writing site-content.json to disk:", err);
  }
  return next;
}

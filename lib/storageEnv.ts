/**
 * storageEnv.ts
 * -------------
 * Shared guard for the two things this site writes at runtime: the content
 * JSON and uploaded images.
 *
 * Both stores pick their backend from `BLOB_READ_WRITE_TOKEN`. That works
 * locally, where its absence correctly means "write to disk", but on Vercel
 * the same absence sends the write to a filesystem that is read-only outside
 * /tmp. The result was an EROFS deep inside `fs.mkdirSync` surfacing to the
 * owner as a generic "could not store" — true, but useless.
 *
 * So: detect the one combination that can never work and fail with the reason.
 */

export class StorageConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageConfigError";
  }
}

/** True when running on Vercel, where the deployment filesystem is read-only. */
function onVercel() {
  return !!process.env.VERCEL;
}

export function blobConfigured() {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

/**
 * Throws when a runtime write is about to be attempted on Vercel with no blob
 * store attached. Call before falling back to a local write.
 */
export function assertWritableStorage() {
  if (onVercel() && !blobConfigured()) {
    throw new StorageConfigError(
      "Storage is not configured for this deployment. Create a Blob store in " +
        "the Vercel dashboard, connect it to this project so BLOB_READ_WRITE_TOKEN " +
        "is set, then redeploy.",
    );
  }
}

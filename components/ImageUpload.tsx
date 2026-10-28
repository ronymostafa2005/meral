"use client";

import { useRef, useState } from "react";
import {
  ImagePlus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
  UploadCloud,
} from "lucide-react";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/svg+xml";
const TYPES = new Set(ACCEPT.split(","));

/* Shares the console's colour grammar — see OwnerDashboard. Colours stay as
   explicit hex values so SiteProvider's brand overrides cannot recolour the
   editor's own controls. */
const microLabel = "admin-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#a9a9b4]";
const primaryButton =
  "inline-flex items-center gap-1.5 rounded-lg bg-[#c4a574] px-3.5 py-2 text-[11.5px] font-bold text-[#12100c] transition-colors hover:bg-[#d4b888] disabled:opacity-50";
const quietButton =
  "inline-flex items-center gap-1.5 rounded-lg border border-white/[0.12] bg-white/[0.03] px-3.5 py-2 text-[11.5px] text-[#dcdce2] transition-colors hover:border-white/25 hover:bg-white/[0.07] hover:text-white";
const removeButton =
  "inline-flex items-center gap-1.5 rounded-lg border border-[#e0566a]/25 bg-[#e0566a]/[0.08] px-3 py-2 text-[11.5px] text-[#e0566a] transition-colors hover:bg-[#e0566a]/20 hover:text-[#ff8795]";

export type ImageFrame = "cover" | "portrait" | "logo" | "icon";

async function uploadImageFile(file: File) {
  if (!TYPES.has(file.type)) {
    throw new Error("Use a JPG, PNG, WEBP, GIF, or SVG.");
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Image is larger than 8MB.");
  }
  const body = new FormData();
  body.append("file", file);
  const response = await fetch("/api/upload", { method: "POST", body });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.url) {
    throw new Error(typeof data?.error === "string" ? data.error : "Upload failed. Sign in again and retry.");
  }
  return data.url as string;
}

function frameClass(frame: ImageFrame) {
  if (frame === "portrait") return "h-32 w-32 rounded-full";
  if (frame === "logo" || frame === "icon") return "h-24 w-24 rounded-lg";
  return "h-36 w-full max-w-xs rounded-lg sm:h-40";
}

function fitClass(frame: ImageFrame) {
  return frame === "cover" || frame === "portrait" ? "object-cover" : "object-contain p-3";
}

/**
 * The single most useful line on an image field.
 *
 * Every picture in this console lands somewhere specific on the live site, and
 * an owner cannot tell which from a label like "Project gallery". Naming the
 * destination in plain words — and only destinations that actually render —
 * turns a guess into a decision.
 */
function WhereChip({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-lg border border-[#c4a574]/20 bg-[#c4a574]/[0.06] px-3 py-2 text-[11.5px] leading-5 text-[#d8bf96]">
      <Eye className="mt-[1px] h-3.5 w-3.5 shrink-0" />
      <span>
        <span className="admin-mono text-[9.5px] uppercase tracking-[0.14em] text-[#c4a574]">
          Where it appears
        </span>
        <br />
        {children}
      </span>
    </p>
  );
}

function Notice({ message, failed }: { message: string; failed: boolean }) {
  if (!message) return null;
  return (
    <p className={`text-[11.5px] leading-5 ${failed ? "text-[#f08a97]" : "text-[#7ae0b8]"}`}>
      {message}
    </p>
  );
}

export function ImageField({
  label,
  hint,
  where,
  value,
  onChange,
  frame = "cover",
}: {
  label: string;
  hint: string;
  /** Plain-words description of where this image shows up on the live site. */
  where?: string;
  value: string;
  onChange: (value: string) => void;
  frame?: ImageFrame;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);

  const take = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setFailed(false);
    setMessage("Uploading…");
    try {
      onChange(await uploadImageFile(file));
      setMessage("Uploaded. Press Publish to put it on the site.");
    } catch (error) {
      setFailed(true);
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3 rounded-lg border border-white/[0.08] bg-[#0d0d12] p-4">
      <div>
        <span className={microLabel}>{label}</span>
        <p className="mt-1.5 text-[11.5px] leading-5 text-[#9a9aa6]">{hint}</p>
      </div>

      {where && <WhereChip>{where}</WhereChip>}

      <div
        className={`flex gap-4 ${
          frame === "cover" ? "flex-col sm:flex-row sm:items-center" : "flex-row items-center"
        }`}
      >
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDrag(false);
            void take(event.dataTransfer.files?.[0]);
          }}
          className={`checker relative grid shrink-0 place-items-center overflow-hidden border border-dashed transition-colors ${frameClass(
            frame,
          )} ${drag ? "border-[#c4a574] bg-[#c4a574]/10" : "border-white/25 hover:border-[#c4a574]/50"}`}
        >
          {value ? (
            <img src={value} alt="" className={`h-full w-full ${fitClass(frame)}`} />
          ) : (
            <span className="flex flex-col items-center gap-1.5 px-3 text-center text-[#c0c0c9]">
              <ImagePlus className="h-5 w-5" />
              <span className="text-[11px] font-medium">
                {frame === "cover" ? "Choose image" : "Choose"}
              </span>
              <span className="text-[10px] leading-4 text-[#8c8c99]">
                {frame === "cover" ? "or drop it here" : "or drop"}
              </span>
            </span>
          )}
          {busy && (
            <span className="absolute inset-0 grid place-items-center bg-black/75">
              <Loader2 className="h-5 w-5 animate-spin text-[#c4a574]" />
            </span>
          )}
        </button>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className={value ? quietButton : primaryButton}
            >
              <ImagePlus className="h-3.5 w-3.5" />
              {value ? "Replace image" : "Choose image"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setMessage("Cleared. Press Publish to remove it from the site.");
                  setFailed(false);
                }}
                className={removeButton}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            )}
          </div>
          <p className="text-[11px] leading-5 text-[#8c8c99]">
            Drag a file onto the preview, or choose one from your computer. JPG, PNG, WEBP, GIF or
            SVG, up to 8MB.
          </p>
          {value && (
            <p className="admin-mono truncate text-[10px] text-[#7e7e8a]" dir="ltr">
              {value}
            </p>
          )}
          <Notice message={message} failed={failed} />
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(event) => void take(event.target.files?.[0])}
      />
    </div>
  );
}

export function ImageGallery({
  label,
  hint,
  where,
  values,
  onChange,
  /** Labels the first tile, for galleries whose first image leads. */
  firstIsCover = false,
}: {
  label: string;
  hint: string;
  where?: string;
  values: string[];
  onChange: (values: string[]) => void;
  firstIsCover?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const images = values.filter(Boolean);

  const addFiles = async (list: FileList | File[] | undefined) => {
    const files = Array.from(list || []);
    if (!files.length) return;
    setBusy(true);
    setFailed(false);
    const uploaded: string[] = [];
    const errors: string[] = [];
    for (const [index, file] of files.entries()) {
      setMessage(`Uploading ${index + 1} of ${files.length}…`);
      try {
        uploaded.push(await uploadImageFile(file));
      } catch (error) {
        errors.push(error instanceof Error ? error.message : "Could not upload an image.");
      }
    }
    if (uploaded.length) onChange([...images, ...uploaded]);
    setFailed(errors.length > 0);
    setMessage(
      errors[0] ||
        `Added ${uploaded.length} image${uploaded.length === 1 ? "" : "s"}. Press Publish to show ${
          uploaded.length === 1 ? "it" : "them"
        } on the site.`,
    );
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const move = (index: number, direction: -1 | 1) => {
    const next = index + direction;
    if (next < 0 || next >= images.length) return;
    const copy = [...images];
    const [item] = copy.splice(index, 1);
    copy.splice(next, 0, item);
    onChange(copy);
  };

  const dropProps = {
    onDragOver: (event: React.DragEvent) => {
      event.preventDefault();
      setDrag(true);
    },
    onDragLeave: () => setDrag(false),
    onDrop: (event: React.DragEvent) => {
      event.preventDefault();
      setDrag(false);
      void addFiles(event.dataTransfer.files);
    },
  };

  return (
    <div className="space-y-3 rounded-lg border border-white/[0.08] bg-[#0d0d12] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <span className={microLabel}>{label}</span>
          <p className="mt-1.5 text-[11.5px] leading-5 text-[#9a9aa6]">{hint}</p>
        </div>
        <span className="admin-mono shrink-0 rounded-full border border-white/[0.1] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[#a9a9b4]">
          {images.length} {images.length === 1 ? "image" : "images"}
        </span>
      </div>

      {where && <WhereChip>{where}</WhereChip>}

      {images.length === 0 ? (
        /* An empty grid of one small tile reads as broken. A full-width target
           with the instruction written out reads as an invitation. */
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          {...dropProps}
          className={`flex w-full flex-col items-center gap-2 rounded-lg border border-dashed px-6 py-10 text-center transition-colors ${
            drag
              ? "border-[#c4a574] bg-[#c4a574]/10"
              : "border-white/[0.18] bg-white/[0.015] hover:border-[#c4a574]/45 hover:bg-[#c4a574]/[0.05]"
          }`}
        >
          {busy ? (
            <Loader2 className="h-6 w-6 animate-spin text-[#c4a574]" />
          ) : (
            <UploadCloud className="h-6 w-6 text-[#c4a574]" />
          )}
          <span className="text-[13px] font-semibold text-white">
            {busy ? "Uploading…" : "Add your first image"}
          </span>
          <span className="max-w-xs text-[11.5px] leading-5 text-[#9a9aa6]">
            Drag files anywhere onto this box, or click to browse. You can select several at once.
          </span>
          <span className="admin-mono mt-1 text-[9.5px] uppercase tracking-[0.14em] text-[#8c8c99]">
            JPG · PNG · WEBP · GIF · SVG · up to 8MB
          </span>
        </button>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((src, index) => (
              <figure
                key={`${src}-${index}`}
                className="group relative overflow-hidden rounded-lg border border-white/[0.1] bg-black"
              >
                <img src={src} alt="" className="aspect-[4/5] w-full object-cover" />

                <span className="absolute left-2 top-2 flex items-center gap-1.5">
                  <span className="admin-mono rounded-md bg-black/75 px-1.5 py-0.5 text-[10px] tabular-nums text-white backdrop-blur-sm">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {firstIsCover && index === 0 && (
                    <span className="admin-mono rounded-md bg-[#c4a574] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#12100c]">
                      Cover
                    </span>
                  )}
                </span>

                {/* Controls stay visible: hover-only actions are invisible on a
                    touchscreen and undiscoverable for anyone not hunting. */}
                <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black via-black/85 to-transparent p-2">
                  <span className="flex gap-1">
                    <button
                      type="button"
                      aria-label="Move earlier"
                      title="Move earlier"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      className="grid h-7 w-7 place-items-center rounded-md bg-white/20 text-white transition-colors hover:bg-white/35 disabled:opacity-25"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Move later"
                      title="Move later"
                      onClick={() => move(index, 1)}
                      disabled={index === images.length - 1}
                      className="grid h-7 w-7 place-items-center rounded-md bg-white/20 text-white transition-colors hover:bg-white/35 disabled:opacity-25"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </span>
                  <button
                    type="button"
                    aria-label="Remove image"
                    title="Remove image"
                    onClick={() => onChange(images.filter((_, item) => item !== index))}
                    className="grid h-7 w-7 place-items-center rounded-md bg-[#e0566a] text-white transition-colors hover:bg-[#ef6c7c]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </figcaption>
              </figure>
            ))}

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              {...dropProps}
              className={`grid aspect-[4/5] place-items-center rounded-lg border border-dashed px-4 text-center transition-colors ${
                drag
                  ? "border-[#c4a574] bg-[#c4a574]/10"
                  : "border-white/[0.18] bg-white/[0.015] hover:border-[#c4a574]/45 hover:bg-[#c4a574]/[0.05]"
              }`}
            >
              <span className="flex flex-col items-center gap-2 text-[11.5px] text-[#c0c0c9]">
                {busy ? (
                  <Loader2 className="h-5 w-5 animate-spin text-[#c4a574]" />
                ) : (
                  <ImagePlus className="h-5 w-5 text-[#c4a574]" />
                )}
                <span className="font-semibold text-white">{busy ? "Uploading…" : "Add more"}</span>
                <span className="text-[10.5px] leading-4 text-[#8c8c99]">
                  Click or drop files here
                </span>
              </span>
            </button>
          </div>

          <p className="admin-mono text-[9.5px] uppercase tracking-[0.14em] text-[#8c8c99]">
            Arrows reorder · bin removes · {firstIsCover ? "image 01 is the cover" : "order is the order visitors see"}
          </p>
        </>
      )}

      <Notice message={message} failed={failed} />

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        className="hidden"
        onChange={(event) => void addFiles(event.target.files || undefined)}
      />
    </div>
  );
}

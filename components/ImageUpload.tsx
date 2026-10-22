"use client";

import { useRef, useState } from "react";
import { ImagePlus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/svg+xml";
const TYPES = new Set(ACCEPT.split(","));

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
  if (frame === "portrait") return "h-36 w-36 rounded-full";
  if (frame === "logo" || frame === "icon") return "h-28 w-28 rounded-2xl";
  return "h-40 w-full max-w-sm rounded-2xl sm:h-48";
}

function fitClass(frame: ImageFrame) {
  return frame === "cover" || frame === "portrait" ? "object-cover" : "object-contain p-3";
}

export function ImageField({
  label,
  hint,
  value,
  onChange,
  frame = "cover",
}: {
  label: string;
  hint: string;
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
      setMessage("Uploaded. Save changes to publish it on the site.");
    } catch (error) {
      setFailed(true);
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="mb-3">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="mt-1 text-xs leading-5 text-neutral-500">{hint}</p>
      </div>
      <div className={`flex gap-4 ${frame === "cover" ? "flex-col sm:flex-row sm:items-center" : "flex-row items-center"}`}>
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
          className={`checker relative grid shrink-0 place-items-center overflow-hidden border border-dashed transition ${frameClass(frame)} ${
            drag ? "border-white bg-white/10" : "border-white/20"
          }`}
        >
          {value ? (
            <img src={value} alt="" className={`h-full w-full ${fitClass(frame)}`} />
          ) : (
            <span className="flex flex-col items-center gap-1.5 px-3 text-center text-neutral-300">
              <ImagePlus className="h-5 w-5" />
              <span className="text-[11px] font-medium">{frame === "cover" ? "Choose image" : "Choose"}</span>
              <span className="text-[10px] leading-4 text-neutral-500">{frame === "cover" ? "or drop it here" : "or drop"}</span>
            </span>
          )}
          {busy && <span className="absolute inset-0 grid place-items-center bg-black/70 text-xs">Uploading</span>}
        </button>
        <div className="min-w-0 flex-1 space-y-3">
          <p className="text-xs leading-5 text-neutral-400">Drop an image on the preview, or choose one from your computer. JPG, PNG, WEBP, GIF, or SVG, up to 8MB.</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => inputRef.current?.click()} className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black">
              {value ? "Replace image" : "Choose image"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setMessage("Removed from this slot. Save changes to publish.");
                  setFailed(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs text-neutral-200"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            )}
          </div>
          {value && <p className="truncate font-mono text-[10px] text-neutral-600" dir="ltr">{value}</p>}
          {message && <p className={`text-xs ${failed ? "text-red-400" : "text-neutral-300"}`}>{message}</p>}
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
  values,
  onChange,
}: {
  label: string;
  hint: string;
  values: string[];
  onChange: (values: string[]) => void;
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
    setMessage(errors[0] || `Added ${uploaded.length} image${uploaded.length === 1 ? "" : "s"}. Save changes to publish.`);
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

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          <p className="mt-1 text-xs leading-5 text-neutral-500">{hint}</p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">{images.length} images</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((src, index) => (
          <figure key={`${src}-${index}`} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black">
            <img src={src} alt="" className="aspect-[4/5] w-full object-cover" />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black via-black/75 to-transparent p-2">
              <span className="font-mono text-[10px] text-white/80">{String(index + 1).padStart(2, "0")}</span>
              <span className="flex gap-1">
                <button type="button" aria-label="Move earlier" onClick={() => move(index, -1)} className="grid h-7 w-7 place-items-center rounded-full bg-white/15">
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <button type="button" aria-label="Move later" onClick={() => move(index, 1)} className="grid h-7 w-7 place-items-center rounded-full bg-white/15">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => onChange(images.filter((_, item) => item !== index))}
                  className="grid h-7 w-7 place-items-center rounded-full bg-white text-black"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </span>
            </figcaption>
          </figure>
        ))}
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
            void addFiles(event.dataTransfer.files);
          }}
          className={`grid aspect-[4/5] place-items-center rounded-2xl border border-dashed px-4 text-center transition ${
            drag ? "border-white bg-white/10" : "border-white/20 bg-white/[0.02]"
          }`}
        >
          <span className="flex flex-col items-center gap-2 text-xs text-neutral-300">
            <ImagePlus className="h-5 w-5" />
            {busy ? "Uploading…" : "Add images"}
            <span className="text-[11px] leading-5 text-neutral-500">Drop one or more, or click to choose</span>
          </span>
        </button>
      </div>
      {message && <p className={`mt-3 text-xs ${failed ? "text-red-400" : "text-neutral-300"}`}>{message}</p>}
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

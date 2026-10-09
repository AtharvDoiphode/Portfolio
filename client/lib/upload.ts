import { api } from "./admin-api";

export type MediaKind = "image" | "video";
const LIMIT_MB: Record<MediaKind, number> = { image: 10, video: 100 };

/** Uploads straight from the browser to Cloudinary using a short-lived signature from our API. Returns the public URL. */
export async function uploadMedia(file: File, kind: MediaKind, onProgress: (pct: number) => void): Promise<string> {
  if (!file.type.startsWith(`${kind}/`)) throw new Error(kind === "image" ? "Please choose an image (JPG, PNG or WebP)." : "Please choose a video file (MP4 or MOV).");
  if (file.size > LIMIT_MB[kind] * 1024 * 1024) throw new Error(`That file is over ${LIMIT_MB[kind]} MB. Please use a smaller one.`);

  const sig = await api<{ cloudName: string; apiKey: string; timestamp: number; folder: string; signature: string }>("POST", "/api/admin/uploads/sign", {});
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.apiKey);
  form.append("timestamp", String(sig.timestamp));
  form.append("folder", sig.folder);
  form.append("signature", sig.signature);

  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${sig.cloudName}/${kind}/upload`);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onerror = () => reject(new Error("Upload failed. Check your connection and try again."));
    xhr.onload = () => {
      try {
        const res = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && res.secure_url) resolve(res.secure_url);
        else reject(new Error(res?.error?.message || "Cloudinary rejected the upload."));
      } catch {
        reject(new Error("Unexpected response from Cloudinary."));
      }
    };
    xhr.send(form);
  });
}

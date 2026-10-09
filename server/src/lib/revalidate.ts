import { env } from "../env.js";

/**
 * Tells the Next.js site to rebuild its cached pages after an admin edit.
 * Best-effort: failure never blocks the admin's save.
 */
export async function revalidateSite(): Promise<void> {
  if (!env.REVALIDATE_SECRET) return;
  try {
    await fetch(`${env.FRONTEND_URL}/internal/revalidate`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-revalidate-secret": env.REVALIDATE_SECRET },
      body: JSON.stringify({ paths: ["/"] }),
      signal: AbortSignal.timeout(8000),
    });
  } catch (err) {
    console.warn("revalidate failed:", (err as Error).message);
  }
}

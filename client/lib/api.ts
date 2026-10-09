export interface QuotePayload {
  name: string;
  email: string;
  needs: string[];
  budget?: string;
  timeline?: string;
  message: string;
  website?: string; // honeypot, left empty by real visitors
}

export class QuoteError extends Error {
  constructor(message: string, public kind: "validation" | "limit" | "network" | "server") {
    super(message);
  }
}

/** POST /api/contact (proxied to the Render API). Waits up to 50s because a sleeping free-tier server takes ~30s to wake. */
export async function submitQuote(payload: QuotePayload): Promise<void> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 50_000);
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    if (res.ok) return;
    const body = await res.json().catch(() => ({}));
    if (res.status === 400) throw new QuoteError(Object.values(body.fields ?? {})[0] as string || "Please check the form.", "validation");
    if (res.status === 429) throw new QuoteError(body.error || "Too many messages. Please try again later.", "limit");
    throw new QuoteError("The server had a problem.", "server");
  } catch (e) {
    if (e instanceof QuoteError) throw e;
    throw new QuoteError("Couldn't reach the server.", "network");
  } finally {
    clearTimeout(timer);
  }
}

/** Fire-and-forget: wakes the API while the visitor is still filling in the form. */
export function warmApi() {
  fetch("/api/ping", { cache: "no-store" }).catch(() => {});
}

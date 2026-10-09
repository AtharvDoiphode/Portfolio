import { env } from "../env.js";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

interface Quote { name: string; email: string; subject?: string; needs: string[]; budget?: string; timeline?: string; body: string }

/**
 * Emails a new enquiry to the owner through Resend's HTTP API
 * (Render's free tier blocks SMTP, so we use HTTPS). Returns false if not configured or it failed.
 */
export async function sendQuoteEmail(q: Quote): Promise<boolean> {
  if (!env.RESEND_API_KEY) return false;
  const to = env.CONTACT_TO_EMAIL || env.ADMIN_EMAIL;
  const rows = [
    ["From", `${q.name} <${q.email}>`],
    ["Needs", q.needs.join(", ") || "-"],
    ["Budget", q.budget || "-"],
    ["Timeline", q.timeline || "-"],
  ];
  const html = `<div style="font-family:system-ui,sans-serif;max-width:560px">
<h2 style="margin:0 0 12px">New enquiry from your portfolio</h2>
<table style="border-collapse:collapse;margin-bottom:16px">${rows
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td>${esc(v)}</td></tr>`)
    .join("")}</table>
<p style="white-space:pre-wrap;border-left:3px solid #ccc;padding-left:12px">${esc(q.body)}</p></div>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: env.MAIL_FROM,
        to: [to],
        reply_to: q.email,
        subject: `New enquiry: ${q.subject || q.needs[0] || "Portfolio"} (${q.name})`,
        html,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) console.warn("Resend error:", res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.warn("mail failed:", (err as Error).message);
    return false;
  }
}

import { env } from "../env.js";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const wrap = (inner: string) => `<div style="font-family:system-ui,sans-serif;max-width:560px;color:#14112B">${inner}</div>`;
const button = (href: string, label: string, primary = false) =>
  `<a href="${esc(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:10px 18px;border-radius:999px;text-decoration:none;font-size:14px;${
    primary ? "background:#3B4BFF;color:#fff" : "border:1.5px solid #14112B;color:#14112B"
  }">${esc(label)}</a>`;

export const mailConfigured = () => Boolean(env.RESEND_API_KEY);

export type SendResult = { ok: true } | { ok: false; error: string };

/**
 * Sends one email through Resend's HTTP API (Render's free tier blocks SMTP, so we use HTTPS).
 * Never throws: callers decide whether a failed email matters.
 */
async function send(mail: { to: string; subject: string; html: string; replyTo?: string }): Promise<SendResult> {
  if (!env.RESEND_API_KEY) return { ok: false, error: "Email isn't set up yet: add RESEND_API_KEY to the server's .env." };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({ from: env.MAIL_FROM, to: [mail.to], reply_to: mail.replyTo, subject: mail.subject, html: mail.html }),
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) return { ok: true };
    const text = await res.text();
    console.warn("Resend error:", res.status, text);
    // Resend's shared test sender (onboarding@resend.dev) only delivers to the account owner's own address.
    if (res.status === 403 && /own email|verify a domain|testing emails/i.test(text)) {
      return { ok: false, error: "Resend can only email your own address until you verify a domain in Resend. Use \"Reply in Gmail\" for now." };
    }
    return { ok: false, error: `The email service refused the message (${res.status}).` };
  } catch (err) {
    console.warn("mail failed:", (err as Error).message);
    return { ok: false, error: "Couldn't reach the email service. Try again in a minute." };
  }
}

interface Quote { id: string; name: string; email: string; subject?: string; needs: string[]; budget?: string; timeline?: string; body: string }

/** Emails a new enquiry to the owner. Reply-To is the visitor, so hitting Reply in Gmail answers them directly. */
export async function sendQuoteEmail(q: Quote): Promise<boolean> {
  const to = env.CONTACT_TO_EMAIL || env.ADMIN_EMAIL;
  const subject = q.subject || q.needs[0] || "Portfolio";
  const rows = [
    ["From", `${q.name} <${q.email}>`],
    ["Needs", q.needs.join(", ") || "-"],
    ["Budget", q.budget || "-"],
    ["Timeline", q.timeline || "-"],
  ];
  const reply = `mailto:${q.email}?subject=${encodeURIComponent(`Re: ${subject}`)}`;
  const admin = `${env.FRONTEND_URL.replace(/\/$/, "")}/admin/messages?open=${q.id}`;
  const html = wrap(`<h2 style="margin:0 0 12px">New enquiry from your portfolio</h2>
<table style="border-collapse:collapse;margin-bottom:16px">${rows
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td>${esc(v)}</td></tr>`)
    .join("")}</table>
<p style="white-space:pre-wrap;border-left:3px solid #ccc;padding-left:12px;margin:0 0 20px">${esc(q.body)}</p>
${button(reply, `Reply to ${q.name}`, true)}${button(admin, "Open in admin")}
<p style="color:#888;font-size:12px;margin-top:12px">Or just hit Reply: it goes straight to ${esc(q.email)}.</p>`);
  const r = await send({ to, subject: `New enquiry: ${subject} (${q.name})`, html, replyTo: q.email });
  return r.ok;
}

/** Sends the owner's reply to a visitor. Reply-To is the owner, so their answer lands in the owner's inbox. */
export function sendReplyEmail(m: { name: string; email: string; subject: string; body: string; createdAt: Date }, reply: string): Promise<SendResult> {
  const subject = `Re: ${m.subject || "Your enquiry"}`;
  const when = m.createdAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });
  const html = wrap(`<p style="white-space:pre-wrap;font-size:15px;line-height:1.6;margin:0 0 24px">${esc(reply)}</p>
<p style="color:#888;font-size:12px;margin:0 0 6px">On ${esc(when)}, ${esc(m.name)} wrote:</p>
<p style="white-space:pre-wrap;color:#666;border-left:3px solid #ddd;padding-left:12px;margin:0">${esc(m.body)}</p>`);
  return send({ to: m.email, subject, html, replyTo: env.CONTACT_TO_EMAIL || env.ADMIN_EMAIL });
}

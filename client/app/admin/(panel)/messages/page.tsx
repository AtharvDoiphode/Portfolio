"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ago, api, type AdminMessage } from "@/lib/admin-api";
import { Button, Card, inputCls, PageHead, Status } from "@/components/admin/ui";
import { useAdmin } from "@/components/admin/AdminShell";

const fmt = (iso: string) => new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
const replySubject = (m: AdminMessage) => `Re: ${m.subject || "Your enquiry"}`;
const quoted = (m: AdminMessage) => `\n\n\nOn ${fmt(m.createdAt)}, ${m.name} wrote:\n${m.body.split("\n").map((l) => `> ${l}`).join("\n")}`;

/** Opens Gmail's compose window, signed in as the admin, with the reply already addressed and the enquiry quoted. */
const gmailLink = (m: AdminMessage, as: string) =>
  `https://mail.google.com/mail/?authuser=${encodeURIComponent(as)}&view=cm&fs=1&to=${encodeURIComponent(m.email)}&su=${encodeURIComponent(replySubject(m))}&body=${encodeURIComponent(quoted(m))}`;

function Inbox() {
  const { email: adminEmail, refresh } = useAdmin();
  const params = useSearchParams();
  const [archived, setArchived] = useState(false);
  const [list, setList] = useState<AdminMessage[] | null>(null);
  const [sel, setSel] = useState<string | null>(params.get("open"));
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [mailOn, setMailOn] = useState<boolean | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => { api<{ configured: boolean }>("GET", "/api/admin/mail").then((r) => setMailOn(r.configured)).catch(() => setMailOn(false)); }, []);

  const load = useCallback(() => {
    setList(null);
    api<AdminMessage[]>("GET", `/api/admin/messages?archived=${archived ? 1 : 0}`).then(setList).catch((e) => setError(e.message));
  }, [archived]);
  useEffect(load, [load]);

  const cur = list?.find((m) => m.id === sel) ?? null;
  const unread = list?.filter((m) => !m.read).length ?? 0;

  async function patch(m: AdminMessage, p: Partial<Pick<AdminMessage, "read" | "archived">>) {
    try {
      const u = await api<AdminMessage>("PATCH", `/api/admin/messages/${m.id}`, p);
      setList((cur) => (p.archived !== undefined ? cur?.filter((x) => x.id !== m.id) ?? null : cur?.map((x) => (x.id === m.id ? u : x)) ?? null));
      if (p.archived !== undefined) setSel(null);
      refresh();
    } catch (e) { setError((e as Error).message); }
  }
  async function sendReply(m: AdminMessage) {
    setSending(true); setError(""); setSent(false);
    try {
      const u = await api<AdminMessage>("POST", `/api/admin/messages/${m.id}/reply`, { body: draft });
      setList((c) => c?.map((x) => (x.id === m.id ? u : x)) ?? null);
      setDraft(""); setSent(true); refresh();
    } catch (e) { setError((e as Error).message); }
    finally { setSending(false); }
  }
  async function open(m: AdminMessage) {
    setSel(m.id); setConfirmDelete(false); setDraft(""); setSent(false);
    if (!m.read) patch(m, { read: true });
  }
  async function remove(m: AdminMessage) {
    if (!confirmDelete) return setConfirmDelete(true);
    try {
      await api("DELETE", `/api/admin/messages/${m.id}`);
      setList((c) => c?.filter((x) => x.id !== m.id) ?? null);
      setSel(null); setConfirmDelete(false); refresh();
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <div className="flex max-w-[1200px] flex-col gap-5">
      <PageHead kicker={`${archived ? "ARCHIVE" : "INBOX"} · ${unread} UNREAD`} title="Messages">
        <Button onClick={() => { setArchived(!archived); setSel(null); }}>{archived ? "← Back to inbox" : "View archive"}</Button>
      </PageHead>
      {error && <Status kind="error">{error}</Status>}
      <div className="grid items-start gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))]">
        <Card className="overflow-hidden">
          {list === null && <div className="p-5 text-sm text-[#5A5375]">Loading…</div>}
          {list?.length === 0 && <div className="p-5 text-sm text-[#5A5375]">{archived ? "Nothing archived." : "No messages yet. Enquiries from your contact form land here."}</div>}
          {list?.map((m) => (
            <button key={m.id} type="button" onClick={() => open(m)} aria-current={sel === m.id}
              className={`flex w-full items-start gap-3 border-0 border-b border-[#F5EEF2] px-4 py-3.5 text-left hover:bg-[#FBF7F9] ${sel === m.id ? "bg-[#F3ECF0]" : "bg-white"}`}>
              <span className="mt-1.5 size-2 flex-none rounded-full" style={{ background: m.read ? "transparent" : "#3B4BFF" }} />
              <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                <span className="flex justify-between gap-2">
                  <span className={`text-sm ${m.read ? "" : "font-semibold"}`}>
                    {m.name}
                    {!!m.replies?.length && <span className="ml-2 rounded-full bg-[oklch(0.92_0.06_150)] px-2 py-0.5 font-mono text-[10px] font-normal">replied</span>}
                  </span>
                  <span className="font-mono text-[11px] text-[#5A5375]">{ago(m.createdAt)}</span>
                </span>
                <span className={`text-[13px] ${m.read ? "" : "font-semibold"}`}>{m.subject || "Enquiry"}</span>
                <span className="truncate text-[13px] text-[#5A5375]">{m.body}</span>
              </span>
            </button>
          ))}
        </Card>
        <Card className="flex min-h-[420px] flex-col gap-4 p-6">
          {!cur && <p className="m-0 text-sm text-[#5A5375]">Select a message to read it.</p>}
          {cur && (
            <>
              <div className="flex flex-wrap gap-1.5">{cur.needs.map((n) => <span key={n} className="rounded-full bg-blush px-2.5 py-[5px] text-xs">{n}</span>)}</div>
              <h2 className="m-0 font-display text-[28px] font-extrabold tracking-[-0.02em]">{cur.subject || "Enquiry"}</h2>
              <div className="text-[13px] text-[#5A5375]">{cur.name} · <a href={`mailto:${cur.email}`} className="text-ultra">{cur.email}</a> · {fmt(cur.createdAt)}</div>
              <p className="m-0 whitespace-pre-wrap text-[15px] leading-[1.6] text-ink-2">{cur.body}</p>
              <div className="flex flex-wrap gap-3 text-[13px]">
                <span className="rounded-[10px] bg-[#F6F1F4] px-3 py-2">Budget: {cur.budget || "Not given"}</span>
                <span className="rounded-[10px] bg-[#F6F1F4] px-3 py-2">Timeline: {cur.timeline || "Not given"}</span>
              </div>
              {/* replies already sent from here */}
              {!!cur.replies?.length && (
                <div className="flex flex-col gap-2.5 border-t border-[#F5EEF2] pt-4">
                  {cur.replies.map((r) => (
                    <div key={r.sentAt} className="rounded-[14px] bg-[#EEF0FF] px-4 py-3">
                      <div className="mb-1 font-mono text-[11px] text-[#5A5375]">You replied · {fmt(r.sentAt)}</div>
                      <p className="m-0 whitespace-pre-wrap text-sm leading-[1.55]">{r.body}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* reply box: sends through the server's email service and keeps a copy here */}
              <div className="flex flex-col gap-2.5 border-t border-[#F5EEF2] pt-4">
                <label htmlFor="reply" className="text-[13px] font-medium">Reply to {cur.name}</label>
                <textarea
                  id="reply"
                  rows={5}
                  value={draft}
                  onChange={(e) => { setDraft(e.target.value); setSent(false); }}
                  placeholder={mailOn === false ? "Email isn't set up on the server yet. Use “Reply in Gmail” below." : `Hi ${cur.name.split(" ")[0]}, thanks for getting in touch…`}
                  disabled={mailOn === false}
                  className={`${inputCls} resize-y py-3 leading-normal`}
                />
                {sent && <Status>Reply sent to {cur.email}.</Status>}
                <div className="flex flex-wrap items-center gap-2.5">
                  <Button variant="primary" disabled={!draft.trim() || sending || mailOn === false} onClick={() => sendReply(cur)}>
                    {sending ? "Sending…" : "Send reply"}
                  </Button>
                  <a href={gmailLink(cur, adminEmail)} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center rounded-full border-[1.5px] border-[#DCCFD8] bg-white px-[18px] text-sm hover:border-navy">
                    Reply in Gmail ↗
                  </a>
                  <a href={`mailto:${cur.email}?subject=${encodeURIComponent(replySubject(cur))}`} className="text-[13px] text-[#5A5375] underline">other mail app</a>
                </div>
              </div>

              <div className="mt-auto flex flex-wrap gap-2.5 pt-2">
                <Button onClick={() => patch(cur, { read: false })}>Mark unread</Button>
                <Button onClick={() => patch(cur, { archived: !cur.archived })}>{cur.archived ? "Move to inbox" : "Archive"}</Button>
                <Button variant="danger" onClick={() => remove(cur)}>{confirmDelete ? "Click again to delete" : "Delete"}</Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return <Suspense fallback={<p className="font-mono text-sm text-[#5A5375]">Loading…</p>}><Inbox /></Suspense>;
}

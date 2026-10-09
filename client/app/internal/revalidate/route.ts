import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/** Called by the API after every admin save, so edits show up on the site within seconds. */
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || req.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  revalidateTag("site");
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}

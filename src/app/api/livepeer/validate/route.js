import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });

    const isUrl = /^https?:\/\//i.test(id);
    const hls = isUrl ? id : `https://livepeercdn.com/hls/${id}/index.m3u8`;

    // Do a HEAD request to check availability (no-store to avoid cache)
    const res = await fetch(hls, { method: "HEAD", cache: "no-store" });
    const ok = res.ok && (res.headers.get("content-type")?.includes("application")) !== false;
    return NextResponse.json({ ok, url: hls, status: res.status });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e?.message || "Unknown error" }, { status: 500 });
  }
}



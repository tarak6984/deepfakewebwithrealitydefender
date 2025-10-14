import { NextResponse } from "next/server";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params || { id: '' };

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const apiKey = process.env.RD_API_KEY || process.env.NEXT_PUBLIC_RD_API_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_RD_API_URL || "https://api.prd.realitydefender.xyz";

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const upstream = await fetch(`${baseUrl}/api/media/users/${id}`, {
      method: "GET",
      headers: {
        "X-API-KEY": apiKey,
      },
      cache: "no-store",
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Upstream error", status: upstream.status, response: data },
        { status: upstream.status }
      );
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unexpected error" }, { status: 500 });
  }
}
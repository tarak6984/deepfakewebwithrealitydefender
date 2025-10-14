import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { fileName } = await req.json();

    if (!fileName || typeof fileName !== "string") {
      return NextResponse.json({ error: "Invalid fileName" }, { status: 400 });
    }

    const apiKey = process.env.RD_API_KEY || process.env.NEXT_PUBLIC_RD_API_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_RD_API_URL || "https://api.prd.realitydefender.xyz";

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const upstream = await fetch(`${baseUrl}/api/files/aws-presigned`, {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileName }),
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
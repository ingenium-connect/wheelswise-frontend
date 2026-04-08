import { NextRequest, NextResponse } from "next/server";

/**
 * Proxies a remote PDF (or image) so it can be embedded in an iframe/object
 * without running into CORS or X-Frame-Options restrictions set by the origin
 * host (e.g. S3, CloudFront).
 *
 * Usage: /api/pdf-proxy?url=<encoded remote url>
 */
export async function HEAD(request: NextRequest) {
  const remoteUrl = request.nextUrl.searchParams.get("url");
  if (!remoteUrl) return new NextResponse(null, { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(remoteUrl);
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return new NextResponse(null, { status: 400 });
  }

  try {
    const upstream = await fetch(parsed.toString(), {
      method: "HEAD",
      cache: "no-store",
    });
    return new NextResponse(null, {
      status: upstream.ok ? 200 : 502,
      headers: {
        "Content-Type":
          upstream.headers.get("content-type") || "application/octet-stream",
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}

export async function GET(request: NextRequest) {
  const remoteUrl = request.nextUrl.searchParams.get("url");

  if (!remoteUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(remoteUrl);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  // Only allow http(s) schemes to avoid SSRF shenanigans.
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return NextResponse.json({ error: "Unsupported protocol" }, { status: 400 });
  }

  try {
    const upstream = await fetch(parsed.toString(), {
      // Don't forward cookies from the caller
      headers: { Accept: "application/pdf,image/*,*/*" },
      cache: "no-store",
    });

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json(
        { error: `Upstream returned ${upstream.status}` },
        { status: 502 },
      );
    }

    const contentType =
      upstream.headers.get("content-type") || "application/pdf";

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Force inline so browsers embed rather than download
        "Content-Disposition": "inline",
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to fetch remote file",
      },
      { status: 502 },
    );
  }
}

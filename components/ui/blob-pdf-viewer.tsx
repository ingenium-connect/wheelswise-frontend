"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

/**
 * Fetches a PDF through the proxy as a blob and renders it in an <iframe>
 * using a same-origin blob: URL. This completely bypasses X-Frame-Options
 * and CSP restrictions that block embedding remote PDFs.
 */
export function BlobPdfViewer({
  src,
  title,
  className = "w-full h-[70vh] rounded-lg border",
}: {
  src: string;
  title: string;
  className?: string;
}) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let revoke: string | null = null;
    let cancelled = false;

    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        // Force the blob type to application/pdf so the browser uses its
        // built-in PDF viewer rather than downloading the file.
        const pdfBlob = new Blob([blob], { type: "application/pdf" });
        const url = URL.createObjectURL(pdfBlob);
        revoke = url;
        setBlobUrl(url);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
      if (revoke) URL.revokeObjectURL(revoke);
    };
  }, [src]);

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 bg-muted/30 ${className}`}>
        <p className="text-sm text-muted-foreground">
          Unable to preview this document.
        </p>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-[#397397] underline underline-offset-2 hover:text-[#2a5670]"
        >
          Open in new tab
        </a>
      </div>
    );
  }

  if (!blobUrl) {
    return (
      <div className={`flex items-center justify-center bg-muted/30 ${className}`}>
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <iframe
      src={blobUrl}
      className={className}
      title={title}
    />
  );
}

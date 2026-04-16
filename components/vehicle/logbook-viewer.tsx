"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { axiosAuthClient } from "@/utilities/axios-client";
import {
  FILE_UPLOAD_ENDPOINT,
  VEHICLE_DETAIL_ENDPOINT,
} from "@/utilities/endpoints";
import {
  Eye,
  FileText,
  Upload,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { BlobPdfViewer } from "@/components/ui/blob-pdf-viewer";
import { toast } from "sonner";

const ACCEPTED_TYPES = ".pdf,.jpg,.jpeg,.png";

function guessFileTypeFromUrl(url: string): "pdf" | "image" | null {
  const path = url.split("?")[0].toLowerCase();
  if (path.endsWith(".pdf")) return "pdf";
  if (/\.(png|jpe?g|gif|webp|bmp|svg)$/.test(path)) return "image";
  return null;
}

export function LogbookViewer({ url }: { url: string }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"pdf" | "image" | null>(() =>
    guessFileTypeFromUrl(url),
  );
  const proxiedUrl = `/api/pdf-proxy?url=${encodeURIComponent(url)}`;

  // If the URL doesn't expose a recognizable extension, probe the proxy for
  // the real content-type so we know whether to render a PDF viewer or an image.
  useEffect(() => {
    if (type !== null) return;
    let cancelled = false;
    fetch(proxiedUrl, { method: "HEAD" })
      .then((res) => {
        if (cancelled) return;
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("pdf")) setType("pdf");
        else if (ct.startsWith("image/")) setType("image");
        else setType("pdf"); // safest default for logbooks
      })
      .catch(() => {
        if (!cancelled) setType("pdf");
      });
    return () => {
      cancelled = true;
    };
  }, [proxiedUrl, type]);

  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 p-2 bg-emerald-50 border border-emerald-200 rounded-xl">
        {type === "image" ? (
          <ImageIcon className="w-5 h-5 text-emerald-600" />
        ) : (
          <FileText className="w-5 h-5 text-emerald-600" />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#1e3a5f]">
          Logbook Available
        </p>
        <p className="text-xs text-muted-foreground">
          {type === "image" ? "Image file" : "PDF document"}
        </p>
      </div>
      <div className="flex items-center gap-2 ml-auto shrink-0">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              View
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Vehicle Logbook</DialogTitle>
              <DialogDescription>
                Preview of the uploaded vehicle logbook document.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-2 overflow-auto max-h-[75vh]">
              {type === null ? (
                <div className="flex items-center justify-center h-[70vh] rounded-lg border">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={proxiedUrl}
                  alt="Vehicle logbook"
                  className="w-full h-auto rounded-lg border"
                />
              ) : (
                <BlobPdfViewer src={proxiedUrl} title="Logbook PDF" />
              )}
            </div>
          </DialogContent>
        </Dialog>
        <a href={url} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </a>
      </div>
    </div>
  );
}

export function LogbookUploadPlaceholder({
  vehicleId,
  registrationNumber,
}: {
  vehicleId: string;
  registrationNumber: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // Step 1: Upload file
      const formData = new FormData();
      formData.append(
        "file_name",
        `${registrationNumber.toLowerCase()}logbook`,
      );
      formData.append("file", file);

      const uploadRes = await axiosAuthClient.post(
        FILE_UPLOAD_ENDPOINT,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      const mediaURL = uploadRes.data?.[0]?.mediaURL;
      if (!mediaURL) throw new Error("Upload failed — no URL returned");

      // Step 2: Update vehicle with logbook URL
      await axiosAuthClient.patch(`${VEHICLE_DETAIL_ENDPOINT}/${vehicleId}`, {
        logbook_url: mediaURL,
      });

      toast.success("Logbook uploaded successfully");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to upload logbook";
      toast.error(message);
    } finally {
      setUploading(false);
      // Reset input so re-selecting the same file triggers onChange
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 p-2 bg-gray-100 border border-gray-200 rounded-xl">
        <FileText className="w-5 h-5 text-gray-400" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#1e3a5f]">
          No logbook uploaded
        </p>
        <p className="text-xs text-muted-foreground">
          Upload your vehicle logbook for verification
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        className="hidden"
        onChange={handleUpload}
      />
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 ml-auto shrink-0"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Upload className="w-3.5 h-3.5" />
        )}
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
}

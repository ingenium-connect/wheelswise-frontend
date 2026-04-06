"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { toast } from "sonner";

const ACCEPTED_TYPES = ".pdf,.jpg,.jpeg,.png";

function getFileType(url: string): "pdf" | "image" {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "pdf";
  return "image";
}

export function LogbookViewer({ url }: { url: string }) {
  const [open, setOpen] = useState(false);
  const type = getFileType(url);

  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 p-2 bg-emerald-50 border border-emerald-200 rounded-xl">
        {type === "pdf" ? (
          <FileText className="w-5 h-5 text-emerald-600" />
        ) : (
          <ImageIcon className="w-5 h-5 text-emerald-600" />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#1e3a5f]">
          Logbook Available
        </p>
        <p className="text-xs text-muted-foreground">
          {type === "pdf" ? "PDF document" : "Image file"}
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
            </DialogHeader>
            <div className="mt-2 overflow-auto max-h-[75vh]">
              {type === "pdf" ? (
                <iframe
                  src={url}
                  className="w-full h-[70vh] rounded-lg border"
                  title="Logbook PDF"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt="Vehicle logbook"
                  className="w-full h-auto rounded-lg border"
                />
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
      formData.append("file_name", `${registrationNumber.toLowerCase()}logbook`);
      formData.append("file", file);

      const uploadRes = await axiosAuthClient.post(
        FILE_UPLOAD_ENDPOINT,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      const mediaURL = uploadRes.data?.[0]?.mediaURL;
      if (!mediaURL) throw new Error("Upload failed — no URL returned");

      // Step 2: Update vehicle with logbook URL
      await axiosAuthClient.patch(
        `${VEHICLE_DETAIL_ENDPOINT}/${vehicleId}`,
        { logbook_url: mediaURL },
      );

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

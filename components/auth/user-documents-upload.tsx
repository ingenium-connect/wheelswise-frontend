"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  USER_DOCUMENTS_ENDPOINT,
} from "@/utilities/endpoints";
import {
  Eye,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Loader2,
  Upload,
} from "lucide-react";
import { BlobPdfViewer } from "@/components/ui/blob-pdf-viewer";
import { toast } from "sonner";
import { UserProfile } from "@/types/data";

const ACCEPTED_TYPES = ".pdf,.jpg,.jpeg,.png";

type DocumentField = "kra_pin_url" | "national_id_url";

function guessFileTypeFromUrl(url: string): "pdf" | "image" {
  const path = url.split("?")[0].toLowerCase();
  if (/\.(png|jpe?g|gif|webp|bmp|svg)$/.test(path)) return "image";
  return "pdf";
}

function DocumentViewer({ url, label }: { url: string; label: string }) {
  const [open, setOpen] = useState(false);
  const type = guessFileTypeFromUrl(url);
  const proxiedUrl = `/api/pdf-proxy?url=${encodeURIComponent(url)}`;

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
        <p className="text-sm font-semibold text-[#1e3a5f]">{label} Uploaded</p>
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
              <DialogTitle>{label}</DialogTitle>
              <DialogDescription>
                Preview of your uploaded {label.toLowerCase()} document.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-2 overflow-auto max-h-[75vh]">
              {type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={proxiedUrl}
                  alt={label}
                  className="w-full h-auto rounded-lg border"
                />
              ) : (
                <BlobPdfViewer src={proxiedUrl} title={label} />
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

function DocumentUploadRow({
  label,
  field,
  existingUrl,
  idNumber,
}: {
  label: string;
  field: DocumentField;
  existingUrl?: string | null;
  idNumber: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const slugField = field === "kra_pin_url" ? "kra_pin" : "national_id";
      const formData = new FormData();
      formData.append("file_name", `${idNumber.toLowerCase()}_${slugField}`);
      formData.append("file", file);

      const uploadRes = await axiosAuthClient.post(
        FILE_UPLOAD_ENDPOINT,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      const mediaURL = uploadRes.data?.[0]?.mediaURL;
      if (!mediaURL) throw new Error("Upload failed — no URL returned");

      await axiosAuthClient.patch(USER_DOCUMENTS_ENDPOINT, {
        [field]: mediaURL,
      });

      toast.success(`${label} uploaded successfully`);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : `Failed to upload ${label}`;
      toast.error(message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  if (existingUrl) {
    return <DocumentViewer url={existingUrl} label={label} />;
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 p-2 bg-gray-100 border border-gray-200 rounded-xl">
        <FileText className="w-5 h-5 text-gray-400" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#1e3a5f]">
          No {label} uploaded
        </p>
        <p className="text-xs text-muted-foreground">
          Upload your {label.toLowerCase()} for verification
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

export function UserDocumentsCard({ user }: { user: UserProfile }) {
  return (
    <Card className="border border-[#d7e8ee] shadow-sm mt-5">
      <CardContent className="p-6">
        <h3 className="text-sm font-semibold text-[#1e3a5f] mb-5 uppercase tracking-wide">
          Identity Documents
        </h3>
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-[#f8fbfc] border border-[#d7e8ee]">
            <DocumentUploadRow
              label="National ID"
              field="national_id_url"
              existingUrl={user.national_id_url}
              idNumber={user.id_number}
            />
          </div>
          <div className="p-3 rounded-xl bg-[#f8fbfc] border border-[#d7e8ee]">
            <DocumentUploadRow
              label="KRA PIN Certificate"
              field="kra_pin_url"
              existingUrl={user.kra_pin_url}
              idNumber={user.id_number}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

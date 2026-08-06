"use client";

import { useEffect, useRef, useState } from "react";
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
  COMPLIANCE_DOCUMENTS_ENDPOINT,
  DOCUMENTS_OCR_ENDPOINT,
  FILE_UPLOAD_ENDPOINT,
  USER_DOCUMENTS_ENDPOINT,
} from "@/utilities/endpoints";
import {
  Eye,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Loader2,
  Pencil,
  ShieldAlert,
  ShieldCheck,
  Upload,
  XCircle,
} from "lucide-react";
import { BlobPdfViewer } from "@/components/ui/blob-pdf-viewer";
import { toast } from "sonner";
import { KycVerificationStatus, UserProfile } from "@/types/data";

const ACCEPTED_TYPES = ".pdf,.jpg,.jpeg,.png";

type DocumentField = "kra_pin_url" | "national_id_url";

function guessFileTypeFromUrl(url: string): "pdf" | "image" | null {
  const path = url.split("?")[0].toLowerCase();
  if (/\.(png|jpe?g|gif|webp|bmp|svg)$/.test(path)) return "image";
  if (/\.pdf$/.test(path)) return "pdf";
  // No recognisable extension — caller must probe the Content-Type header
  return null;
}

function DocumentUploadRow({
  label,
  existingUrl,
  onUpload,
}: {
  label: string;
  existingUrl?: string | null;
  onUpload: (file: File) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  // Resolve the file type. Start with a URL-based guess; if the URL has no
  // recognisable extension (common with S3 signed URLs) probe the proxy HEAD
  // so we get the real Content-Type instead of always falling back to "pdf".
  const urlGuess = existingUrl ? guessFileTypeFromUrl(existingUrl) : null;
  const [resolvedType, setResolvedType] = useState<"pdf" | "image" | null>(
    urlGuess,
  );

  useEffect(() => {
    if (!existingUrl || urlGuess !== null) return; // already known from URL
    const proxiedUrl = `/api/pdf-proxy?url=${encodeURIComponent(existingUrl)}`;
    fetch(proxiedUrl, { method: "HEAD" })
      .then((res) => {
        const ct = res.headers.get("content-type") ?? "";
        setResolvedType(ct.startsWith("image/") ? "image" : "pdf");
      })
      .catch(() => setResolvedType("pdf")); // safe fallback
  }, [existingUrl, urlGuess]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await onUpload(file);
      toast.success(`${label} uploaded successfully`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : `Failed to upload ${label}`;
      toast.error(message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  // Hidden file input — always rendered so re-upload works in both states
  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept={ACCEPTED_TYPES}
      className="hidden"
      onChange={handleUpload}
    />
  );

  if (existingUrl) {
    const type = resolvedType ?? "pdf"; // default to pdf until probe resolves
    const proxiedUrl = `/api/pdf-proxy?url=${encodeURIComponent(existingUrl)}`;

    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Icon + label row */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex-shrink-0 p-2 bg-emerald-50 border border-emerald-200 rounded-xl">
            {type === "image" ? (
              <ImageIcon className="w-5 h-5 text-emerald-600" />
            ) : (
              <FileText className="w-5 h-5 text-emerald-600" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#1e3a5f] truncate">
              {label} Uploaded
            </p>
            <p className="text-xs text-muted-foreground">
              {type === "image" ? "Image file" : "PDF document"}
            </p>
          </div>
        </div>

        {/* Action buttons row */}
        <div className="flex items-center gap-2 shrink-0">
          {/* View */}
          <Dialog open={viewOpen} onOpenChange={setViewOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 flex-1 sm:flex-none"
              >
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

          {/* Open in new tab */}
          <a href={existingUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </a>

          {/* Re-upload */}
          {fileInput}
          <Button
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            title={`Replace ${label}`}
          >
            {uploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Pencil className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      {/* Icon + label row */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex-shrink-0 p-2 bg-gray-100 border border-gray-200 rounded-xl">
          <FileText className="w-5 h-5 text-gray-400" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#1e3a5f] truncate">
            No {label} uploaded
          </p>
          <p className="text-xs text-muted-foreground truncate">
            Upload your {label.toLowerCase()} for verification
          </p>
        </div>
      </div>
      {fileInput}
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 w-full sm:w-auto shrink-0"
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

function KycStatusBadge({ status }: { status: KycVerificationStatus }) {
  if (status === "VERIFIED") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
        Verified
      </span>
    );
  }
  if (status === "REJECTED") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
        <XCircle className="w-3.5 h-3.5 shrink-0" />
        Action required
      </span>
    );
  }
  // UNVERIFIED
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
      <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
      Pending review
    </span>
  );
}

type ComplianceDocumentType = "DRIVING_LICENSE" | "PSV_BADGE";

type ComplianceDocument = {
  document_type: ComplianceDocumentType;
  mediaURL: string;
};

const COMPLIANCE_DOCUMENT_LABELS: Record<ComplianceDocumentType, string> = {
  DRIVING_LICENSE: "Driving Licence",
  PSV_BADGE: "PSV Badge",
};

function ComplianceDocumentsCard() {
  const [documents, setDocuments] = useState<ComplianceDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const response = await axiosAuthClient.get(
        `${COMPLIANCE_DOCUMENTS_ENDPOINT}?page=1&page_size=100`,
      );
      const data = response.data;
      // Handle both possible response formats
      const list = data?.documents ?? data?.results ?? data;
      setDocuments(Array.isArray(list) ? list : []);
    } catch {
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const findDocument = (type: ComplianceDocumentType) =>
    documents.find((doc) => doc.document_type === type);

  return (
    <Card className="border border-[#d7e8ee] shadow-sm mt-5">
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-3 mb-5">
          <h3 className="text-sm font-semibold text-[#1e3a5f] uppercase tracking-wide">
            Compliance Documents
          </h3>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-6 text-muted-foreground text-sm gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading documents...
          </div>
        ) : (
          <div className="space-y-4">
            {(
              Object.keys(
                COMPLIANCE_DOCUMENT_LABELS,
              ) as ComplianceDocumentType[]
            ).map((type) => (
              <div
                key={type}
                className="p-3 rounded-xl bg-[#f8fbfc] border border-[#d7e8ee]"
              >
                <DocumentUploadRow
                  label={COMPLIANCE_DOCUMENT_LABELS[type]}
                  existingUrl={findDocument(type)?.mediaURL}
                  onUpload={async (file) => {
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("document_type", type);

                    const uploadRes = await axiosAuthClient.post(
                      DOCUMENTS_OCR_ENDPOINT,
                      formData,
                      { headers: { "Content-Type": "multipart/form-data" } },
                    );

                    if (uploadRes.data?.success === false) {
                      throw new Error(
                        `${COMPLIANCE_DOCUMENT_LABELS[type]} could not be verified — please upload a clearer copy`,
                      );
                    }

                    await fetchDocuments();
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function UserDocumentsCard({ user }: { user: UserProfile }) {
  const router = useRouter();
  const kycStatus = user.kyc_documents_verification_status;

  const uploadIdentityDocument = async (field: DocumentField, file: File) => {
    const slugField = field === "kra_pin_url" ? "kra_pin" : "national_id";
    const formData = new FormData();
    formData.append(
      "file_name",
      `${user.id_number.toLowerCase()}_${slugField}`,
    );
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

    router.refresh();
  };

  return (
    <>
      <Card className="border border-[#d7e8ee] shadow-sm mt-5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-3 mb-5">
            <h3 className="text-sm font-semibold text-[#1e3a5f] uppercase tracking-wide">
              Identity Documents
            </h3>
            {kycStatus && <KycStatusBadge status={kycStatus} />}
          </div>
          {kycStatus === "REJECTED" && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
              Your documents were not accepted. Please re-upload clear, valid
              copies of your National ID and KRA PIN Certificate.
            </p>
          )}
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-[#f8fbfc] border border-[#d7e8ee]">
              <DocumentUploadRow
                label="National ID"
                existingUrl={user.national_id_url}
                onUpload={(file) =>
                  uploadIdentityDocument("national_id_url", file)
                }
              />
            </div>
            <div className="p-3 rounded-xl bg-[#f8fbfc] border border-[#d7e8ee]">
              <DocumentUploadRow
                label="KRA PIN Certificate"
                existingUrl={user.kra_pin_url}
                onUpload={(file) => uploadIdentityDocument("kra_pin_url", file)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <ComplianceDocumentsCard />
    </>
  );
}

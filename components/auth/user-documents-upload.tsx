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
  LucideUser,
  LucideUser2,
} from "lucide-react";
import { BlobPdfViewer } from "@/components/ui/blob-pdf-viewer";
import { toast } from "sonner";
import { KycVerificationStatus, UserProfile } from "@/types/data";
import { cn } from "@/lib/utils";

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
  id: string;
  user_id: string;
  document_number: string;
  issue_date: string;
  expiry_date: string;
  document_name: string;
  status: string;
  date_created: string;
  updated_at: string;
};

const COMPLIANCE_DOCUMENT_LABELS: Record<ComplianceDocumentType, string> = {
  DRIVING_LICENSE: "Driving Licence",
  PSV_BADGE: "PSV Badge",
};

function ComplianceDocumentUploadButton({
  label,
  hasDocument,
  onUpload,
}: {
  label: string;
  hasDocument: boolean;
  onUpload: (file: File) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        className="hidden"
        onChange={handleChange}
      />
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 shrink-0"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : hasDocument ? (
          <Pencil className="w-3.5 h-3.5" />
        ) : (
          <Upload className="w-3.5 h-3.5" />
        )}
        {uploading ? "Uploading..." : hasDocument ? "Replace" : "Upload"}
      </Button>
    </>
  );
}

function ComplianceDocumentSection({
  type,
  document,
  holderName,
  nationalId,
  onUpload,
}: {
  type: ComplianceDocumentType;
  document?: ComplianceDocument;
  holderName?: string;
  nationalId?: string;
  onUpload: (file: File) => Promise<void>;
}) {
  const label = COMPLIANCE_DOCUMENT_LABELS[type];

  return (
    <div className="p-3 rounded-xl bg-[#f8fbfc] border border-[#d7e8ee] space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-[#1e3a5f] uppercase tracking-wide">
          {label}
        </p>
        <ComplianceDocumentUploadButton
          label={label}
          hasDocument={!!document}
          onUpload={onUpload}
        />
      </div>

      {document ? (
        type === "DRIVING_LICENSE" ? (
          <DrivingLicenceBadge
            document={document}
            holderName={holderName}
            nationalId={nationalId}
          />
        ) : (
          <PsvBadgeCard
            document={document}
            holderName={holderName}
            nationalId={nationalId}
          />
        )
      ) : (
        <div className="flex items-center gap-3 py-1">
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
      )}
    </div>
  );
}

function ComplianceDocumentsCard({ user }: { user: UserProfile }) {
  const [documents, setDocuments] = useState<ComplianceDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const response = await axiosAuthClient.get(
        `${COMPLIANCE_DOCUMENTS_ENDPOINT}?page=1&page_size=100`,
      );
      const list = response.data?.documents;
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

  const uploadComplianceDocument = async (
    type: ComplianceDocumentType,
    file: File,
  ) => {
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
  };

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
              <ComplianceDocumentSection
                key={type}
                type={type}
                document={findDocument(type)}
                holderName={user.name}
                nationalId={user.id_number}
                onUpload={(file) => uploadComplianceDocument(type, file)}
              />
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
    <div>
      <Card className="border border-[#d7e8ee] shadow-sm">
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

      <ComplianceDocumentsCard user={user} />
    </div>
  );
}

function formatDlDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${date.getUTCFullYear()}`;
}

function DrivingLicenceBadge({
  document,
  holderName,
  nationalId,
}: {
  document?: ComplianceDocument;
  holderName?: string;
  nationalId?: string;
}) {
  const isExpired = document?.status === "EXPIRED";
  const nameParts = (holderName ?? "").trim().split(/\s+/).filter(Boolean);
  const surname = nameParts.length ? nameParts[nameParts.length - 1] : "—";
  const otherNames =
    nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : "—";

  return (
    <div className="relative w-full max-w-[420px] mx-auto overflow-hidden rounded-lg border border-[#a9c9a0] bg-gradient-to-br from-[#eef6ea] via-[#f5f9f0] to-[#e8f1e2] shadow-sm">
      {/* Header */}
      <div className="relative flex items-center gap-2 px-3 pt-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/kenya-flag.svg"
          alt="Flag of Kenya"
          className="w-8 h-6 shrink-0 rounded-[2px] border border-black/10 object-cover"
        />
        <div className="flex-1 text-center">
          <p className="text-[13px] font-extrabold tracking-wide text-[#1e3a1e]">
            DRIVING LICENCE
          </p>
          <div className="flex justify-center gap-3 text-[9px] font-semibold uppercase text-[#2f5c33]">
            <span>Republic of Kenya</span>
            <span>Jamhuri ya Kenya</span>
          </div>
        </div>
        {/* <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7a4b8a]/10"> */}
        <img
          src="/court-of-arms.png"
          alt="Court of Arms"
          className="w-8 h-6 shrink-0 rounded-[2px] border border-black/10 object-cover"
        />
        {/* </div> */}
      </div>

      {/* Body */}
      <div className="relative flex gap-3 px-3 pt-3 pb-2">
        <div className="shrink-0">
          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <LucideUser2 className="w-full" size={36} />
          </div>
        </div>

        <div className="grid flex-1 min-w-0 grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
          <div className="col-span-2">
            <p className="text-[8px] font-semibold tracking-wide text-[#5a6b57]">
              SURNAME
            </p>
            <p className="truncate font-bold text-[#1e2d1e]">{surname}</p>
          </div>
          <div className="col-span-2">
            <p className="text-[8px] font-semibold tracking-wide text-[#5a6b57]">
              OTHER NAMES
            </p>
            <p className="truncate font-bold text-[#1e2d1e]">{otherNames}</p>
          </div>
          <div>
            <p className="text-[8px] font-semibold tracking-wide text-[#5a6b57]">
              NATIONAL ID No
            </p>
            <p className="truncate font-bold text-[#1e2d1e]">
              {nationalId || "—"}
            </p>
          </div>
          <div>
            <p className="text-[8px] font-semibold tracking-wide text-[#5a6b57]">
              LICENCE No
            </p>
            <p className="truncate font-bold text-[#1e2d1e]">
              {document?.document_number ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-[8px] font-semibold tracking-wide text-[#5a6b57]">
              DATE OF ISSUE
            </p>
            <p className="font-bold text-[#1e2d1e]">
              {document ? formatDlDate(document.issue_date) : "—"}
            </p>
          </div>
          <div>
            <p className="text-[8px] font-semibold tracking-wide text-[#5a6b57]">
              DATE OF EXPIRY
            </p>
            <p
              className={cn(
                "font-bold",
                isExpired ? "text-red-600" : "text-[#1e2d1e]",
              )}
            >
              {document ? formatDlDate(document.expiry_date) : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative flex justify-end items-center px-3 pb-3 pt-1">
        <div className="rounded bg-[#1e3a5f]/5 px-1.5 py-0.5">
          <span className="text-[9px] font-black tracking-wide text-[#1e3a5f]">
            NTSA
          </span>
        </div>
      </div>

      {isExpired && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="rotate-[-14deg] rounded border-2 border-red-600/70 bg-white/40 px-4 py-1 text-lg font-extrabold tracking-widest text-red-600/80">
            EXPIRED
          </span>
        </div>
      )}
    </div>
  );
}

function PsvBadgeCard({
  document,
  holderName,
  nationalId,
}: {
  document?: ComplianceDocument;
  holderName?: string;
  nationalId?: string;
}) {
  const isExpired = document?.status === "EXPIRED";
  const nameParts = (holderName ?? "").trim().split(/\s+/).filter(Boolean);
  const surname = nameParts.length ? nameParts[nameParts.length - 1] : "—";
  const otherNames =
    nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : "—";

  return (
    <div className="relative w-full max-w-[420px] mx-auto overflow-hidden rounded-lg border border-[#a3c0d9] bg-gradient-to-br from-[#eaf3fa] via-[#f3f8fb] to-[#e2edf5] shadow-sm">
      {/* Header */}
      <div className="relative flex items-center gap-2 px-3 pt-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/kenya-flag.svg"
          alt="Flag of Kenya"
          className="w-8 h-6 shrink-0 rounded-[2px] border border-black/10 object-cover"
        />
        <div className="flex-1 text-center">
          <p className="text-[13px] font-extrabold tracking-wide text-[#1e3350]">
            PSV BADGE
          </p>
          <div className="flex justify-center gap-3 text-[9px] font-semibold uppercase text-[#2f5065]">
            <span>Republic of Kenya</span>
            <span>Jamhuri ya Kenya</span>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/court-of-arms.png"
          alt="Court of Arms"
          className="w-8 h-6 shrink-0 rounded-[2px] border border-black/10 object-cover"
        />
      </div>

      {/* Body */}
      <div className="relative flex gap-3 px-3 pt-3 pb-2">
        <div className="shrink-0">
          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <LucideUser className="w-full" size={36} />
          </div>
        </div>

        <div className="grid flex-1 min-w-0 grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
          <div className="col-span-2">
            <p className="text-[8px] font-semibold tracking-wide text-[#4f6274]">
              SURNAME
            </p>
            <p className="truncate font-bold text-[#1e2b3d]">{surname}</p>
          </div>
          <div className="col-span-2">
            <p className="text-[8px] font-semibold tracking-wide text-[#4f6274]">
              OTHER NAMES
            </p>
            <p className="truncate font-bold text-[#1e2b3d]">{otherNames}</p>
          </div>
          <div>
            <p className="text-[8px] font-semibold tracking-wide text-[#4f6274]">
              NATIONAL ID No
            </p>
            <p className="truncate font-bold text-[#1e2b3d]">
              {nationalId || "—"}
            </p>
          </div>
          <div>
            <p className="text-[8px] font-semibold tracking-wide text-[#4f6274]">
              BADGE No
            </p>
            <p className="truncate font-bold text-[#1e2b3d]">
              {document?.document_number ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-[8px] font-semibold tracking-wide text-[#4f6274]">
              DATE OF ISSUE
            </p>
            <p className="font-bold text-[#1e2b3d]">
              {document ? formatDlDate(document.issue_date) : "—"}
            </p>
          </div>
          <div>
            <p className="text-[8px] font-semibold tracking-wide text-[#4f6274]">
              DATE OF EXPIRY
            </p>
            <p
              className={cn(
                "font-bold",
                isExpired ? "text-red-600" : "text-[#1e2b3d]",
              )}
            >
              {document ? formatDlDate(document.expiry_date) : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative flex justify-end items-center px-3 pb-3 pt-1">
        <div className="rounded bg-[#1e3a5f]/5 px-1.5 py-0.5">
          <span className="text-[9px] font-black tracking-wide text-[#1e3a5f]">
            NTSA
          </span>
        </div>
      </div>

      {isExpired && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="rotate-[-14deg] rounded border-2 border-red-600/70 bg-white/40 px-4 py-1 text-lg font-extrabold tracking-widest text-red-600/80">
            EXPIRED
          </span>
        </div>
      )}
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

/**
 * DashboardSkeleton - Loading state for dashboard pages
 *
 * Shows skeleton UI while dashboard data is being fetched
 */
export function DashboardSkeleton() {
  return (
    <>
      {/* Header skeleton */}
      <div className="px-4 md:px-8 pt-6 pb-2 bg-[#f0f6f9]">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74] rounded-2xl px-6 md:px-10 py-8 shadow-lg">
          <Skeleton className="h-4 w-24 mb-2 bg-white/20" />
          <Skeleton className="h-8 w-48 mb-1 bg-white/30" />
          <Skeleton className="h-4 w-64 bg-white/20" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="bg-[#f0f6f9] flex-1 px-4 md:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Tabs skeleton */}
          <div className="flex gap-2 mb-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>

          {/* Cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[#d7e8ee] p-6"
              >
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * CardSkeleton - Loading state for card components
 */
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#d7e8ee] p-6">
      <Skeleton className="h-6 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      <Skeleton className="h-10 w-32" />
    </div>
  );
}

/**
 * TableSkeleton - Loading state for tables
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex gap-4 pb-2 border-b">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}

/**
 * FormSkeleton - Loading state for forms
 */
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i}>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-32 mt-6" />
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="p-5">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div className="flex flex-col space-y-3" key={index}>
              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
        <div className="min-h-[100vh] animate-pulse flex-1 rounded-xl bg-[#d7e8ee] md:min-h-min" />
      </div>
    </section>
  );
}

import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="size-full bg-background flex flex-col gap-6 p-6 lg:p-8">

      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-4 w-[480px] max-w-full" />
      </div>

      {/* Map Skeleton */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <Skeleton className="h-[500px] w-full" />
      </div>

    </div>
  )
}

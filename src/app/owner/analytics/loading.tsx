import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="size-full bg-background flex flex-col gap-8 p-6 lg:p-8">

      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Chart + Table */}
      <div className="grid grid-cols-1 gap-6">
        {/* Chart Skeleton */}
        <div className="rounded-xl border bg-card p-6 flex flex-col gap-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-72 w-full rounded-lg" />
        </div>

        {/* Table Skeleton */}
        <div className="rounded-xl border bg-card p-6 flex flex-col gap-4">
          <Skeleton className="h-6 w-40" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full" />
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

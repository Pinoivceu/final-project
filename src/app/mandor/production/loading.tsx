import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="size-full bg-background flex flex-col gap-8 p-6 lg:p-8">

      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7 rounded" />
          <Skeleton className="h-9 w-32" />
        </div>
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Chart */}
      <div className="rounded-xl border bg-card p-6 flex flex-col gap-4">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>

      {/* Table */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-36" />
        <div className="rounded-xl border bg-card">
          <div className="flex gap-4 p-4 border-b">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1" />
            ))}
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 border-b last:border-b-0">
              {Array.from({ length: 5 }).map((_, j) => (
                <Skeleton key={j} className="h-5 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

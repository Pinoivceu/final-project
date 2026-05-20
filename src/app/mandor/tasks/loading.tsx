import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="size-full bg-background flex flex-col gap-8 p-6 lg:p-8">

      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7 rounded" />
          <Skeleton className="h-9 w-40" />
        </div>
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, col) => (
          <div key={col} className="rounded-xl border bg-card p-4 flex flex-col gap-3">
            <Skeleton className="h-5 w-28" />
            {Array.from({ length: 2 }).map((_, row) => (
              <div key={row} className="rounded-lg border p-4 flex flex-col gap-2">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-3 w-full" />
                <div className="flex gap-2 mt-1">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Activity Log */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="rounded-xl border bg-card">
          <div className="flex gap-4 p-4 border-b">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1" />
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 border-b last:border-b-0">
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="h-5 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

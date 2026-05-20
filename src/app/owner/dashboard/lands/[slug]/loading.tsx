import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="size-full p-6 flex flex-col gap-6">

      {/* Page Header */}
      <div className="flex flex-row items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-4 rounded" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 border-b pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-md" />
          ))}
        </div>

        {/* Tab Content Placeholder */}
        <div className="rounded-lg bg-card border p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

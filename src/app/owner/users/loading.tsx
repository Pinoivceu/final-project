import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="size-full p-6 flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card">
        {/* Table Header */}
        <div className="flex gap-4 p-4 border-b">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
        {/* Table Rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-4 p-4 border-b last:border-b-0">
            {Array.from({ length: 5 }).map((_, j) => (
              <Skeleton key={j} className="h-5 flex-1" />
            ))}
          </div>
        ))}
      </div>

    </div>
  )
}

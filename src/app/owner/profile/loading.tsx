import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="size-full bg-background flex flex-col gap-6 p-6 lg:p-8">

      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Profile Form Card */}
      <div className="max-w-2xl rounded-xl border bg-card p-6 flex flex-col gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>

    </div>
  )
}

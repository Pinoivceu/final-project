import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="size-full bg-background flex flex-col gap-8 p-6 lg:p-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7 rounded" />
          <Skeleton className="h-9 w-48" />
        </div>
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Profile Card */}
        <div className="rounded-xl border bg-card">
          <div className="p-6 flex flex-col gap-1 border-b">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="p-6 flex flex-col gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>

        {/* Password Card */}
        <div className="rounded-xl border bg-card">
          <div className="p-6 flex flex-col gap-1 border-b">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="p-6 flex flex-col gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
            <Skeleton className="h-10 w-36 rounded-md" />
          </div>
        </div>
      </div>

    </div>
  )
}

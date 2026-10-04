import { Skeleton } from "@/components/ui/skeleton"

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div aria-busy="true" aria-label="Memuat">
      <Skeleton className="mb-3 h-10 w-72 max-w-full" />
      <Skeleton className="mb-10 h-4 w-96 max-w-full" />
      <div className="divide-y divide-[#DCE1EA] border-y border-[#DCE1EA]">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="py-5">
            <Skeleton className="mb-3 h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Memuat" className="max-w-3xl">
      <Skeleton className="mb-3 h-10 w-3/4" />
      <Skeleton className="mb-10 h-4 w-48" />
      <Skeleton className="mb-3 h-4 w-full" />
      <Skeleton className="mb-3 h-4 w-full" />
      <Skeleton className="mb-10 h-4 w-1/2" />
      <Skeleton className="h-40 w-full" />
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div aria-busy="true" aria-label="Memuat" className="max-w-2xl">
      <Skeleton className="mb-10 h-10 w-48" />
      <div className="space-y-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="mb-2 h-4 w-32" />
            <Skeleton className="h-11 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

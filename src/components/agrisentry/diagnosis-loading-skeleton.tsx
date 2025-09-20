import { Skeleton } from "@/components/ui/skeleton";

export default function DiagnosisLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <Skeleton className="w-full md:w-56 h-56 rounded-lg" />
        <div className="w-full space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
      <div className="space-y-2 pt-4 border-t">
        <Skeleton className="h-6 w-1/3 mb-4" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function WeatherSkeleton() {
  return (
    <div className="space-y-4">
      <Card className="bg-white/10 backdrop-blur-xl border-white/15">
        <CardContent className="p-6 space-y-6">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <Skeleton className="h-16 w-36" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-20 w-20 rounded-full" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-xl border-white/15">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Skeleton className="h-[220px] w-full rounded-lg" />
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-xl border-white/15">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-2 flex-1 rounded-full" />
              <Skeleton className="h-4 w-10" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default WeatherSkeleton;

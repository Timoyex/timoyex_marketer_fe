import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LevelProgressSkeleton() {
  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-lg" />
          <Skeleton className="h-4 w-24" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pb-4">
        <div className="text-center space-y-2">
          <Skeleton className="h-5 w-32 mx-auto" />
          <Skeleton className="h-4 w-40 mx-auto" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-full rounded-full" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="w-full h-2 rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

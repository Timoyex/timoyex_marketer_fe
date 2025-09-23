import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function QuickActionsSkeleton() {
  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-4 rounded-xl border border-border"
            >
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-4 w-4" />
            </div>
          ))}
        </div>

        {/* Stats at bottom */}
        <div className="pt-6 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-1">
                <Skeleton className="h-6 w-12 mx-auto" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

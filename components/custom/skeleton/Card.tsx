import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonInfoCard() {
  return (
    <Card className="bg-card border-border shadow-sm hover:scale-105 transition-transform duration-200 cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium text-card-foreground">
          <Skeleton className="h-4 w-[100px]" />
        </CardTitle>
        <div className={`p-1.5 sm:p-2 rounded-lg`}>
          <Skeleton className="h-4 w-4 rounded-2xl" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xl sm:text-2xl font-bold text-card-foreground">
          <Skeleton className="h-4 w-[100px]" />
        </div>
        <p className="text-xs text-muted-foreground">
          <Skeleton className="h-4 w-[200px]" />
        </p>
      </CardContent>
    </Card>
  );
}

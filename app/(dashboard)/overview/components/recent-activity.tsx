import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const RecentActivity = ({ recent }: { recent: Array<Record<string, any>> }) => {
  return (
    <Card className="bg-card border-border shadow-sm hover:scale-105 transition-transform duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-card-foreground text-sm sm:text-base">
          <div className="p-1.5 bg-orange-100 rounded-lg">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
          </div>
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pb-4">
        {recent.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="p-1 bg-muted rounded-full">
                <Icon className="h-3 w-3 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs sm:text-sm text-card-foreground">
                  {activity.text}
                </p>
                <p className="text-xs text-muted-foreground">{activity.date}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;

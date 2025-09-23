import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Demo from "./demo";

export function InfoCard({
  title,
  value,
  desc,
  icon,
  iconBg = "bg-blue-100",
  isDemo = false,
}: {
  title: string;
  value: string | number;
  desc?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  isDemo?: boolean;
}) {
  return (
    <Card className="bg-card border-border shadow-sm hover:scale-105 transition-transform duration-200 cursor-pointer relative">
      {isDemo && <Demo />}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium text-card-foreground">
          {title}
        </CardTitle>
        <div className={`p-1.5 sm:p-2 ${iconBg} rounded-lg`}>
          {icon || <Info className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xl sm:text-2xl font-bold text-card-foreground">
          {value}
        </div>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}

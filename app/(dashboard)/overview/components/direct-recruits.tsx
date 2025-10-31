import Demo from "@/components/custom/demo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Users } from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const DirectRecruitsChart = ({
  config,
  data,
}: {
  config: Record<string, any>;
  data: Array<Record<string, any>>;
}) => {
  return (
    <Card className="bg-card border-border shadow-sm hover:scale-105 transition-transform duration-200 overflow-hidden relative">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-card-foreground text-sm sm:text-base">
          <div className="p-1.5 bg-green-100 rounded-lg">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
          </div>
          Direct Recruits Chart
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-48 sm:h-56 lg:h-64 w-full">
          <ChartContainer config={config} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 15, left: 15, bottom: 30 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--chart-2)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--chart-2)"
                      stopOpacity={0.3}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="month"
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)" }}
                />
                <Bar
                  dataKey="users"
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DirectRecruitsChart;

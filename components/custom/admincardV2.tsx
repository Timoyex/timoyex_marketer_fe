import React, { type ElementType } from "react";
import { Card, CardContent } from "../ui/card";

export function AdminInfoCardV2({
  title,
  value,
  desc,
  icon,
  iconBg = "bg-blue-100",
  bgColor = "bg-blue-100",
}: {
  title: string;
  value: string | number;
  desc?: string;
  icon?: ElementType | null;
  iconBg?: string;
  bgColor?: string;
}) {
  const Icon = icon;

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-sm mt-1 text-slate-600">{desc}</p>
          </div>
          <div className={`p-3 rounded-full ${bgColor}`}>
            {Icon ? <Icon className={`w-8 h-8 ${iconBg}`} /> : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

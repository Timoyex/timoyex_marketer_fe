import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { DollarSign, Mail, Calendar, Users } from "lucide-react";
import { formatDate, getLevelBadgeColor } from "@/lib/utils";

const TeamCardView = ({ data }: { data: Array<Record<string, any>> }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((member) => (
        <Card
          key={member.id}
          className="bg-card border-border shadow-sm hover:scale-105 transition-transform duration-200"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {member.name
                    .split(" ")
                    .map((n: any) => n[0])
                    .join("")}
                </div>
                <div>
                  <CardTitle className="text-base font-semibold text-card-foreground">
                    {member.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {member.email}
                  </p>
                </div>
              </div>
              <Badge
                variant={member.status === "Active" ? "default" : "secondary"}
              >
                {member.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Joined {formatDate(member.joinDate)}
                </span>
              </div>
              <Badge
                variant="outline"
                className={getLevelBadgeColor(member.level)}
              >
                Level {member.level}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-xs text-muted-foreground">
                    Recruits
                  </span>
                </div>
                <div className="text-lg font-semibold text-foreground">
                  {member.recruits}
                </div>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-muted-foreground">
                    Earnings
                  </span>
                </div>
                <div className="text-lg font-semibold text-foreground">
                  ₦{member.earnings.toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TeamCardView;

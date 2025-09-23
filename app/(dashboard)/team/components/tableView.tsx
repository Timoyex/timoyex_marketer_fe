import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, getLevelBadgeColor } from "@/lib/utils";

const TeamTableView = ({ data }: { data: Array<Record<string, any>> }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Join Date</TableHead>
          <TableHead>Level</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Recruits</TableHead>
          <TableHead className="text-right">Earnings</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((member) => (
          <TableRow key={member.id}>
            <TableCell>
              <div>
                <div className="font-medium text-foreground">{member.name}</div>
                <div className="text-sm text-muted-foreground">
                  {member.email}
                </div>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(member.joinDate)}
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={getLevelBadgeColor(member.level)}
              >
                Level {member.level}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={member.status === "Active" ? "default" : "secondary"}
              >
                {member.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right font-medium">
              {member.recruits}
            </TableCell>
            <TableCell className="text-right font-medium">
              ₦{member.earnings.toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TeamTableView;

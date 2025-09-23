import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle } from "lucide-react";

const TaskChecklist = ({
  tasks,
  toggleTask,
}: {
  tasks: any[];
  toggleTask: Function;
}) => {
  return (
    <Card className="bg-card border-border shadow-sm hover:scale-105 transition-transform duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-card-foreground text-sm sm:text-base">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
            </div>
            Task Checklist
          </div>
          <Badge variant="secondary" className="text-xs">
            {tasks.filter((t) => t.completed).length}/{tasks.length}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 pb-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center space-x-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => toggleTask(task.id)}
            />
            <span
              className={`text-xs sm:text-sm ${
                task.completed
                  ? "line-through text-muted-foreground"
                  : "text-card-foreground"
              }`}
            >
              {task.text}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TaskChecklist;

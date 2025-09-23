import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award } from "lucide-react";

const levelData = [
  { level: "Level 1", recruits: 25, required: 25, completed: true },
  { level: "Level 2", recruits: 50, required: 50, completed: true },
  { level: "Level 3", recruits: 100, required: 100, completed: true },
  { level: "Level 4", recruits: 200, required: 200, completed: true },
  { level: "Level 5", recruits: 500, required: 500, completed: true },
  { level: "Level 6", recruits: 1000, required: 1000, completed: true },
  { level: "Level 7", recruits: 2000, required: 2000, completed: true },
  { level: "Level 8", recruits: 5000, required: 5000, completed: true },
  { level: "Level 9", recruits: 0, required: 10000, completed: false },
  { level: "Level 10", recruits: 0, required: 25000, completed: false },
];
const LevelProgress = () => {
  const getCurrentLevel = () => {
    const completedLevels = levelData.filter((level) => level.completed).length;
    return completedLevels + 1; // Current level is the next incomplete level
  };

  const getVisibleLevels = () => {
    const currentLevel = getCurrentLevel();
    if (currentLevel <= 5) {
      return levelData.slice(0, 5); // Show levels 1-5
    } else {
      return levelData.slice(5, 10); // Show levels 6-10
    }
  };
  return (
    <Card className="bg-card border-border shadow-sm hover:scale-105 transition-transform duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-card-foreground text-sm sm:text-base">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <Award className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
          </div>
          Level Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pb-4">
        <div className="text-center space-y-2">
          <h3 className="text-base sm:text-lg font-semibold">
            You are Level {getCurrentLevel()}
          </h3>
          <p className="text-sm text-muted-foreground">
            Need 11 more recruits for Level 3
          </p>
          <div className="space-y-2">
            <Progress value={89} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>89 recruits</span>
              <span>100 required</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {getVisibleLevels().map((level, index) => {
            const progress = level.completed
              ? 100
              : (level.recruits / level.required) * 100;
            const actualIndex = getCurrentLevel() <= 5 ? index : index + 5;
            const isCurrentLevel = actualIndex === 2;

            return (
              <div key={level.level} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-medium ${
                      isCurrentLevel
                        ? "text-primary"
                        : level.completed
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {level.level} {level.completed && "✅"}{" "}
                    {isCurrentLevel && "(Current)"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {level.recruits}/{level.required} recruits
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      level.completed
                        ? "bg-green-500"
                        : isCurrentLevel
                        ? "bg-primary"
                        : "bg-muted-foreground/30"
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}

          {getCurrentLevel() > 5 && (
            <div className="text-center pt-2">
              <Badge variant="secondary" className="text-xs">
                Advanced Levels (6-10)
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LevelProgress;

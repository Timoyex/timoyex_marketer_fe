import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";

export interface LevelRequirement {
  direct: number;
  total: number;
}

export interface LevelObject {
  [key: number]: LevelRequirement;
}

export const levelRequirements: LevelObject = {
  0: { direct: 0, total: 0 },
  1: { direct: 5, total: 50 },
  2: { direct: 15, total: 150 },
  3: { direct: 65, total: 650 },
  4: { direct: 100, total: 1000 },
  5: { direct: 350, total: 3500 },
  6: { direct: 750, total: 7500 },
  7: { direct: 1300, total: 13000 },
  8: { direct: 1900, total: 19_000 },
  9: { direct: 2500, total: 25000 },
  10: { direct: 3000, total: 30000 },
};

const MAX_LEVEL = 10;
const LEVELS_PER_VIEW = 5;

interface LevelProgressProps {
  userLevel?: number;
  directRecruits?: number;
  totalRecruits?: number;
}

const LevelProgress = ({
  userLevel = 8,
  directRecruits = 150,
  totalRecruits = 5000,
}: LevelProgressProps) => {
  // Ensure userLevel is within valid range
  const currentLevel = Math.max(0, Math.min(userLevel, MAX_LEVEL));

  const generateLevelData = () => {
    const levels = [];

    for (let i = 1; i <= MAX_LEVEL; i++) {
      const required = levelRequirements[i].total;
      const completed = i < currentLevel;
      const isCurrentLevel = i === currentLevel;

      // Calculate recruits for display
      let recruits = 0;
      if (completed) {
        recruits = required; // Show full for completed levels
      } else if (isCurrentLevel) {
        recruits = totalRecruits; // Show actual progress for current level
      }

      levels.push({
        level: i,
        levelName: `Level ${i}`,
        recruits,
        required,
        completed,
        isCurrentLevel,
      });
    }

    return levels;
  };

  const levelData = generateLevelData();

  const getNextLevelInfo = () => {
    // Handle max level reached
    if (currentLevel >= MAX_LEVEL) {
      return {
        recruitsNeeded: 0,
        direct: 0,
        nextLevel: MAX_LEVEL,
        progress: 100,
        nextRequired: levelRequirements[MAX_LEVEL]?.total || 0,
      };
    }

    const currentLevelData = levelRequirements[currentLevel] || {};
    const nextLevelData = levelRequirements[currentLevel + 1] || {};

    const currentRequired = currentLevelData.total ?? 0;
    const currentDirectRequired = currentLevelData.direct ?? 0;
    const nextRequired = nextLevelData.total ?? currentRequired;
    const nextDirectRequired = nextLevelData.direct ?? currentDirectRequired;

    const recruitsNeeded = Math.max(0, nextRequired - totalRecruits);
    const direct = Math.max(0, nextDirectRequired - directRecruits);

    // Calculate progress between current and next level
    const progressRange = Math.max(1, nextRequired - currentRequired);
    const currentProgress = Math.max(0, totalRecruits - currentRequired);
    const progress = Math.min(100, (currentProgress / progressRange) * 100);

    return {
      recruitsNeeded,
      direct,
      nextLevel: Math.min(currentLevel + 1, MAX_LEVEL),
      progress,
      nextRequired,
    };
  };

  const getVisibleLevels = () => {
    if (currentLevel <= LEVELS_PER_VIEW) {
      return levelData.slice(0, LEVELS_PER_VIEW);
    } else {
      return levelData.slice(LEVELS_PER_VIEW, MAX_LEVEL);
    }
  };

  const nextLevelInfo = getNextLevelInfo();

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
            You are Level {currentLevel}
          </h3>
          {currentLevel < MAX_LEVEL ? (
            <>
              <p className="text-sm text-muted-foreground">
                Need {nextLevelInfo.recruitsNeeded.toLocaleString()} more
                members for Level {nextLevelInfo.nextLevel}
              </p>
              <p className="text-sm text-muted-foreground">
                [{nextLevelInfo?.direct?.toLocaleString() || 0} members
                compulsory]
              </p>
              <div className="space-y-2">
                <Progress
                  value={nextLevelInfo.progress}
                  className="h-3"
                  aria-label={`Progress to level ${nextLevelInfo.nextLevel}`}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{totalRecruits.toLocaleString()} members</span>
                  <span>
                    {nextLevelInfo?.nextRequired?.toLocaleString() || 0}{" "}
                    required
                  </span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-green-600 font-medium">
              Maximum level reached! 🎉
            </p>
          )}
        </div>

        <div className="space-y-2">
          {getVisibleLevels().map((level) => {
            const progress = level.completed
              ? 100
              : level.isCurrentLevel
              ? (level.recruits / level.required) * 100
              : 0;

            return (
              <div key={level.level} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-medium ${
                      level.isCurrentLevel
                        ? "text-primary"
                        : level.completed
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {level.levelName} {level.completed && "✅"}{" "}
                    {level.isCurrentLevel && "(Current)"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {level.recruits.toLocaleString()}/
                    {level.required.toLocaleString()} members
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      level.completed
                        ? "bg-green-500"
                        : level.isCurrentLevel
                        ? "bg-primary"
                        : "bg-muted-foreground/30"
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                    role="progressbar"
                    aria-valuenow={Math.round(progress)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${level.levelName} progress`}
                  />
                </div>
              </div>
            );
          })}

          {currentLevel > LEVELS_PER_VIEW && (
            <div className="text-center pt-2">
              <Badge variant="secondary" className="text-xs">
                Advanced Levels (6-10)
              </Badge>
            </div>
          )}
        </div>

        {directRecruits > 0 && (
          <div className="text-center pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mt-2">
              Direct Members:{" "}
              <span className="font-medium">
                {directRecruits.toLocaleString()}
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LevelProgress;

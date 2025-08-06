import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useKarmaScore } from "@/hooks/useKarmaScore";

interface KarmaScoreProps {
  score?: number;
  level?: string;
  streak?: number;
}

export const KarmaScore = ({ score: propScore, level: propLevel, streak: propStreak }: KarmaScoreProps) => {
  const { karmaData, loading } = useKarmaScore();
  
  // Use props if provided, otherwise use data from hook
  const score = propScore !== undefined ? propScore : karmaData.score;
  const level = propLevel || karmaData.level;
  const streak = propStreak !== undefined ? propStreak : karmaData.streak;

  if (loading) {
    return (
      <Card className="p-6 shadow-karma">
        <div className="text-center space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-32 mx-auto mb-2"></div>
            <div className="h-16 bg-muted rounded w-24 mx-auto mb-2"></div>
            <div className="h-4 bg-muted rounded w-28 mx-auto"></div>
          </div>
        </div>
      </Card>
    );
  }
  const getKarmaColor = (score: number) => {
    if (score >= 80) return "text-karma-excellent";
    if (score >= 60) return "text-karma-good";
    if (score >= 40) return "text-karma-average";
    return "text-karma-poor";
  };

  const getKarmaBg = (score: number) => {
    if (score >= 80) return "bg-karma-excellent";
    if (score >= 60) return "bg-karma-good";
    if (score >= 40) return "bg-karma-average";
    return "bg-karma-poor";
  };

  return (
    <Card className="p-6 shadow-karma">
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-muted-foreground">Your Karma Score</h2>
          <div className={`text-6xl font-bold ${getKarmaColor(score)}`}>
            {score}
          </div>
          <div className="text-lg font-medium text-foreground">{level}</div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress to next level</span>
            <span>{score}/100</span>
          </div>
          <Progress 
            value={score} 
            className="h-3"
            style={{
              background: `hsl(var(--muted))`,
            }}
          />
        </div>

        <div className="flex justify-center items-center gap-2 pt-2">
          <div className="flex items-center gap-1">
            <span className="text-2xl">🔥</span>
            <span className="font-semibold text-accent">{streak}</span>
            <span className="text-sm text-muted-foreground">day streak</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
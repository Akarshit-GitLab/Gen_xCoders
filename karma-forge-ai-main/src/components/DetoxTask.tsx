import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface DetoxTaskProps {
  id: string;
  title: string;
  description: string;
  karmaReward: number;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  onToggle: (id: string) => void;
}

export const DetoxTask = ({ 
  id, 
  title, 
  description, 
  karmaReward, 
  completed, 
  difficulty,
  onToggle 
}: DetoxTaskProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-secondary text-secondary-foreground';
      case 'medium': return 'bg-accent text-accent-foreground';
      case 'hard': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className={`p-4 transition-all ${completed ? 'bg-muted/30 opacity-75' : 'shadow-card hover:shadow-lg'}`}>
      <div className="flex items-start gap-3">
        <Checkbox 
          checked={completed}
          onCheckedChange={() => onToggle(id)}
          className="mt-1"
        />
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className={`font-medium ${completed ? 'line-through text-muted-foreground' : ''}`}>
              {title}
            </h4>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getDifficultyColor(difficulty)}>
                {difficulty}
              </Badge>
              <Badge variant="outline" className="text-accent">
                +{karmaReward} ✨
              </Badge>
            </div>
          </div>
          
          <p className={`text-sm ${completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
};
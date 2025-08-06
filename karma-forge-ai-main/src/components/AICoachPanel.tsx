import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Target, Coffee } from "lucide-react";

interface AISuggestion {
  type: 'nudge' | 'encouragement' | 'warning';
  message: string;
  action?: string;
}

interface AICoachPanelProps {
  suggestions: AISuggestion[];
}

export const AICoachPanel = ({ suggestions }: AICoachPanelProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'nudge': return <Target className="w-5 h-5 text-primary" />;
      case 'encouragement': return <Brain className="w-5 h-5 text-secondary" />;
      case 'warning': return <Coffee className="w-5 h-5 text-accent" />;
      default: return <Brain className="w-5 h-5 text-primary" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'nudge': return 'border-l-primary';
      case 'encouragement': return 'border-l-secondary';
      case 'warning': return 'border-l-accent';
      default: return 'border-l-primary';
    }
  };

  return (
    <Card className="p-6 shadow-card">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-semibold">AI Karma Coach</h3>
        </div>
        
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div 
              key={index}
              className={`p-4 border-l-4 ${getBorderColor(suggestion.type)} bg-muted/30 rounded-r-lg`}
            >
              <div className="flex items-start gap-3">
                {getIcon(suggestion.type)}
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-foreground">{suggestion.message}</p>
                  {suggestion.action && (
                    <Button variant="outline" size="sm">
                      {suggestion.action}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground text-center">
            🧠 Powered by ethical AI - helping you build mindful digital habits
          </p>
        </div>
      </div>
    </Card>
  );
};
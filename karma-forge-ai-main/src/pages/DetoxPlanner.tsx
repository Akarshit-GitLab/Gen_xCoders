import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { DetoxTask } from "@/components/DetoxTask";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Plus, Trophy, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  description: string;
  karmaReward: number;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

const DetoxPlanner = () => {
  const { toast } = useToast();
  
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Phone-free Morning Hour",
      description: "Keep your phone away for the first hour after waking up",
      karmaReward: 15,
      completed: false,
      difficulty: 'medium',
      category: 'Morning Routine'
    },
    {
      id: "2", 
      title: "Read 10 Pages",
      description: "Read physical books or e-reader (not phone/tablet)",
      karmaReward: 10,
      completed: true,
      difficulty: 'easy',
      category: 'Learning'
    },
    {
      id: "3",
      title: "10-Minute Meditation",
      description: "Practice mindfulness meditation without any devices",
      karmaReward: 12,
      completed: false,
      difficulty: 'easy',
      category: 'Mindfulness'
    },
    {
      id: "4",
      title: "Digital Sunset",
      description: "No screens 2 hours before bedtime",
      karmaReward: 20,
      completed: false,
      difficulty: 'hard',
      category: 'Evening Routine'
    },
    {
      id: "5",
      title: "Nature Walk",
      description: "30-minute walk outdoors without phone or earbuds",
      karmaReward: 18,
      completed: false,
      difficulty: 'medium',
      category: 'Physical Activity'
    },
    {
      id: "6",
      title: "Analog Hobby Time",
      description: "Engage in a non-digital hobby for 45 minutes",
      karmaReward: 15,
      completed: false,
      difficulty: 'medium',
      category: 'Creative'
    }
  ]);

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newCompleted = !task.completed;
        if (newCompleted) {
          toast({
            title: "Task Completed! 🎉",
            description: `You earned ${task.karmaReward} karma points!`,
          });
        }
        return { ...task, completed: newCompleted };
      }
      return task;
    }));
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalKarma = tasks.filter(task => task.completed).reduce((sum, task) => sum + task.karmaReward, 0);
  const progressPercentage = (completedTasks / tasks.length) * 100;

  const categories = [...new Set(tasks.map(task => task.category))];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar Navigation */}
            <div className="col-span-12 lg:col-span-3">
              <Navigation />
            </div>

            {/* Main Content */}
            <div className="col-span-12 lg:col-span-9 space-y-6">
              {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Detox Planner</h1>
              <p className="text-muted-foreground">
                Build mindful habits with offline activities that boost your karma
              </p>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 shadow-card">
                <div className="flex items-center gap-3">
                  <Target className="w-8 h-8 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{completedTasks}/{tasks.length}</div>
                    <div className="text-sm text-muted-foreground">Tasks Completed</div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 shadow-card">
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-accent" />
                  <div>
                    <div className="text-2xl font-bold text-accent">{totalKarma}</div>
                    <div className="text-sm text-muted-foreground">Karma Earned Today</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-card">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Daily Progress</span>
                    <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              </Card>
            </div>

            {/* Task Categories */}
            <div className="space-y-6">
              {categories.map(category => {
                const categoryTasks = tasks.filter(task => task.category === category);
                const completedInCategory = categoryTasks.filter(task => task.completed).length;
                
                return (
                  <Card key={category} className="p-6 shadow-card">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{category}</h3>
                        <Badge variant="outline">
                          {completedInCategory}/{categoryTasks.length} complete
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        {categoryTasks.map(task => (
                          <DetoxTask
                            key={task.id}
                            {...task}
                            onToggle={toggleTask}
                          />
                        ))}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Add Custom Task */}
            <Card className="p-6 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Create Custom Task</h3>
                  <p className="text-sm text-muted-foreground">
                    Add your own mindful activities to the planner
                  </p>
                </div>
                <Button variant="outline">
                  <Plus className="w-4 h-4" />
                  Add Task
                </Button>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6 shadow-card bg-gradient-to-r from-muted/30 to-muted/10">
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Daily Detox Tips
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div>• Start with easier tasks to build momentum</div>
                    <div>• Schedule tasks at consistent times daily</div>
                    <div>• Use airplane mode for better focus</div>
                  </div>
                  <div className="space-y-2">
                    <div>• Combine tasks with existing habits</div>
                    <div>• Track your mood before and after tasks</div>
                    <div>• Celebrate small wins along the way</div>
                  </div>
                </div>
              </div>
            </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DetoxPlanner;
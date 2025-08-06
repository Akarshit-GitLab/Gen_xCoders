import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { KarmaScore } from "@/components/KarmaScore";
import { AICoachPanel } from "@/components/AICoachPanel";
import { ProgressChart } from "@/components/ProgressChart";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Smartphone, Monitor, Coffee } from "lucide-react";

const Dashboard = () => {
  // Mock data - in real app this would come from API/Chrome extension
  const [karmaData] = useState({
    score: 78,
    level: "Mindful Warrior",
    streak: 12
  });

  const [progressData] = useState([
    { day: "Mon", karma: 65, screenTime: 8.2 },
    { day: "Tue", karma: 72, screenTime: 7.1 },
    { day: "Wed", karma: 69, screenTime: 7.8 },
    { day: "Thu", karma: 81, screenTime: 5.9 },
    { day: "Fri", karma: 78, screenTime: 6.5 },
    { day: "Sat", karma: 85, screenTime: 4.2 },
    { day: "Sun", karma: 78, screenTime: 5.8 }
  ]);

  const [aiSuggestions] = useState([
    {
      type: "encouragement" as const,
      message: "Great job maintaining your 12-day streak! Your screen time is 23% lower than last week.",
      action: "View detailed stats"
    },
    {
      type: "nudge" as const,
      message: "You've been on social media for 45 minutes. Consider taking a 10-minute walk to refresh your mind.",
      action: "Start break timer"
    },
    {
      type: "warning" as const,
      message: "Your evening screen time has increased. Try reading or meditation before bed for better sleep.",
      action: "Set bedtime reminder"
    }
  ]);

  const todayStats = [
    { icon: <Clock className="w-5 h-5" />, label: "Total Screen Time", value: "5h 23m", change: "-18%" },
    { icon: <Smartphone className="w-5 h-5" />, label: "Phone Pickups", value: "47", change: "-12%" },
    { icon: <Monitor className="w-5 h-5" />, label: "Productive Time", value: "3h 45m", change: "+25%" },
    { icon: <Coffee className="w-5 h-5" />, label: "Break Time", value: "1h 12m", change: "+8%" }
  ];

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
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Track your digital wellness journey and get AI-powered insights
              </p>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {todayStats.map((stat, index) => (
                <Card key={index} className="p-4 shadow-card">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {stat.icon}
                        <span className="text-sm">{stat.label}</span>
                      </div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </div>
                    <Badge 
                      variant={stat.change.startsWith('+') ? "default" : "secondary"}
                      className="ml-2"
                    >
                      {stat.change}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Karma Score */}
              <div className="lg:col-span-1">
                <KarmaScore />
              </div>

              {/* Progress Chart */}
              <div className="lg:col-span-2">
                <ProgressChart data={progressData} />
              </div>
            </div>

            {/* AI Coach Panel */}
            <div className="grid grid-cols-1">
              <AICoachPanel suggestions={aiSuggestions} />
            </div>

            {/* Quick Actions */}
            <Card className="p-6 shadow-card">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center hover:shadow-lg transition-all cursor-pointer">
                  <div className="text-2xl mb-2">🧘</div>
                  <div className="text-sm font-medium">Start Meditation</div>
                </Card>
                <Card className="p-4 text-center hover:shadow-lg transition-all cursor-pointer">
                  <div className="text-2xl mb-2">📖</div>
                  <div className="text-sm font-medium">Reading Time</div>
                </Card>
                <Card className="p-4 text-center hover:shadow-lg transition-all cursor-pointer">
                  <div className="text-2xl mb-2">🚶</div>
                  <div className="text-sm font-medium">Take a Walk</div>
                </Card>
                <Card className="p-4 text-center hover:shadow-lg transition-all cursor-pointer">
                  <div className="text-2xl mb-2">💤</div>
                  <div className="text-sm font-medium">Sleep Mode</div>
                </Card>
              </div>
            </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
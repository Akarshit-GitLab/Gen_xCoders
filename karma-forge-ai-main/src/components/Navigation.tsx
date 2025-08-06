import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, BarChart3, Calendar, LogOut, Brain } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/dashboard", icon: BarChart3, label: "Dashboard" },
    { path: "/detox", icon: Calendar, label: "Detox Planner" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4 shadow-card">
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <Brain className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
            HabitForge
          </span>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => navigate(item.path)}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="pt-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </Card>
  );
};
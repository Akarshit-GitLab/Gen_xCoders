import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Target, Zap, Shield, Chrome } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/hero-wellness.jpg";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Karma Coach",
      description: "Get personalized, ethical nudges powered by GPT-4 to build healthier digital habits"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Real-time Tracking",
      description: "Chrome extension monitors your digital behavior and provides contextual insights"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Gamified Progress",
      description: "Earn karma points for positive actions and track your journey to digital wellness"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Mindful Detox",
      description: "Structured offline activities to help you disconnect and recharge mindfully"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 relative overflow-hidden">
      {/* Hero Background Image */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src={heroImage} 
          alt="Digital wellness illustration" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative z-10">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Brain className="w-12 h-12 text-primary" />
              <h1 className="text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                HabitForge
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your AI-powered companion for breaking tech addiction and building mindful digital habits
            </p>
            <p className="text-lg text-foreground">
              Transform screen time into meaningful time with ethical AI coaching and gamified progress tracking
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              onClick={() => navigate(user ? "/dashboard" : "/auth")}
              className="text-lg"
            >
              <Zap className="w-5 h-5" />
              {user ? "Go to Dashboard" : "Start Your Journey"}
            </Button>
            <Button 
              variant="outline" 
              className="text-lg px-8 py-6"
            >
              <Chrome className="w-5 h-5" />
              Install Extension
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center space-y-4 shadow-card hover:shadow-lg transition-all">
              <div className="flex justify-center text-primary">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8 text-center space-y-2 shadow-karma">
            <div className="text-4xl font-bold text-primary">73%</div>
            <div className="text-muted-foreground">Less screen time after 30 days</div>
          </Card>
          <Card className="p-8 text-center space-y-2 shadow-karma">
            <div className="text-4xl font-bold text-secondary">4.8</div>
            <div className="text-muted-foreground">Average karma improvement</div>
          </Card>
          <Card className="p-8 text-center space-y-2 shadow-karma">
            <div className="text-4xl font-bold text-accent">12K+</div>
            <div className="text-muted-foreground">Users building better habits</div>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="p-8 bg-gradient-karma shadow-karma">
            <div className="space-y-4 text-primary-foreground">
              <h2 className="text-2xl font-bold">Ready to Transform Your Digital Life?</h2>
              <p className="text-primary-foreground/90">
                Join thousands of users who've reclaimed their time and built healthier relationships with technology
              </p>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => navigate(user ? "/dashboard" : "/auth")}
              >
                {user ? "Go to Dashboard" : "Get Started Now"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Home;
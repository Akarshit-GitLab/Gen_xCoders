import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressData {
  day: string;
  karma: number;
  screenTime: number;
}

interface ProgressChartProps {
  data: ProgressData[];
}

export const ProgressChart = ({ data }: ProgressChartProps) => {
  return (
    <Card className="p-6 shadow-card">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Progress Overview</h3>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="karma" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                name="Karma Score"
              />
              <Line 
                type="monotone" 
                dataKey="screenTime" 
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 3 }}
                name="Screen Time (hours)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>Karma Score</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span>Screen Time</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
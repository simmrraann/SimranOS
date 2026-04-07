import {
  useGetWeeklyPerformance,
  useGetTaskDistribution,
  useListGoals,
} from "@/hooks/useSupabaseQueries";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart2, TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const PIE_COLORS = ["hsl(258, 58%, 62%)", "hsl(172, 50%, 45%)", "hsl(340, 60%, 65%)", "hsl(35, 75%, 55%)"];

export default function Analytics() {
  const { data: weekly, isLoading: loadingWeekly } = useGetWeeklyPerformance();
  const { data: distribution, isLoading: loadingDist } = useGetTaskDistribution();
  const { data: goals, isLoading: loadingGoals } = useListGoals();

  const goalTrendData = goals?.map((goal) => ({
    name: goal.title.slice(0, 15) + (goal.title.length > 15 ? "…" : ""),
    progress: goal.target > 0 ? Math.round((goal.progress / goal.target) * 100) : 0,
  })) ?? [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <BarChart2 className="w-6 h-6 text-primary" />
          </div>
          Analytics
        </h1>
        <p className="text-muted-foreground mt-1">Understand your productivity patterns ✨</p>
      </header>

      {/* Weekly Performance */}
      <Card className="glass-card border-border/50 soft-shadow">
        <CardContent className="p-6">
          <h2 className="text-base font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Weekly Performance
          </h2>
          {loadingWeekly ? (
            <Skeleton className="h-56 w-full rounded-xl" />
          ) : weekly && weekly.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weekly} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 20%, 92%)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(260, 10%, 50%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(260, 10%, 50%)" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255,255,255,0.9)",
                    border: "1px solid hsl(270, 20%, 92%)",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    backdropFilter: "blur(8px)",
                  }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Bar dataKey="tasksCompleted" name="Tasks" fill="hsl(258, 58%, 62%)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="habitsCompleted" name="Habits" fill="hsl(340, 60%, 65%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-16">
              <TrendingUp className="w-8 h-8 mx-auto text-primary/30 mb-2" />
              <p className="text-sm text-muted-foreground">No performance data yet ✨</p>
              <p className="text-xs text-muted-foreground mt-1">Complete some tasks and habits to see your chart</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Task Distribution */}
        <Card className="glass-card border-border/50 soft-shadow">
          <CardContent className="p-6">
            <h2 className="text-base font-semibold mb-6 flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-accent" />
              Task Distribution
            </h2>
            {loadingDist ? (
              <Skeleton className="h-48 w-full rounded-xl" />
            ) : distribution && distribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={distribution.map(d => ({ ...d, name: d.category }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    dataKey="count"
                    paddingAngle={3}
                  >
                    {distribution.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend
                    formatter={(value) => <span style={{ fontSize: 12, color: "hsl(260, 10%, 50%)" }}>{value}</span>}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255,255,255,0.9)",
                      border: "1px solid hsl(270, 20%, 92%)",
                      borderRadius: "12px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12">
                <PieChartIcon className="w-8 h-8 mx-auto text-accent/30 mb-2" />
                <p className="text-sm text-muted-foreground">No task data yet ✨</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Goal Progress */}
        <Card className="glass-card border-border/50 soft-shadow">
          <CardContent className="p-6">
            <h2 className="text-base font-semibold mb-6 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-secondary" />
              Goal Progress
            </h2>
            {loadingGoals ? (
              <Skeleton className="h-48 w-full rounded-xl" />
            ) : goalTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={goalTrendData.slice(0, 6)} layout="vertical" barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 20%, 92%)" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(260, 10%, 50%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(260, 10%, 50%)" }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255,255,255,0.9)",
                      border: "1px solid hsl(270, 20%, 92%)",
                      borderRadius: "12px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    }}
                    formatter={(v) => [`${v}%`, "Progress"]}
                  />
                  <Bar dataKey="progress" fill="hsl(172, 50%, 45%)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12">
                <BarChart2 className="w-8 h-8 mx-auto text-secondary/30 mb-2" />
                <p className="text-sm text-muted-foreground">No goals to visualize yet ✨</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

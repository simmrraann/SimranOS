import {
  useGetWeeklyPerformance,
  useGetTaskDistribution,
  useListGoals,
} from "@/hooks/useSupabaseQueries";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart2, Sparkles } from "lucide-react";
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

const PIE_COLORS = ["#8B78E6", "#E07BA0", "#4AADE0", "#5CB87A", "#E6A14A"];

export default function Analytics() {
  const { data: weekly, isLoading: loadingWeekly } = useGetWeeklyPerformance();
  const { data: distribution, isLoading: loadingDist } = useGetTaskDistribution();
  const { data: goals, isLoading: loadingGoals } = useListGoals();

  const goalTrendData =
    goals?.slice(0, 8).map((goal) => ({
      name: goal.title.slice(0, 12) + (goal.title.length > 12 ? "…" : ""),
      progress: goal.target > 0 ? Math.round((goal.progress / goal.target) * 100) : 0,
    })) ?? [];

  const hasData = (weekly && weekly.length > 0) || (distribution && distribution.length > 0) || (goals && goals.length > 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BarChart2 className="w-7 h-7 text-accent" />
          Analytics
        </h1>
        <p className="text-muted-foreground mt-1">Understand your productivity patterns</p>
      </header>

      {!hasData && !loadingWeekly && !loadingDist && !loadingGoals ? (
        <Card className="glass-card border-accent/10 glow-blue">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-5 animate-float">
              <Sparkles className="w-10 h-10 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No analytics data yet ✨</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              Start completing tasks and habits to see your productivity patterns here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Weekly Performance Bar Chart */}
          <Card className="bg-white/70 backdrop-blur-sm border-border/50 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-base font-semibold mb-6">Weekly Performance</h2>
              {loadingWeekly ? (
                <Skeleton className="h-56 w-full rounded-xl" />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={weekly ?? []} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(250 20% 92%)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#888" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#888" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#fff",
                        border: "1px solid hsl(250 20% 92%)",
                        borderRadius: "12px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                      }}
                      labelStyle={{ fontWeight: 600 }}
                    />
                    <Bar dataKey="tasksCompleted" name="Tasks" fill="#8B78E6" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="habitsCompleted" name="Habits" fill="#E07BA0" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Task Distribution Pie Chart */}
            <Card className="bg-white/70 backdrop-blur-sm border-border/50 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-base font-semibold mb-6">Task Distribution</h2>
                {loadingDist ? (
                  <Skeleton className="h-48 w-full rounded-xl" />
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={distribution?.map((d) => ({ ...d, name: d.category })) ?? []}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        dataKey="count"
                        paddingAngle={3}
                      >
                        {distribution?.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend formatter={(value) => <span style={{ fontSize: 12, color: "#888" }}>{value}</span>} />
                      <Tooltip
                        contentStyle={{
                          background: "#fff",
                          border: "1px solid hsl(250 20% 92%)",
                          borderRadius: "12px",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Goal Progress Bar Chart */}
            <Card className="bg-white/70 backdrop-blur-sm border-border/50 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-base font-semibold mb-6">Goal Progress</h2>
                {loadingGoals ? (
                  <Skeleton className="h-48 w-full rounded-xl" />
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={goalTrendData} layout="vertical" barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(250 20% 92%)" horizontal={false} />
                      <XAxis
                        type="number"
                        domain={[0, 100]}
                        tick={{ fontSize: 11, fill: "#888" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 11, fill: "#888" }}
                        axisLine={false}
                        tickLine={false}
                        width={90}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#fff",
                          border: "1px solid hsl(250 20% 92%)",
                          borderRadius: "12px",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                        }}
                        formatter={(v) => [`${v}%`, "Progress"]}
                      />
                      <Bar dataKey="progress" fill="#4AADE0" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

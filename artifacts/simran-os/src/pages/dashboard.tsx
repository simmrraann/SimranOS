import { useQueryClient } from "@tanstack/react-query";
import {
  useGetDashboardSummary,
  useListTasks,
  useListHabits,
  useListGoals,
  useGetWeeklyPerformance,
  useUpdateTask,
  useToggleHabit,
  getListTasksQueryKey,
  getListHabitsQueryKey,
  getGetDashboardSummaryQueryKey,
} from "@/hooks/useSupabaseQueries";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { CheckSquare, Zap, Target, TrendingUp, Flame } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function StatCard({ title, value, icon: Icon, loading }: { title: string; value?: string; icon: React.ElementType; loading: boolean }) {
  return (
    <Card className="border-[#e8e6df] shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
        </div>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <p className="text-3xl font-bold text-foreground">{value ?? "—"}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const queryClient = useQueryClient();

  const { data: summary, isLoading: loadingSummary } = useGetDashboardSummary();
  const { data: tasks, isLoading: loadingTasks } = useListTasks({ category: "today" });
  const { data: habits, isLoading: loadingHabits } = useListHabits();
  const { data: goals, isLoading: loadingGoals } = useListGoals();
  const { data: weekly, isLoading: loadingWeekly } = useGetWeeklyPerformance();

  const updateTask = useUpdateTask();
  const toggleHabit = useToggleHabit();

  const handleTaskToggle = async (id: number, completed: boolean) => {
    await updateTask.mutateAsync({ id, data: { completed: !completed } });
    queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
  };

  const handleHabitToggle = async (id: number) => {
    await toggleHabit.mutateAsync({ id });
    queryClient.invalidateQueries({ queryKey: getListHabitsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <p className="text-muted-foreground text-sm">{format(new Date(), "EEEE, MMMM do, yyyy")}</p>
        <h1 className="text-4xl font-bold mt-1">{greeting()}, Simran.</h1>
        <p className="text-muted-foreground mt-2 text-sm">Here's your life at a glance today.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Tasks Completed"
          value={summary ? `${summary.tasksCompleted}/${summary.tasksTotal}` : undefined}
          icon={CheckSquare}
          loading={loadingSummary}
        />
        <StatCard
          title="Habits Done"
          value={summary ? `${summary.habitsCompletedToday}/${summary.habitsTotal}` : undefined}
          icon={Zap}
          loading={loadingSummary}
        />
        <StatCard
          title="Goal Progress"
          value={summary ? `${summary.goalsAvgProgress}%` : undefined}
          icon={Target}
          loading={loadingSummary}
        />
        <StatCard
          title="Revenue (INR)"
          value={summary ? `₹${summary.totalRevenue.toLocaleString()}` : undefined}
          icon={TrendingUp}
          loading={loadingSummary}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <Card className="border-[#e8e6df] shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-base font-semibold mb-4">Today's Tasks</h2>
            {loadingTasks ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full rounded-lg" />)}
              </div>
            ) : (
              <div className="space-y-2">
                {tasks?.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-black/[0.02] transition-all"
                    data-testid={`dashboard-task-${task.id}`}
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleTaskToggle(task.id, task.completed)}
                      className="border-[#e8e6df] data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      data-testid={`dashboard-checkbox-${task.id}`}
                    />
                    <span className={`text-sm flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                      {task.title}
                    </span>
                  </div>
                ))}
                {!tasks?.length && (
                  <p className="text-sm text-muted-foreground py-4 text-center">No tasks for today. Enjoy your day!</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Habits */}
        <Card className="border-[#e8e6df] shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-base font-semibold mb-4">Habits</h2>
            {loadingHabits ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
              </div>
            ) : (
              <div className="space-y-2">
                {habits?.slice(0, 5).map((habit) => (
                  <div
                    key={habit.id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${habit.completedToday ? "bg-primary/5" : "hover:bg-black/[0.02]"}`}
                    data-testid={`dashboard-habit-${habit.id}`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${habit.completedToday ? "bg-primary/20" : "bg-[#f5f4f0]"}`}>
                      <Zap className={`w-3.5 h-3.5 ${habit.completedToday ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <span className="text-sm flex-1 font-medium">{habit.name}</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mr-2">
                      <Flame className="w-3 h-3 text-orange-400" />
                      {habit.streak}
                    </div>
                    <Switch
                      checked={habit.completedToday}
                      onCheckedChange={() => handleHabitToggle(habit.id)}
                      className="data-[state=checked]:bg-primary"
                      data-testid={`dashboard-habit-switch-${habit.id}`}
                    />
                  </div>
                ))}
                {!habits?.length && (
                  <p className="text-sm text-muted-foreground py-4 text-center">No habits yet</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Goals Progress */}
        <Card className="border-[#e8e6df] shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-base font-semibold mb-4">Goal Progress</h2>
            {loadingGoals ? (
              <div className="space-y-4">
                {[1, 2].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
              </div>
            ) : (
              <div className="space-y-4">
                {goals?.slice(0, 4).map((goal) => {
                  const pct = goal.target > 0 ? Math.min(100, Math.round((goal.progress / goal.target) * 100)) : 0;
                  return (
                    <div key={goal.id} data-testid={`dashboard-goal-${goal.id}`}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-medium truncate max-w-[70%]">{goal.title}</span>
                        <span className="text-sm font-bold text-primary">{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-2 bg-[#e8e6df]" />
                    </div>
                  );
                })}
                {!goals?.length && (
                  <p className="text-sm text-muted-foreground py-4 text-center">No goals set yet</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Chart */}
        <Card className="border-[#e8e6df] shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-base font-semibold mb-4">Weekly Performance</h2>
            {loadingWeekly ? (
              <Skeleton className="h-40 w-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={weekly ?? []} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8e6df" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#666" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#666" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#fff", border: "1px solid #e8e6df", borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
                    labelStyle={{ fontWeight: 600 }}
                  />
                  <Bar dataKey="tasksCompleted" name="Tasks" fill="#7CFC00" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="habitsCompleted" name="Habits" fill="#e8e6df" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

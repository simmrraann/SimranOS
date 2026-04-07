import { useListHabits, useToggleHabit } from "@/hooks/useSupabaseQueries";
import { Zap, Clock, Flame, CheckCircle2, Circle, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

export default function Habits() {
  const queryClient = useQueryClient();
  const { data: habits, isLoading } = useListHabits();
  const toggleHabit = useToggleHabit();

  if (isLoading || !habits) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Daily Rituals</h1>
          <p className="text-muted-foreground">Building the foundation for success</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const nonNegotiables = habits.filter((h) => h.type === "non_negotiable");
  const scheduled = habits.filter((h) => h.type === "scheduled");

  const completedCount = habits.filter((h) => h.completed_today).length;
  const totalCount = habits.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggle = (id: number) => {
    toggleHabit.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["habits"] });
        },
      }
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <Zap className="h-8 w-8 text-secondary" />
          Daily Rituals
        </h1>
        <p className="text-muted-foreground text-lg">Your foundation to becoming a millionaire by 21.</p>
      </div>

      {/* Progress */}
      <Card className="glass-card border-secondary/10 glow-pink">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-foreground">Rituals Completed</span>
            <span className="text-sm font-bold text-secondary">{progress}%</span>
          </div>
          <div className="h-2.5 bg-secondary/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{completedCount} of {totalCount} rituals done today</p>
        </CardContent>
      </Card>

      {habits.length === 0 ? (
        <Card className="glass-card border-secondary/10">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mb-5 animate-float">
              <Sparkles className="w-10 h-10 text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No habits yet ✨</h3>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
              Build your daily ritual stack. Consistency is the key to your millionaire journey.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* NON-NEGOTIABLES */}
          <Card className="bg-white/70 backdrop-blur-sm border-l-4 border-l-secondary shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4 border-b border-border/30">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Flame className="h-5 w-5 text-secondary" />
                Non-Negotiables
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {nonNegotiables.map((habit) => (
                  <div
                    key={habit.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                      habit.completed_today
                        ? "bg-secondary/5 border-secondary/20"
                        : "bg-white/50 border-border/30 hover:bg-secondary/5 hover:border-secondary/20"
                    }`}
                    onClick={() => handleToggle(habit.id)}
                  >
                    <div className="flex items-center gap-4">
                      <button className="focus:outline-none">
                        {habit.completed_today ? (
                          <CheckCircle2 className="h-6 w-6 text-secondary" />
                        ) : (
                          <Circle className="h-6 w-6 text-muted-foreground/30" />
                        )}
                      </button>
                      <span className={`font-medium text-sm ${habit.completed_today ? "text-muted-foreground line-through" : "text-foreground"}`}>
                        {habit.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold">
                      <Flame className="h-3 w-3" />
                      {habit.streak}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* DAILY SCHEDULE */}
          <Card className="bg-white/70 backdrop-blur-sm border-l-4 border-l-accent shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4 border-b border-border/30">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Clock className="h-5 w-5 text-accent" />
                Daily Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-2">
                {scheduled.map((habit) => (
                  <div
                    key={habit.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                      habit.completed_today
                        ? "bg-accent/5 border-accent/20"
                        : "bg-white/50 border-border/30 hover:bg-accent/5 hover:border-accent/20"
                    }`}
                    onClick={() => handleToggle(habit.id)}
                  >
                    <div className="shrink-0">
                      {habit.completed_today ? (
                        <CheckCircle2 className="h-5 w-5 text-accent" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground/30" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold text-accent tracking-wider uppercase">
                        {habit.time_label}
                      </div>
                      <div className={`text-sm font-medium ${habit.completed_today ? "text-muted-foreground line-through" : "text-foreground"}`}>
                        {habit.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

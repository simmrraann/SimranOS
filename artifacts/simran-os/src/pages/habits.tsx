import { useListHabits, useToggleHabit } from "@/hooks/useSupabaseQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Zap, Clock, Flame, CheckCircle2, Circle, Sparkles, Heart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Habits() {
  const queryClient = useQueryClient();
  const { data: habits, isLoading } = useListHabits();
  const toggleHabit = useToggleHabit();

  if (isLoading || !habits) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Daily Rituals</h1>
          <p className="text-muted-foreground">Loading your rituals...</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const nonNegotiables = habits.filter(h => h.type === 'non_negotiable');
  const scheduled = habits.filter(h => h.type === 'scheduled');
  const completedCount = habits.filter(h => h.completed_today).length;
  const totalCount = habits.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggle = (id: number) => {
    toggleHabit.mutate({ id }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent/10">
            <Zap className="w-6 h-6 text-accent" />
          </div>
          Daily Rituals
        </h1>
        <p className="text-muted-foreground text-base mt-1">Your foundation to becoming a millionaire by 21 ✨</p>
      </header>

      {/* Progress */}
      <Card className="glass-card border-accent/10 soft-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -mr-16 -mt-16" />
        <CardContent className="p-6 relative z-10">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Heart className="w-4 h-4 text-accent" />
              Today's Rituals
            </span>
            <span className="text-sm font-bold text-accent">{progressPct}%</span>
          </div>
          <div className="h-3 rounded-full bg-accent/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{completedCount} of {totalCount} rituals completed</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* NON-NEGOTIABLES */}
        <Card className="glass-card border-l-4 border-l-accent soft-shadow">
          <CardHeader className="pb-4 border-b border-border/50">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Flame className="h-5 w-5 text-accent" />
              Non-Negotiables
              <span className="ml-auto text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded-full">
                {nonNegotiables.filter(h => h.completed_today).length}/{nonNegotiables.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {nonNegotiables.length > 0 ? (
              <div className="space-y-2">
                {nonNegotiables.map(habit => (
                  <div
                    key={habit.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer group ${
                      habit.completed_today
                        ? "bg-accent/5 border-accent/20"
                        : "border-border/50 bg-white/40 hover:bg-white/70 hover:border-accent/10"
                    }`}
                    onClick={() => handleToggle(habit.id)}
                  >
                    <div className="flex items-center gap-4">
                      {habit.completed_today ? (
                        <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground/30 shrink-0 group-hover:text-accent/30 transition-colors" />
                      )}
                      <span className={`font-medium text-sm ${habit.completed_today ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                        {habit.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold">
                      <Flame className="h-3 w-3" />
                      {habit.streak}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Flame className="w-8 h-8 mx-auto text-accent/30 mb-2" />
                <p className="text-sm text-muted-foreground">No non-negotiables yet ✨</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* DAILY SCHEDULE */}
        <Card className="glass-card border-l-4 border-l-secondary soft-shadow">
          <CardHeader className="pb-4 border-b border-border/50">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-secondary" />
              Daily Schedule
              <span className="ml-auto text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-full">
                {scheduled.filter(h => h.completed_today).length}/{scheduled.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {scheduled.length > 0 ? (
              <div className="space-y-1.5">
                {scheduled.map((habit) => (
                  <div
                    key={habit.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${
                      habit.completed_today
                        ? "bg-secondary/5 border-secondary/20"
                        : "border-border/50 bg-white/40 hover:bg-white/70 hover:border-secondary/10"
                    }`}
                    onClick={() => handleToggle(habit.id)}
                  >
                    {habit.completed_today ? (
                      <CheckCircle2 className="h-4 w-4 text-secondary shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground/30 shrink-0 group-hover:text-secondary/30 transition-colors" />
                    )}
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm font-medium ${habit.completed_today ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                        {habit.name}
                      </span>
                    </div>
                    {habit.time_label && (
                      <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider">
                        {habit.time_label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-8 h-8 mx-auto text-secondary/30 mb-2" />
                <p className="text-sm text-muted-foreground">No schedule items yet ✨</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useListGoals, useUpdateGoal } from "@/hooks/useSupabaseQueries";
import { Target, TrendingUp, Users, Plane, CheckCircle2, Circle, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Goals() {
  const { data: goals, isLoading } = useListGoals();
  const updateGoal = useUpdateGoal();

  if (isLoading || !goals) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Milestones</h1>
          <p className="text-muted-foreground">Tracking the journey to ₹2 Lakh</p>
        </div>
        <div className="grid gap-6">
          <Skeleton className="h-64 rounded-2xl w-full" />
        </div>
      </div>
    );
  }

  const moneyGoals = goals.filter((g) => g.category === "money" && g.is_milestone).sort((a, b) => a.id - b.id);
  const socialGoals = goals.filter((g) => g.category === "social").sort((a, b) => a.id - b.id);
  const travelGoals = goals.filter((g) => g.category === "travel").sort((a, b) => a.id - b.id);
  const bankGoal = goals.find((g) => g.category === "money" && !g.is_milestone);

  const toggleMilestone = (goal: any) => {
    const newStatus = goal.status === "achieved" ? "pending" : "achieved";
    const newProgress = newStatus === "achieved" ? goal.target : 0;
    updateGoal.mutate({ id: goal.id, data: { status: newStatus, progress: newProgress } });
  };

  const calculateProgress = (goal: any) => {
    if (goal.target === 0) return 0;
    return Math.min(100, Math.round((Number(goal.progress) / Number(goal.target)) * 100));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <Target className="h-8 w-8 text-primary" />
          Milestones & Targets
        </h1>
        <p className="text-muted-foreground text-lg">Measurable steps toward the June vision.</p>
      </div>

      {goals.length === 0 ? (
        <Card className="glass-card border-primary/10 glow-primary">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-5 animate-float">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No goals yet ✨</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              Your milestones will appear here once you add them in Supabase. Dream big!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* MONEY MILESTONES */}
          <Card className="bg-white/70 backdrop-blur-sm border-l-4 border-l-primary shadow-sm h-full">
            <CardHeader className="pb-4 border-b border-border/30">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xl">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Money Goals (Jan - June)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-3 mb-6">
                {moneyGoals.map((goal) => {
                  const isAchieved = goal.status === "achieved";
                  return (
                    <div
                      key={goal.id}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                        isAchieved
                          ? "bg-primary/5 border-primary/20"
                          : "bg-white/50 border-border/30 hover:border-primary/20 hover:bg-primary/5"
                      }`}
                      onClick={() => toggleMilestone(goal)}
                    >
                      {isAchieved ? (
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground/30 shrink-0" />
                      )}
                      <span className={`text-sm font-semibold truncate ${isAchieved ? "text-primary" : "text-foreground"}`}>
                        {goal.title}
                      </span>
                    </div>
                  );
                })}
              </div>

              {bankGoal && (
                <div className="mt-8 pt-6 border-t border-border/30 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">Bank Balance Target (June)</span>
                    <span className="text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">₹2.50 Lakh</span>
                  </div>
                  <div className="h-2.5 bg-primary/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                      style={{ width: `${calculateProgress(bankGoal)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-right">{calculateProgress(bankGoal)}% (35% savings goal)</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            {/* SOCIAL MEDIA GOALS */}
            <Card className="bg-white/70 backdrop-blur-sm border-l-4 border-l-secondary shadow-sm">
              <CardHeader className="pb-4 border-b border-border/30">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Users className="h-5 w-5 text-secondary" />
                  Social Media Targets
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                {socialGoals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>{goal.title}</span>
                      <span className="text-muted-foreground">
                        {Number(goal.progress).toLocaleString()} / {Number(goal.target).toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-secondary/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-500"
                        style={{ width: `${calculateProgress(goal)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* TRAVEL UNLOCKS */}
            <Card className="bg-white/70 backdrop-blur-sm border-l-4 border-l-amber-400 shadow-sm relative overflow-hidden">
              <div className="absolute opacity-5 -bottom-10 -right-10 pointer-events-none">
                <Plane className="w-48 h-48" />
              </div>
              <CardHeader className="pb-4 border-b border-border/30">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Plane className="h-5 w-5 text-amber-500" />
                  Travel Unlocks
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3 relative z-10">
                {travelGoals.map((goal) => (
                  <div key={goal.id} className="flex items-center justify-between p-3 rounded-xl border border-border/30 bg-white/50">
                    <div className="font-semibold text-foreground flex items-center gap-2">{goal.title}</div>
                    <div className="text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                      Unlock at ₹{Number(goal.target).toLocaleString()}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

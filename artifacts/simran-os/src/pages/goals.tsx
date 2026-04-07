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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Milestones</h1>
          <p className="text-muted-foreground">Loading your targets...</p>
        </div>
        <div className="grid gap-6">
          <Skeleton className="h-64 rounded-2xl w-full" />
        </div>
      </div>
    );
  }

  const moneyGoals = goals.filter(g => g.category === 'money' && g.is_milestone).sort((a, b) => a.id - b.id);
  const socialGoals = goals.filter(g => g.category === 'social').sort((a, b) => a.id - b.id);
  const travelGoals = goals.filter(g => g.category === 'travel').sort((a, b) => a.id - b.id);
  const bankGoal = goals.find(g => g.category === 'money' && !g.is_milestone);

  const toggleMilestone = (goal: any) => {
    const newStatus = goal.status === 'achieved' ? 'pending' : 'achieved';
    const newProgress = newStatus === 'achieved' ? goal.target : 0;
    updateGoal.mutate({ id: goal.id, data: { status: newStatus, progress: newProgress } });
  };

  const calculateProgress = (goal: any) => {
    if (goal.target === 0) return 0;
    return Math.min(100, Math.round((Number(goal.progress) / Number(goal.target)) * 100));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Target className="w-6 h-6 text-primary" />
          </div>
          Milestones & Targets
        </h1>
        <p className="text-muted-foreground text-base mt-1">Measurable steps toward the June vision ✨</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* MONEY MILESTONES */}
        <Card className="glass-card border-l-4 border-l-primary soft-shadow h-full">
          <CardHeader className="pb-4 border-b border-border/50">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                Money Goals
              </span>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                {moneyGoals.filter(g => g.status === 'achieved').length}/{moneyGoals.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {moneyGoals.length > 0 ? (
              <div className="grid grid-cols-2 gap-2.5 mb-6">
                {moneyGoals.map(goal => {
                  const isAchieved = goal.status === 'achieved';
                  return (
                    <div
                      key={goal.id}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isAchieved
                          ? 'bg-primary/5 border-primary/20'
                          : 'bg-white/40 border-border/50 hover:border-primary/10 hover:bg-white/70'
                      }`}
                      onClick={() => toggleMilestone(goal)}
                    >
                      {isAchieved ? (
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground/20 shrink-0" />
                      )}
                      <span className={`text-sm font-semibold truncate ${isAchieved ? 'text-primary' : 'text-foreground'}`}>
                        {goal.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10">
                <TrendingUp className="w-8 h-8 mx-auto text-primary/30 mb-2" />
                <p className="text-sm text-muted-foreground">No money goals yet ✨</p>
              </div>
            )}

            {bankGoal && (
              <div className="pt-6 border-t border-border/50 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground text-sm">Bank Balance Target (June)</span>
                  <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">₹2.50 Lakh</span>
                </div>
                <div className="h-2.5 rounded-full bg-secondary/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-secondary to-primary transition-all duration-500"
                    style={{ width: `${calculateProgress(bankGoal)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-right">{calculateProgress(bankGoal)}%</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* SOCIAL MEDIA */}
          <Card className="glass-card border-l-4 border-l-accent soft-shadow">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-accent" />
                Social Media Targets
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              {socialGoals.length > 0 ? socialGoals.map(goal => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>{goal.title}</span>
                    <span className="text-muted-foreground">
                      {Number(goal.progress).toLocaleString()} / {Number(goal.target).toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-accent/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
                      style={{ width: `${calculateProgress(goal)}%` }}
                    />
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <Users className="w-8 h-8 mx-auto text-accent/30 mb-2" />
                  <p className="text-sm text-muted-foreground">No social targets yet ✨</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* TRAVEL */}
          <Card className="glass-card border-l-4 border-l-amber-400 soft-shadow relative overflow-hidden">
            <div className="absolute opacity-5 -bottom-10 -right-10 pointer-events-none">
              <Plane className="w-48 h-48" />
            </div>
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Plane className="h-5 w-5 text-amber-500" />
                Travel Unlocks
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3 relative z-10">
              {travelGoals.length > 0 ? travelGoals.map(goal => (
                <div key={goal.id} className="flex items-center justify-between p-3.5 rounded-xl border border-border/50 bg-white/40 hover:bg-white/70 transition-all">
                  <div className="font-semibold text-foreground text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    {goal.title}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 px-3 py-1.5 rounded-full">
                    ₹{Number(goal.target).toLocaleString()}
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <Plane className="w-8 h-8 mx-auto text-amber-400/30 mb-2" />
                  <p className="text-sm text-muted-foreground">No travel unlocks yet ✨</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

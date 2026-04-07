import { useListGoals, useUpdateGoal } from "@/hooks/useSupabaseQueries";
import { Target, TrendingUp, Users, Plane, CheckCircle2, Circle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

export default function Goals() {
  const { data: goals, isLoading } = useListGoals();
  const updateGoal = useUpdateGoal();

  if (isLoading || !goals) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Simran's Milestones</h1>
          <p className="text-muted-foreground">Tracking the journey to ₹2 Lakh</p>
        </div>
        <div className="grid gap-6">
          <Skeleton className="h-64 rounded-xl w-full" />
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <Target className="h-8 w-8 text-primary" />
          Milestones & Targets
        </h1>
        <p className="text-muted-foreground text-lg">Measurable steps toward the June vision.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* MONEY MILESTONES */}
        <Card className="border-l-4 border-l-primary shadow-sm h-full">
          <CardHeader className="pb-4 border-b border-border/50">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xl">
                <TrendingUp className="h-5 w-5 text-primary" />
                Money Goals (Jan - June)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-3 mb-6">
              {moneyGoals.map(goal => {
                const isAchieved = goal.status === 'achieved';
                return (
                  <div 
                    key={goal.id} 
                    className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${isAchieved ? 'bg-primary/5 border-primary/30' : 'bg-card border-border/40 hover:border-primary/20 hover:bg-muted/30'}`}
                    onClick={() => toggleMilestone(goal)}
                  >
                    {isAchieved ? (
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground/30 shrink-0" />
                    )}
                    <span className={`text-sm font-semibold truncate ${isAchieved ? 'text-primary' : 'text-foreground'}`}>
                      {goal.title}
                    </span>
                  </div>
                );
              })}
            </div>

            {bankGoal && (
              <div className="mt-8 pt-6 border-t border-border/50 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Bank Balance Target (June)</span>
                  <span className="text-sm font-bold bg-muted px-2 py-1 rounded">₹2.50 Lakh</span>
                </div>
                <Progress value={calculateProgress(bankGoal)} className="h-2 bg-secondary/20" indicatorColor="bg-secondary" />
                <p className="text-xs text-muted-foreground text-right">{calculateProgress(bankGoal)}% (35% savings goal)</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* SOCIAL MEDIA GOALS */}
          <Card className="border-l-4 border-l-pink-500 shadow-sm">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Users className="h-5 w-5 text-pink-500" />
                Social Media Targets
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {socialGoals.map(goal => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>{goal.title}</span>
                    <span>{Number(goal.progress).toLocaleString()} / {Number(goal.target).toLocaleString()}</span>
                  </div>
                  <Progress value={calculateProgress(goal)} className="h-2 bg-pink-500/20" indicatorColor="bg-pink-500" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* TRAVEL UNLOCKS */}
          <Card className="border-l-4 border-l-amber-500 shadow-sm relative overflow-hidden">
            <div className="absolute opacity-5 -bottom-10 -right-10 pointer-events-none">
              <Plane className="w-48 h-48" />
            </div>
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Plane className="h-5 w-5 text-amber-500" />
                Travel Unlocks (Reward Milestones)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 relative z-10">
              {travelGoals.map(goal => (
                <div key={goal.id} className="flex items-center justify-between p-3 rounded border border-border/40 bg-card">
                  <div className="font-semibold text-foreground flex items-center gap-2">
                    {goal.title}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full">
                    Unlock at ₹{Number(goal.target).toLocaleString()}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

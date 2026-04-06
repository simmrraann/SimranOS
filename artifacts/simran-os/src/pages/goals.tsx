import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListGoals,
  useCreateGoal,
  useUpdateGoal,
  useDeleteGoal,
  getListGoalsQueryKey,
} from "@/hooks/useSupabaseQueries";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Target, Minus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type GoalType = "weekly" | "longterm";

export default function Goals() {
  const queryClient = useQueryClient();
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<GoalType>("longterm");
  const [newTarget, setNewTarget] = useState("100");
  const [newDescription, setNewDescription] = useState("");

  const { data: goals, isLoading } = useListGoals();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();

  const weeklyGoals = goals?.filter((g) => g.type === "weekly") ?? [];
  const longtermGoals = goals?.filter((g) => g.type === "longterm") ?? [];

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    await createGoal.mutateAsync({
      data: {
        title: newTitle.trim(),
        type: newType,
        target: parseInt(newTarget) || 100,
        description: newDescription.trim() || undefined,
      },
    });
    queryClient.invalidateQueries({ queryKey: getListGoalsQueryKey() });
    setNewTitle("");
    setNewDescription("");
    setNewTarget("100");
  };

  const handleProgress = async (id: number, currentProgress: number, delta: number) => {
    const newProgress = Math.max(0, currentProgress + delta);
    await updateGoal.mutateAsync({ id, data: { progress: newProgress } });
    queryClient.invalidateQueries({ queryKey: getListGoalsQueryKey() });
  };

  const handleDelete = async (id: number) => {
    await deleteGoal.mutateAsync({ id });
    queryClient.invalidateQueries({ queryKey: getListGoalsQueryKey() });
  };

  const GoalCard = ({ goal }: { goal: NonNullable<typeof goals>[0] }) => {
    const pct = goal.target > 0 ? Math.min(100, Math.round((goal.progress / goal.target) * 100)) : 0;
    return (
      <div
        data-testid={`goal-item-${goal.id}`}
        className="p-4 rounded-xl border border-[#e8e6df] bg-white hover:border-primary/20 transition-all group"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 mr-4">
            <h3 className="font-medium text-sm">{goal.title}</h3>
            {goal.description && <p className="text-xs text-muted-foreground mt-0.5">{goal.description}</p>}
          </div>
          <button
            onClick={() => handleDelete(goal.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            data-testid={`button-delete-goal-${goal.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <Progress value={pct} className="flex-1 h-2 bg-[#e8e6df]" data-testid={`progress-goal-${goal.id}`} />
          <span className="text-sm font-bold text-primary min-w-[2.5rem] text-right">{pct}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{goal.progress} / {goal.target}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleProgress(goal.id, goal.progress, -1)}
              className="w-7 h-7 rounded-full border border-[#e8e6df] flex items-center justify-center hover:bg-black/5 transition-colors"
              data-testid={`button-progress-dec-${goal.id}`}
            >
              <Minus className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleProgress(goal.id, goal.progress, 1)}
              className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center hover:bg-primary/20 transition-colors"
              data-testid={`button-progress-inc-${goal.id}`}
            >
              <Plus className="w-3 h-3 text-primary" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Target className="w-7 h-7 text-primary" />
          Goals
        </h1>
        <p className="text-muted-foreground mt-1">Vision without action is just a dream</p>
      </header>

      {/* Add Goal */}
      <Card className="border-[#e8e6df] shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-base font-semibold mb-4">Add New Goal</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <Input
              placeholder="Goal title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-white border-[#e8e6df]"
              data-testid="input-goal-title"
            />
            <Input
              placeholder="Description (optional)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="bg-white border-[#e8e6df]"
              data-testid="input-goal-description"
            />
            <Select value={newType} onValueChange={(v) => setNewType(v as GoalType)}>
              <SelectTrigger className="bg-white border-[#e8e6df]" data-testid="select-goal-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">This Week</SelectItem>
                <SelectItem value="longterm">Long-term</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Target (e.g. 100)"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              className="bg-white border-[#e8e6df]"
              data-testid="input-goal-target"
            />
          </div>
          <Button
            onClick={handleAdd}
            disabled={!newTitle.trim() || createGoal.isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_12px_rgba(124,252,0,0.2)] hover:shadow-[0_0_16px_rgba(124,252,0,0.4)] transition-all"
            data-testid="button-add-goal"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Goal
          </Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Goals */}
          <Card className="border-[#e8e6df] shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-base font-semibold">Weekly Goals</h2>
                <Badge className="bg-primary/10 text-primary border-0 text-xs">{weeklyGoals.length}</Badge>
              </div>
              <div className="space-y-3">
                {weeklyGoals.map((goal) => <GoalCard key={goal.id} goal={goal} />)}
                {weeklyGoals.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No weekly goals yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Long-term Goals */}
          <Card className="border-[#e8e6df] shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-base font-semibold">Long-term Goals</h2>
                <Badge className="bg-primary/10 text-primary border-0 text-xs">{longtermGoals.length}</Badge>
              </div>
              <div className="space-y-3">
                {longtermGoals.map((goal) => <GoalCard key={goal.id} goal={goal} />)}
                {longtermGoals.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No long-term goals yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

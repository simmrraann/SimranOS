import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListHabits,
  useCreateHabit,
  useToggleHabit,
  useDeleteHabit,
  getListHabitsQueryKey,
} from "@/hooks/useSupabaseQueries";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Zap, Flame } from "lucide-react";

export default function Habits() {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("Zap");

  const { data: habits, isLoading } = useListHabits();
  const createHabit = useCreateHabit();
  const toggleHabit = useToggleHabit();
  const deleteHabit = useDeleteHabit();

  const completedCount = habits?.filter((h) => h.completedToday).length ?? 0;
  const totalCount = habits?.length ?? 0;

  const handleAdd = async () => {
    if (!newName.trim()) return;
    await createHabit.mutateAsync({ data: { name: newName.trim(), icon: newIcon } });
    queryClient.invalidateQueries({ queryKey: getListHabitsQueryKey() });
    setNewName("");
  };

  const handleToggle = async (id: number) => {
    await toggleHabit.mutateAsync({ id });
    queryClient.invalidateQueries({ queryKey: getListHabitsQueryKey() });
  };

  const handleDelete = async (id: number) => {
    await deleteHabit.mutateAsync({ id });
    queryClient.invalidateQueries({ queryKey: getListHabitsQueryKey() });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Zap className="w-7 h-7 text-primary" />
          Habit Tracker
        </h1>
        <p className="text-muted-foreground mt-1">Build consistency, one day at a time</p>
      </header>

      {/* Today's Progress */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-[#e8e6df] shadow-sm">
          <CardContent className="p-6 text-center">
            <p className="text-4xl font-bold text-primary">{completedCount}</p>
            <p className="text-sm text-muted-foreground mt-1">Completed Today</p>
          </CardContent>
        </Card>
        <Card className="border-[#e8e6df] shadow-sm">
          <CardContent className="p-6 text-center">
            <p className="text-4xl font-bold text-foreground">{totalCount}</p>
            <p className="text-sm text-muted-foreground mt-1">Total Habits</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Habit */}
      <Card className="border-[#e8e6df] shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-base font-semibold mb-4">Add New Habit</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Name your habit..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="flex-1 bg-white border-[#e8e6df]"
              data-testid="input-habit-name"
            />
            <Input
              placeholder="Icon name (e.g. BookOpen)"
              value={newIcon}
              onChange={(e) => setNewIcon(e.target.value)}
              className="w-full sm:w-44 bg-white border-[#e8e6df]"
              data-testid="input-habit-icon"
            />
            <Button
              onClick={handleAdd}
              disabled={!newName.trim() || createHabit.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_12px_rgba(124,252,0,0.2)] hover:shadow-[0_0_16px_rgba(124,252,0,0.4)] transition-all"
              data-testid="button-add-habit"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Habit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Habits List */}
      <Card className="border-[#e8e6df] shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-base font-semibold mb-4">Today's Habits</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {habits?.map((habit) => (
                <div
                  key={habit.id}
                  data-testid={`habit-item-${habit.id}`}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all group ${
                    habit.completedToday
                      ? "bg-primary/5 border-primary/20"
                      : "bg-white border-[#e8e6df] hover:border-primary/20"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${habit.completedToday ? "bg-primary/20" : "bg-[#f5f4f0]"}`}>
                    <Zap className={`w-5 h-5 ${habit.completedToday ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${habit.completedToday ? "text-foreground" : "text-foreground"}`}>
                      {habit.name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      <span className="text-xs text-muted-foreground">{habit.streak} day streak</span>
                    </div>
                  </div>
                  <Switch
                    checked={habit.completedToday}
                    onCheckedChange={() => handleToggle(habit.id)}
                    className="data-[state=checked]:bg-primary"
                    data-testid={`toggle-habit-${habit.id}`}
                  />
                  <button
                    onClick={() => handleDelete(habit.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive ml-1"
                    data-testid={`button-delete-habit-${habit.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {!habits?.length && (
                <div className="text-center py-12 text-muted-foreground">
                  <Zap className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No habits tracked yet</p>
                  <p className="text-sm mt-1">Add your first habit above</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

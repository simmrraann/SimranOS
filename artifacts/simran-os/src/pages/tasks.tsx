import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  getListTasksQueryKey,
} from "@/hooks/useSupabaseQueries";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Trash2, Plus, CheckSquare } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Category = "today" | "weekly" | "longterm";
type Priority = "low" | "medium" | "high";

const categoryLabels: Record<Category, string> = {
  today: "Today",
  weekly: "This Week",
  longterm: "Long-term",
};

const priorityColors: Record<Priority, string> = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

export default function Tasks() {
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<Category>("today");
  const [newPriority, setNewPriority] = useState<Priority>("medium");

  const { data: tasks, isLoading } = useListTasks(
    activeCategory !== "all" ? { category: activeCategory } : undefined
  );

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const completedCount = tasks?.filter((t) => t.completed).length ?? 0;
  const totalCount = tasks?.length ?? 0;
  const completionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    await createTask.mutateAsync({ data: { title: newTitle.trim(), category: newCategory, priority: newPriority } });
    queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() });
    setNewTitle("");
  };

  const handleToggle = async (id: number, completed: boolean) => {
    await updateTask.mutateAsync({ id, data: { completed: !completed } });
    queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() });
  };

  const handleDelete = async (id: number) => {
    await deleteTask.mutateAsync({ id });
    queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() });
  };

  const categories: Array<Category | "all"> = ["all", "today", "weekly", "longterm"];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <CheckSquare className="w-7 h-7 text-primary" />
          Task Manager
        </h1>
        <p className="text-muted-foreground mt-1">Stay on top of everything that matters</p>
      </header>

      {/* Progress Bar */}
      <Card className="border-[#e8e6df] shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-foreground">Overall Completion</span>
            <span className="text-sm font-bold text-primary">{completionPct}%</span>
          </div>
          <Progress value={completionPct} className="h-2.5 bg-[#e8e6df]" data-testid="completion-progress" />
          <p className="text-xs text-muted-foreground mt-2">{completedCount} of {totalCount} tasks done</p>
        </CardContent>
      </Card>

      {/* Add Task */}
      <Card className="border-[#e8e6df] shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-base font-semibold mb-4">Add New Task</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="flex-1 bg-white border-[#e8e6df]"
              data-testid="input-task-title"
            />
            <Select value={newCategory} onValueChange={(v) => setNewCategory(v as Category)}>
              <SelectTrigger className="w-full sm:w-36 bg-white border-[#e8e6df]" data-testid="select-task-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="weekly">This Week</SelectItem>
                <SelectItem value="longterm">Long-term</SelectItem>
              </SelectContent>
            </Select>
            <Select value={newPriority} onValueChange={(v) => setNewPriority(v as Priority)}>
              <SelectTrigger className="w-full sm:w-32 bg-white border-[#e8e6df]" data-testid="select-task-priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleAdd}
              disabled={!newTitle.trim() || createTask.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_12px_rgba(124,252,0,0.2)] hover:shadow-[0_0_16px_rgba(124,252,0,0.4)] transition-all"
              data-testid="button-add-task"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Task
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            data-testid={`filter-${cat}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground shadow-[0_0_12px_rgba(124,252,0,0.3)]"
                : "bg-white border border-[#e8e6df] text-muted-foreground hover:bg-black/5"
            }`}
          >
            {cat === "all" ? "All Tasks" : categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Task List */}
      <Card className="border-[#e8e6df] shadow-sm">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
            </div>
          ) : (
            <div className="space-y-2">
              {tasks?.map((task) => (
                <div
                  key={task.id}
                  data-testid={`task-item-${task.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/[0.02] transition-all group border border-transparent hover:border-[#e8e6df]"
                >
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleToggle(task.id, task.completed)}
                    className="border-[#e8e6df] data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    data-testid={`checkbox-task-${task.id}`}
                  />
                  <span className={`flex-1 text-sm ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {task.title}
                  </span>
                  <Badge className={`text-xs border-0 ${priorityColors[task.priority as Priority] ?? "bg-gray-100 text-gray-600"}`}>
                    {task.priority}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-[#e8e6df] text-muted-foreground">
                    {categoryLabels[task.category as Category] ?? task.category}
                  </Badge>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    data-testid={`button-delete-task-${task.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {!tasks?.length && (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No tasks here</p>
                  <p className="text-sm mt-1">Add a task above to get started</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

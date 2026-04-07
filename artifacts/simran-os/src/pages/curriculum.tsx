import { useGetTodayCurriculum, useUpdateCurriculum } from "@/hooks/useSupabaseQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, CheckCircle2, Circle, Sparkles, Brain, PenLine, Newspaper, Camera, Linkedin } from "lucide-react";

const checklistItems = [
  { key: "morning_journal", label: "Morning Journal", icon: PenLine, description: "Write thoughts, intentions, mistakes" },
  { key: "substack_diary", label: "Substack Diary", icon: Newspaper, description: "Read 3+ articles & write learnings" },
  { key: "main_diary", label: "Main Diary", icon: BookOpen, description: "Key reflections for the day" },
  { key: "linkedin_post", label: "LinkedIn Post", icon: Linkedin, description: "Share one insight or story" },
  { key: "insta_video", label: "Instagram Video", icon: Camera, description: "Post reel or story content" },
];

export default function Curriculum() {
  const queryClient = useQueryClient();
  const { data: today, isLoading } = useGetTodayCurriculum();
  const updateCurriculum = useUpdateCurriculum();

  const completedCount = today
    ? checklistItems.filter((item) => today[item.key]).length
    : 0;
  const totalCount = checklistItems.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  const handleToggle = async (key: string) => {
    if (!today) return;
    const newValue = !today[key];
    await updateCurriculum.mutateAsync({
      id: today.id,
      data: { [key]: newValue },
    });
    queryClient.invalidateQueries({ queryKey: ["curriculum_outputs", "today"] });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          Daily Learning
        </h1>
        <p className="text-muted-foreground mt-1">Track today's output and personal curriculum</p>
      </header>

      {/* Progress Card */}
      <Card className="glass-card border-primary/10 soft-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16" />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-foreground">Today's Progress</span>
            <span className="text-sm font-bold text-primary">{progressPct}%</span>
          </div>
          <div className="h-3 rounded-full bg-primary/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {completedCount} of {totalCount} outputs completed
          </p>
        </CardContent>
      </Card>

      {/* Checklist */}
      <Card className="glass-card border-border/50 soft-shadow">
        <CardHeader className="pb-4 border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-primary" />
            Today's Outputs
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : today ? (
            <div className="space-y-2">
              {checklistItems.map((item) => {
                const isCompleted = today[item.key];
                const ItemIcon = item.icon;
                return (
                  <div
                    key={item.key}
                    onClick={() => handleToggle(item.key)}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer group ${
                      isCompleted
                        ? "bg-primary/5 border-primary/20"
                        : "border-border/50 bg-white/40 hover:bg-white/70 hover:border-primary/10"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isCompleted ? "bg-primary/10" : "bg-muted"}`}>
                      <ItemIcon className={`w-4 h-4 ${isCompleted ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                    </div>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground/30 shrink-0 group-hover:text-primary/30 transition-colors" />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-primary/50" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Nothing here yet ✨</h3>
              <p className="text-sm text-muted-foreground">Your daily curriculum will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

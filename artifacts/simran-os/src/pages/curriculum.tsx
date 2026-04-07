import { useGetTodayCurriculum, useUpdateCurriculum } from "@/hooks/useSupabaseQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, CheckCircle2, Circle, BookOpen, PenLine, Linkedin, Video, Newspaper, Sparkles } from "lucide-react";

const checklistItems = [
  { key: "morning_journal", label: "Morning Journal", icon: PenLine, description: "Write thoughts & intentions" },
  { key: "substack_diary", label: "Substack Reading", icon: Newspaper, description: "Read 3+ articles & write learnings" },
  { key: "main_diary", label: "Main Diary / Notes", icon: BookOpen, description: "Daily reflections & insights" },
  { key: "linkedin_post", label: "LinkedIn Post", icon: Linkedin, description: "Share something valuable" },
  { key: "insta_video", label: "Instagram Video", icon: Video, description: "Film or edit content" },
];

export default function Curriculum() {
  const queryClient = useQueryClient();
  const { data: today, isLoading } = useGetTodayCurriculum();
  const updateCurriculum = useUpdateCurriculum();

  const handleToggle = async (key: string) => {
    if (!today) return;
    const currentVal = (today as any)[key];
    await updateCurriculum.mutateAsync({
      id: today.id,
      data: { [key]: !currentVal },
    });
    queryClient.invalidateQueries({ queryKey: ["curriculum_outputs", "today"] });
  };

  const completedCount = today
    ? checklistItems.filter((item) => (today as any)[item.key]).length
    : 0;
  const totalCount = checklistItems.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <CalendarDays className="w-7 h-7 text-accent" />
          Daily Curriculum
        </h1>
        <p className="text-muted-foreground mt-1">Today's learning and output checklist</p>
      </header>

      {/* Progress */}
      <Card className="glass-card border-accent/10 glow-blue">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-foreground">Today's Progress</span>
            <span className="text-sm font-bold text-accent">{progress}%</span>
          </div>
          <div className="h-2.5 bg-accent/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {completedCount} of {totalCount} outputs completed today
          </p>
        </CardContent>
      </Card>

      {/* Checklist */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 rounded-2xl" />
          ))}
        </div>
      ) : !today ? (
        <Card className="glass-card border-accent/10">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-5 animate-float">
              <Sparkles className="w-10 h-10 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Setting up today's curriculum...</h3>
            <p className="text-muted-foreground text-sm">Your checklist is being created. Refresh in a moment!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {checklistItems.map((item) => {
            const isCompleted = (today as any)[item.key];
            return (
              <div
                key={item.key}
                onClick={() => handleToggle(item.key)}
                className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  isCompleted
                    ? "bg-accent/5 border-accent/20"
                    : "bg-white/60 border-border/40 hover:bg-white/80 hover:border-accent/20"
                }`}
              >
                <div className="shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground/30" />
                  )}
                </div>
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${isCompleted ? "text-muted-foreground line-through" : "text-foreground"}`}>
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

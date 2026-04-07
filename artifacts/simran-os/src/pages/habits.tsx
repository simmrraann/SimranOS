import { useState } from "react";
import { useListHabits, useToggleHabit } from "@/hooks/useSupabaseQueries";
import { Zap, Clock, Flame, CheckCircle2, Circle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Habits() {
  const { data: habits, isLoading } = useListHabits();
  const toggleHabit = useToggleHabit();

  if (isLoading || !habits) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Simran's Daily Rituals</h1>
          <p className="text-muted-foreground">Building the foundation for success</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  const nonNegotiables = habits.filter(h => h.type === 'non_negotiable');
  const scheduled = habits.filter(h => h.type === 'scheduled');

  const handleToggle = (id: number) => {
    toggleHabit.mutate({ id });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <Zap className="h-8 w-8 text-primary" />
          Daily Rituals
        </h1>
        <p className="text-muted-foreground text-lg">Your foundation to becoming a millionaire by 21.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* NON-NEGOTIABLES */}
        <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4 border-b border-border/50">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Flame className="h-5 w-5 text-accent" />
              Non-Negotiables
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {nonNegotiables.map(habit => (
                <div 
                  key={habit.id} 
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => handleToggle(habit.id)}
                >
                  <div className="flex items-center gap-4">
                    <button className="text-muted-foreground hover:text-primary transition-colors focus:outline-none">
                      {habit.completed_today ? (
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      ) : (
                        <Circle className="h-6 w-6" />
                      )}
                    </button>
                    <div>
                      <span className={`font-medium ${habit.completed_today ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                        {habit.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-sm font-semibold">
                    <Flame className="h-3.5 w-3.5" />
                    {habit.streak}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* DAILY SCHEDULE (TIME-BASED) */}
        <Card className="border-l-4 border-l-secondary shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4 border-b border-border/50">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Clock className="h-5 w-5 text-secondary" />
              Daily Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {scheduled.map((habit, index) => (
                <div key={habit.id} className="flex group">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-px h-full bg-border group-first:mt-4 group-last:mb-4 relative">
                      <div className="absolute top-4 -left-1.5 w-3 h-3 rounded-full bg-secondary/30 border-2 border-secondary" />
                    </div>
                  </div>
                  <div 
                    className="flex-1 p-3 my-1 rounded-lg border border-border/40 hover:bg-muted/40 transition-colors cursor-pointer flex justify-between items-center"
                    onClick={() => handleToggle(habit.id)}
                  >
                    <div>
                      <div className="text-xs font-bold text-secondary mb-1 tracking-wider uppercase">
                        {habit.time_label}
                      </div>
                      <div className={`text-sm font-medium ${habit.completed_today ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                        {habit.name}
                      </div>
                    </div>
                    <div>
                      {habit.completed_today ? (
                        <CheckCircle2 className="h-5 w-5 text-secondary" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground/30" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
}

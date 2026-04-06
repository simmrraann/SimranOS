import { useState } from "react";
import { useListTasks, useListHabits } from "@/hooks/useSupabaseQueries";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, getDay } from "date-fns";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { data: tasks } = useListTasks();
  const { data: habits } = useListHabits();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad start of month
  const startPadding = getDay(monthStart); // 0 = Sunday
  const paddedDays = Array(startPadding).fill(null).concat(daysInMonth);

  const today = new Date();
  const completedTasksCount = tasks?.filter((t) => t.completed).length ?? 0;
  const totalHabitsCount = habits?.length ?? 0;
  const completedHabitsToday = habits?.filter((h) => h.completedToday).length ?? 0;

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <CalendarDays className="w-7 h-7 text-primary" />
          Calendar
        </h1>
        <p className="text-muted-foreground mt-1">Your life at a glance</p>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-[#e8e6df] shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{completedTasksCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Tasks Done</p>
          </CardContent>
        </Card>
        <Card className="border-[#e8e6df] shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{completedHabitsToday}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Habits Today</p>
          </CardContent>
        </Card>
        <Card className="border-[#e8e6df] shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{tasks?.length ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total Tasks</p>
          </CardContent>
        </Card>
        <Card className="border-[#e8e6df] shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{totalHabitsCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Active Habits</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <Card className="border-[#e8e6df] shadow-sm">
        <CardContent className="p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="hover:bg-black/5" data-testid="button-prev-month">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-lg font-semibold">{format(currentDate, "MMMM yyyy")}</h2>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="hover:bg-black/5" data-testid="button-next-month">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 mb-3">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {paddedDays.map((day, i) => {
              if (!day) return <div key={`pad-${i}`} />;
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isTodayDate = isToday(day);
              const isPast = day < today && !isTodayDate;
              // Simulate completion for past days (random for visual interest)
              const dayNum = day.getDate();
              const hasActivity = isPast && (dayNum % 3 !== 0);

              return (
                <div
                  key={day.toISOString()}
                  data-testid={`calendar-day-${format(day, "yyyy-MM-dd")}`}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all ${
                    isTodayDate
                      ? "bg-primary text-primary-foreground font-bold shadow-[0_0_12px_rgba(124,252,0,0.3)]"
                      : hasActivity
                      ? "bg-primary/10 text-foreground hover:bg-primary/20 cursor-pointer"
                      : isCurrentMonth
                      ? "text-foreground hover:bg-black/5 cursor-pointer"
                      : "text-muted-foreground/30"
                  }`}
                >
                  <span>{format(day, "d")}</span>
                  {hasActivity && !isTodayDate && (
                    <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-[#e8e6df]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary/20" />
              <span className="text-xs text-muted-foreground">Active day</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

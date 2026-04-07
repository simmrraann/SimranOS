import { useGetDashboardSummary } from "@/hooks/useSupabaseQueries";
import { Link } from "wouter";
import { 
  CheckSquare, 
  Target, 
  TrendingUp, 
  Zap, 
  ArrowRight,
  Sparkles,
  Plane,
  Coffee,
  Heart
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const { data: summary, isLoading } = useGetDashboardSummary();

  if (isLoading || !summary) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">SimranOS Dashboard</h1>
          <p className="text-muted-foreground">Loading your cockpit...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Task Completion",
      value: `${summary.tasksCompleted}/${summary.tasksTotal}`,
      description: "Deep work tasks completed",
      icon: CheckSquare,
      color: "text-primary",
      link: "/tasks",
    },
    {
      title: "Daily Rituals",
      value: `${summary.habitsCompletedToday}/${summary.habitsTotal}`,
      description: "Non-negotiables & scheduled",
      icon: Zap,
      color: "text-accent",
      link: "/habits",
    },
    {
      title: "Goals Progress",
      value: `${summary.goalsAvgProgress}%`,
      description: "Average milestone completion",
      icon: Target,
      color: "text-secondary",
      link: "/goals",
    },
    {
      title: "Agency Revenue",
      value: `₹${summary.totalRevenue.toLocaleString()}`,
      description: "AIJugaad total booked",
      icon: TrendingUp,
      color: "text-green-500",
      link: "/agency",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          Simran's Cockpit
          <Sparkles className="w-6 h-6 text-primary animate-pulse" />
        </h1>
        <p className="text-muted-foreground text-lg">
          Helping small businesses leverage AI while building a personal empire.
        </p>
      </div>

      {/* Pinned Vision Board */}
      <Card className="bg-primary/5 border-primary/20 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
        <CardContent className="p-6 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide uppercase">
                <Target className="w-4 h-4" />
                Long Term Vision
              </div>
              <h2 className="text-2xl font-bold italic text-foreground tracking-tight">
                "I'm becoming a millionaire by 21."
              </h2>
              <p className="text-muted-foreground font-medium leading-relaxed">
                Small beach town life. Matcha café. Shoot content from home.
              </p>
            </div>
            
            <div className="flex flex-col gap-3 min-w-[200px] border-l-2 border-primary/20 pl-6">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Plane className="w-4 h-4" /> Travel Unlocks
              </h3>
              <div className="flex flex-wrap gap-2 text-sm font-medium">
                <span className="text-foreground">Edinburgh</span>
                <span className="text-primary">→</span>
                <span className="text-foreground">Dubai</span>
                <span className="text-primary">→</span>
                <span className="text-foreground">Bali</span>
                <span className="text-primary">→</span>
                <span className="text-foreground">Sweden</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.link}>
            <div className="p-6 rounded-xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
                  {stat.title}
                </h3>
                <stat.icon className={`h-5 w-5 ${stat.color} group-hover:scale-110 transition-transform`} />
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
                  {stat.description}
                  <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}

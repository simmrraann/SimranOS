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
  Heart,
  Star,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const { data: summary, isLoading } = useGetDashboardSummary();

  // Get time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  if (isLoading || !summary) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-14 h-14 rounded-full" />
          <div>
            <Skeleton className="h-8 w-64 rounded-lg" />
            <Skeleton className="h-4 w-48 rounded-lg mt-2" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
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
      gradient: "from-primary/10 to-primary/5",
      iconColor: "text-primary",
      glowClass: "glow-primary",
      link: "/tasks",
    },
    {
      title: "Daily Rituals",
      value: `${summary.habitsCompletedToday}/${summary.habitsTotal}`,
      description: "Non-negotiables & scheduled",
      icon: Zap,
      gradient: "from-secondary/10 to-secondary/5",
      iconColor: "text-secondary",
      glowClass: "glow-pink",
      link: "/habits",
    },
    {
      title: "Goals Progress",
      value: `${summary.goalsAvgProgress}%`,
      description: "Average milestone completion",
      icon: Target,
      gradient: "from-accent/10 to-accent/5",
      iconColor: "text-accent",
      glowClass: "glow-blue",
      link: "/goals",
    },
    {
      title: "Agency Revenue",
      value: `₹${summary.totalRevenue.toLocaleString()}`,
      description: "AIJugaad total booked",
      icon: TrendingUp,
      gradient: "from-emerald-50 to-emerald-50/50",
      iconColor: "text-emerald-500",
      glowClass: "",
      link: "/agency",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Greeting Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src="/avatar.png"
              alt="Simran"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20 shadow-md"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
              {greeting}, Simran
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </h1>
            <p className="text-muted-foreground text-sm md:text-base mt-0.5">
              Let's crush another day. You've got this! 💜
            </p>
          </div>
        </div>
      </div>

      {/* Pinned Vision Board */}
      <Card className="glass-card border-primary/10 shadow-lg glow-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-2xl -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-2xl -ml-10 -mb-10" />
        <CardContent className="p-6 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase">
                <Star className="w-3.5 h-3.5" />
                Long Term Vision
              </div>
              <h2 className="text-xl md:text-2xl font-bold italic text-foreground tracking-tight">
                "I'm becoming a millionaire by 21."
              </h2>
              <p className="text-muted-foreground font-medium leading-relaxed text-sm">
                Small beach town life. Matcha café. Shoot content from home. ☕
              </p>
            </div>

            <div className="flex flex-col gap-3 min-w-[200px] border-l-2 border-primary/15 pl-6">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Plane className="w-3.5 h-3.5" /> Travel Unlocks
              </h3>
              <div className="flex flex-wrap gap-2 text-sm font-medium">
                {["Edinburgh", "Dubai", "Bali", "Sweden"].map((place, i) => (
                  <span key={place} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-primary">→</span>}
                    <span className="text-foreground">{place}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.link}>
            <div
              className={`p-5 rounded-2xl bg-gradient-to-br ${stat.gradient} border border-border/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group ${stat.glowClass}`}
            >
              <div className="flex items-center justify-between pb-2">
                <h3 className="tracking-tight text-xs font-semibold text-muted-foreground uppercase">
                  {stat.title}
                </h3>
                <div className="w-9 h-9 rounded-xl bg-white/80 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-1">
                <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
                  {stat.description}
                  <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Plan Day", href: "/tasks", icon: CheckSquare, color: "text-primary" },
          { label: "Check Habits", href: "/habits", icon: Zap, color: "text-secondary" },
          { label: "View Goals", href: "/goals", icon: Target, color: "text-accent" },
          { label: "Analytics", href: "/analytics", icon: TrendingUp, color: "text-emerald-500" },
        ].map((action) => (
          <Link key={action.label} href={action.href}>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-border/30 hover:bg-white/80 hover:shadow-sm transition-all cursor-pointer group">
              <action.icon className={`w-4 h-4 ${action.color}`} />
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {action.label}
              </span>
              <ArrowRight className="w-3 h-3 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

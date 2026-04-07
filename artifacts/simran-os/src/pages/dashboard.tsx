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
  Rocket,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const { data: summary, isLoading } = useGetDashboardSummary();

  // Get time-based greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (isLoading || !summary) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-14 h-14 rounded-full" />
          <div>
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-4 w-64 rounded-lg mt-2" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Tasks Done",
      value: `${summary.tasksCompleted}/${summary.tasksTotal}`,
      description: "Deep work blocks completed",
      icon: CheckSquare,
      gradient: "from-primary/10 to-primary/5",
      iconColor: "text-primary",
      link: "/tasks",
    },
    {
      title: "Daily Rituals",
      value: `${summary.habitsCompletedToday}/${summary.habitsTotal}`,
      description: "Non-negotiables & scheduled",
      icon: Zap,
      gradient: "from-accent/10 to-accent/5",
      iconColor: "text-accent",
      link: "/habits",
    },
    {
      title: "Goals Progress",
      value: `${summary.goalsAvgProgress}%`,
      description: "Average milestone completion",
      icon: Target,
      gradient: "from-secondary/10 to-secondary/5",
      iconColor: "text-secondary",
      link: "/goals",
    },
    {
      title: "Agency Revenue",
      value: `₹${summary.totalRevenue.toLocaleString()}`,
      description: "AIJugaad total booked",
      icon: TrendingUp,
      gradient: "from-emerald-100/50 to-emerald-50/30",
      iconColor: "text-emerald-500",
      link: "/agency",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ✨ Greeting Header with Avatar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src="/avatar.png"
            alt="Simran"
            className="w-14 h-14 rounded-full object-cover ring-4 ring-primary/10 shadow-md"
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
              {greeting}, Simran
              <Sparkles className="w-6 h-6 text-primary shimmer" />
            </h1>
            <p className="text-muted-foreground text-sm md:text-base mt-0.5">
              Let's build something amazing today ✨
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
          <Coffee className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* 🌟 Vision Board */}
      <Card className="glass-card border-primary/10 soft-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-primary/8 to-transparent rounded-full blur-2xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-accent/8 to-transparent rounded-full blur-2xl -ml-16 -mb-16" />
        <CardContent className="p-6 md:p-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 text-primary text-xs font-semibold tracking-wide uppercase border border-primary/10">
                <Star className="w-3.5 h-3.5" />
                Long Term Vision
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
                "I'm becoming a <span className="gradient-text">millionaire by 21</span>."
              </h2>
              <p className="text-muted-foreground font-medium leading-relaxed text-sm md:text-base">
                Small beach town life. Matcha café. Shooting content from home.
              </p>
            </div>

            <div className="flex flex-col gap-3 min-w-[200px] md:border-l-2 md:border-primary/10 md:pl-6 pt-2">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Plane className="w-4 h-4 text-accent" /> Travel Unlocks
              </h3>
              <div className="flex flex-wrap gap-2 text-sm font-medium">
                {["Edinburgh", "Dubai", "Bali", "Sweden"].map((city, i) => (
                  <span
                    key={city}
                    className="px-2.5 py-1 rounded-full bg-accent/5 border border-accent/10 text-foreground text-xs font-medium"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 📊 Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.link}>
            <div
              className={`p-5 rounded-2xl glass-card border border-border/50 soft-shadow hover:glow-primary hover:-translate-y-1 transition-all duration-300 cursor-pointer group bg-gradient-to-br ${stat.gradient}`}
            >
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {stat.title}
                </h3>
                <div className={`p-2 rounded-xl bg-white/60 ${stat.iconColor}`}>
                  <stat.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-1">
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
                  {stat.description}
                  <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Add Task", icon: CheckSquare, href: "/tasks", color: "text-primary" },
          { label: "Check Habits", icon: Zap, href: "/habits", color: "text-accent" },
          { label: "View Goals", icon: Target, href: "/goals", color: "text-secondary" },
          { label: "Analytics", icon: TrendingUp, href: "/analytics", color: "text-emerald-500" },
        ].map((action) => (
          <Link key={action.label} href={action.href}>
            <div className="p-4 rounded-xl border border-border/50 bg-white/40 hover:bg-white/70 hover:border-primary/20 transition-all cursor-pointer text-center group">
              <action.icon className={`w-5 h-5 mx-auto mb-2 ${action.color} group-hover:scale-110 transition-transform`} />
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {action.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  Zap,
  TrendingUp,
  BarChart2,
  CalendarDays,
  Menu,
  BookOpen,
  Video,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Planner", icon: CheckSquare },
  { href: "/habits", label: "Rituals", icon: Zap },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/content", label: "Content", icon: Video },
  { href: "/agency", label: "AIJugaad", icon: BarChart2 },
  { href: "/curriculum", label: "Learning", icon: BookOpen },
  { href: "/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
];

export function Sidebar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const NavContent = () => (
    <div className="flex flex-col h-full glass-card border-r border-border/50">
      {/* Logo Section */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">Simran OS</h1>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Personal Cockpit</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        <p className="px-3 pt-2 pb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Navigation</p>
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          const exactActive = item.href === "/" ? location === "/" : isActive;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                exactActive
                  ? "bg-primary/10 text-primary glow-primary"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
              }`}
              data-testid={`nav-link-${item.label.toLowerCase()}`}
              onClick={() => setOpen(false)}
            >
              <item.icon className={`w-[18px] h-[18px] ${exactActive ? "text-primary" : ""}`} />
              {item.label}
              {exactActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shimmer" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3 px-2">
          <img
            src="/avatar.png"
            alt="Simran"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">Simran</p>
            <p className="text-[10px] text-muted-foreground">AI Student & Founder</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 z-40 flex-col">
        <NavContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50 glass-card shadow-md"
            data-testid="mobile-menu-btn"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <NavContent />
        </SheetContent>
      </Sheet>
    </>
  );
}

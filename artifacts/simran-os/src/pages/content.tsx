import { useListContentSeries } from "@/hooks/useSupabaseQueries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Video, CheckCircle2, Pencil, Clock, Sparkles, TrendingUp, Instagram } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  done: { label: "Published", color: "bg-secondary/10 text-secondary border-secondary/20", icon: CheckCircle2 },
  scripting: { label: "Scripting", color: "bg-primary/10 text-primary border-primary/20", icon: Pencil },
  pending: { label: "Planned", color: "bg-muted text-muted-foreground border-border", icon: Clock },
};

export default function Content() {
  const { data: series, isLoading } = useListContentSeries();

  const doneCount = series?.filter((s) => s.status === "done").length ?? 0;
  const totalCount = series?.length ?? 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent/10">
            <Video className="w-6 h-6 text-accent" />
          </div>
          Content Studio
        </h1>
        <p className="text-muted-foreground mt-1">Track your content series and publishing pipeline</p>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="glass-card border-border/50 soft-shadow">
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-bold text-accent">{doneCount}</p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Published</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50 soft-shadow">
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-bold text-primary">{totalCount - doneCount}</p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">In Progress</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50 soft-shadow hidden md:block">
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-bold text-foreground">{totalCount}</p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Total Episodes</p>
          </CardContent>
        </Card>
      </div>

      {/* Content List */}
      <Card className="glass-card border-border/50 soft-shadow">
        <CardHeader className="pb-4 border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Instagram className="w-5 h-5 text-accent" />
            Marketing Re-Coded Series
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : series && series.length > 0 ? (
            <div className="space-y-3">
              {series.map((item, index) => {
                const config = statusConfig[item.status] || statusConfig.pending;
                const StatusIcon = config.icon;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-white/40 hover:bg-white/70 hover:border-primary/20 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{item.platform}</p>
                    </div>
                    <Badge className={`text-xs border ${config.color} gap-1`}>
                      <StatusIcon className="w-3 h-3" />
                      {config.label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Video className="w-8 h-8 text-accent/50" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">No content yet ✨</h3>
              <p className="text-sm text-muted-foreground mb-4">Start by adding your first content series</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20 cursor-pointer hover:bg-accent/20 transition-colors">
                <Sparkles className="w-4 h-4" />
                Coming Soon
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

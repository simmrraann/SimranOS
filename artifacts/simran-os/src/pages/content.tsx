import { Link } from "wouter";
import { useListContentSeries } from "@/hooks/useSupabaseQueries";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Video, Sparkles, Instagram, Plus, Film } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string }> = {
  done: { label: "Published", color: "bg-emerald-100 text-emerald-700" },
  scripting: { label: "Scripting", color: "bg-primary/10 text-primary" },
  pending: { label: "Pending", color: "bg-muted text-muted-foreground" },
};

export default function Content() {
  const { data: series, isLoading } = useListContentSeries();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Video className="w-7 h-7 text-secondary" />
            Content Studio
          </h1>
          <p className="text-muted-foreground mt-1">Your content series and production pipeline</p>
        </div>
      </header>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : !series || series.length === 0 ? (
        /* ✨ Beautiful empty state */
        <Card className="glass-card border-secondary/10 glow-pink">
          <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mb-5 animate-float">
              <Film className="w-10 h-10 text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No content yet ✨</h3>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
              Start tracking your content series here. Add reels, scripts, and video ideas to stay on top of your creative game.
            </p>
            <Button className="bg-gradient-to-r from-secondary to-primary text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Create First Series
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {series.map((item: any) => {
            const status = statusConfig[item.status] || statusConfig.pending;
            return (
              <Card
                key={item.id}
                className="bg-white/70 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/10 to-primary/10 flex items-center justify-center">
                        <Instagram className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 capitalize">{item.platform}</p>
                      </div>
                    </div>
                    <Badge className={`text-xs border-0 ${status.color}`}>{status.label}</Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListBusinessMetrics,
  useCreateBusinessMetric,
  useUpdateBusinessMetric,
  getListBusinessMetricsQueryKey,
} from "@/hooks/useSupabaseQueries";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Plus, Building2, Video, Sparkles, DollarSign } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type MetricCategory = "agency" | "content";

export default function Business() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState<MetricCategory>("agency");
  const [newName, setNewName] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newUnit, setNewUnit] = useState("");
  const [newChange, setNewChange] = useState("0");
  const [newPeriod, setNewPeriod] = useState("This Month");

  const { data: metrics, isLoading } = useListBusinessMetrics();
  const createMetric = useCreateBusinessMetric();

  const agencyMetrics = metrics?.filter((m) => m.category === "agency") ?? [];
  const contentMetrics = metrics?.filter((m) => m.category === "content") ?? [];

  const totalRevenue = agencyMetrics.reduce((sum, m) => {
    if (m.name.toLowerCase().includes("revenue")) return sum + m.value;
    return sum;
  }, 0);

  const handleAdd = async () => {
    if (!newName.trim() || !newValue) return;
    await createMetric.mutateAsync({
      data: {
        category: newCategory,
        name: newName.trim(),
        value: parseFloat(newValue),
        unit: newUnit.trim() || "",
        change: parseFloat(newChange) || 0,
        period: newPeriod.trim() || "This Month",
      },
    });
    queryClient.invalidateQueries({ queryKey: getListBusinessMetricsQueryKey() });
    setNewName("");
    setNewValue("");
    setNewUnit("");
    setNewChange("0");
    setShowForm(false);
  };

  const MetricCard = ({ metric }: { metric: NonNullable<typeof metrics>[0] }) => {
    const isPositive = metric.change >= 0;
    return (
      <div
        data-testid={`metric-card-${metric.id}`}
        className="p-5 rounded-2xl border border-border/50 glass-card hover:-translate-y-0.5 hover:glow-primary transition-all soft-shadow"
      >
        <p className="text-xs text-muted-foreground mb-2 font-medium">{metric.name}</p>
        <p className="text-2xl font-bold text-foreground">
          {metric.value.toLocaleString()}
          {metric.unit && <span className="text-base font-normal text-muted-foreground ml-1">{metric.unit}</span>}
        </p>
        <div className="flex items-center gap-1.5 mt-2">
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 text-secondary" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-accent" />
          )}
          <span className={`text-xs font-medium ${isPositive ? "text-secondary" : "text-accent"}`}>
            {isPositive ? "+" : ""}{metric.change}{typeof metric.change === "number" && Math.abs(metric.change) < 100 ? "%" : ""}
          </span>
          <span className="text-xs text-muted-foreground">{metric.period}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-xl bg-secondary/10">
              <Building2 className="w-6 h-6 text-secondary" />
            </div>
            AIJugaad Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Track your agency and content performance</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
          data-testid="button-toggle-form"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Metric
        </Button>
      </header>

      {/* Revenue Summary */}
      <Card className="glass-card border-secondary/10 soft-shadow relative overflow-hidden bg-gradient-to-br from-secondary/5 to-primary/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl -mr-16 -mt-16" />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center gap-3 mb-1">
            <DollarSign className="w-5 h-5 text-secondary" />
            <p className="text-sm text-muted-foreground font-medium">Total Revenue</p>
          </div>
          <p className="text-4xl font-bold text-foreground">₹{totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">Agency income this period</p>
        </CardContent>
      </Card>

      {/* Add Form */}
      {showForm && (
        <Card className="glass-card border-border/50 soft-shadow">
          <CardContent className="p-6">
            <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              New Metric
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              <Select value={newCategory} onValueChange={(v) => setNewCategory(v as MetricCategory)}>
                <SelectTrigger className="bg-white/60 border-border/50" data-testid="select-metric-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agency">Agency</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Metric name" value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-white/60 border-border/50" data-testid="input-metric-name" />
              <Input type="number" placeholder="Value" value={newValue} onChange={(e) => setNewValue(e.target.value)} className="bg-white/60 border-border/50" data-testid="input-metric-value" />
              <Input placeholder="Unit (INR, posts, etc.)" value={newUnit} onChange={(e) => setNewUnit(e.target.value)} className="bg-white/60 border-border/50" data-testid="input-metric-unit" />
              <Input type="number" placeholder="Change %" value={newChange} onChange={(e) => setNewChange(e.target.value)} className="bg-white/60 border-border/50" data-testid="input-metric-change" />
              <Input placeholder="Period (e.g. April 2025)" value={newPeriod} onChange={(e) => setNewPeriod(e.target.value)} className="bg-white/60 border-border/50" data-testid="input-metric-period" />
            </div>
            <Button onClick={handleAdd} disabled={!newName.trim() || !newValue || createMetric.isPending} className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl" data-testid="button-add-metric">
              Save Metric
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <Skeleton key={i} className="h-48 w-full rounded-2xl" />)}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Agency */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-secondary" />
              <h2 className="text-lg font-semibold">Agency</h2>
              <Badge className="bg-secondary/10 text-secondary border-0 text-xs">{agencyMetrics.length} metrics</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {agencyMetrics.map((m) => <MetricCard key={m.id} metric={m} />)}
              {agencyMetrics.length === 0 && (
                <div className="col-span-3 text-center py-14">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary/10 flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-secondary/40" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">No agency metrics yet ✨</h3>
                  <p className="text-sm text-muted-foreground">Add one above to start tracking</p>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Video className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-semibold">Content Creation</h2>
              <Badge className="bg-accent/10 text-accent border-0 text-xs">{contentMetrics.length} metrics</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {contentMetrics.map((m) => <MetricCard key={m.id} metric={m} />)}
              {contentMetrics.length === 0 && (
                <div className="col-span-3 text-center py-14">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center">
                    <Video className="w-8 h-8 text-accent/40" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">No content metrics yet ✨</h3>
                  <p className="text-sm text-muted-foreground">Add one above to start tracking</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
import { TrendingUp, TrendingDown, Plus, Building2, Video, Sparkles } from "lucide-react";
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

  const agencyMetrics = metrics?.filter((m: any) => m.category === "agency") ?? [];
  const contentMetrics = metrics?.filter((m: any) => m.category === "content") ?? [];

  const totalRevenue = agencyMetrics.reduce((sum: number, m: any) => {
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

  const MetricCard = ({ metric }: { metric: any }) => {
    const isPositive = metric.change >= 0;
    return (
      <div
        data-testid={`metric-card-${metric.id}`}
        className="p-5 rounded-2xl border border-border/50 bg-white/70 backdrop-blur-sm hover:-translate-y-0.5 hover:shadow-md transition-all"
      >
        <p className="text-xs text-muted-foreground mb-2 font-medium">{metric.name}</p>
        <p className="text-2xl font-bold text-foreground">
          {metric.value.toLocaleString()}
          {metric.unit && <span className="text-base font-normal text-muted-foreground ml-1">{metric.unit}</span>}
        </p>
        <div className="flex items-center gap-1.5 mt-2">
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-red-400" />
          )}
          <span className={`text-xs font-medium ${isPositive ? "text-emerald-500" : "text-red-400"}`}>
            {isPositive ? "+" : ""}
            {metric.change}
            {typeof metric.change === "number" && Math.abs(metric.change) < 100 ? "%" : ""}
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
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-emerald-500" />
            Business Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Track your agency and content performance</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl shadow-md hover:shadow-lg transition-all"
          data-testid="button-toggle-form"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Metric
        </Button>
      </header>

      {/* Revenue Summary */}
      <Card className="glass-card border-emerald-100 shadow-lg bg-gradient-to-br from-emerald-50/80 to-white/80">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
          <p className="text-4xl font-bold text-foreground">₹{totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">Agency income this period</p>
        </CardContent>
      </Card>

      {/* Add Form */}
      {showForm && (
        <Card className="bg-white/70 backdrop-blur-sm border-border/50 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-base font-semibold mb-4">New Metric</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              <Select value={newCategory} onValueChange={(v) => setNewCategory(v as MetricCategory)}>
                <SelectTrigger className="bg-white/80 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agency">Agency</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Metric name" value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-white/80 border-border/50" />
              <Input type="number" placeholder="Value" value={newValue} onChange={(e) => setNewValue(e.target.value)} className="bg-white/80 border-border/50" />
              <Input placeholder="Unit (INR, posts...)" value={newUnit} onChange={(e) => setNewUnit(e.target.value)} className="bg-white/80 border-border/50" />
              <Input type="number" placeholder="Change %" value={newChange} onChange={(e) => setNewChange(e.target.value)} className="bg-white/80 border-border/50" />
              <Input placeholder="Period" value={newPeriod} onChange={(e) => setNewPeriod(e.target.value)} className="bg-white/80 border-border/50" />
            </div>
            <Button
              onClick={handleAdd}
              disabled={!newName.trim() || !newValue || createMetric.isPending}
              className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl"
            >
              Save Metric
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      ) : !metrics || metrics.length === 0 ? (
        <Card className="glass-card border-primary/10 glow-primary">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-5 animate-float">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No metrics yet ✨</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              Start tracking your agency and content performance by adding your first metric above.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Agency */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Agency</h2>
              <Badge className="bg-primary/10 text-primary border-0 text-xs">{agencyMetrics.length} metrics</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {agencyMetrics.map((m: any) => (
                <MetricCard key={m.id} metric={m} />
              ))}
              {agencyMetrics.length === 0 && (
                <div className="col-span-3 text-center py-10 text-muted-foreground text-sm">No agency metrics yet. Add one above.</div>
              )}
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Video className="w-5 h-5 text-secondary" />
              <h2 className="text-lg font-semibold">Content Creation</h2>
              <Badge className="bg-secondary/10 text-secondary border-0 text-xs">{contentMetrics.length} metrics</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {contentMetrics.map((m: any) => (
                <MetricCard key={m.id} metric={m} />
              ))}
              {contentMetrics.length === 0 && (
                <div className="col-span-3 text-center py-10 text-muted-foreground text-sm">No content metrics yet. Add one above.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

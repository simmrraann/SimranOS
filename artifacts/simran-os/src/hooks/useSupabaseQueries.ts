import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

// Query Keys
export const getListTasksQueryKey = () => ["tasks"];
export const getListHabitsQueryKey = () => ["habits"];
export const getListGoalsQueryKey = () => ["goals"];
export const getListBusinessMetricsQueryKey = () => ["business_metrics"];
export const getGetDashboardSummaryQueryKey = () => ["dashboard_summary"];

// Business Metrics
export function useListBusinessMetrics() {
  return useQuery({
    queryKey: getListBusinessMetricsQueryKey(),
    queryFn: async () => {
      const { data, error } = await supabase.from("business_metrics").select("*").order("id", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateBusinessMetric() {
  return useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      const { data: result, error } = await supabase.from("business_metrics").insert(data).select().single();
      if (error) throw error;
      return result;
    },
  });
}

export function useUpdateBusinessMetric() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const { data: result, error } = await supabase.from("business_metrics").update(data).eq("id", id).select().single();
      if (error) throw error;
      return result;
    },
  });
}

// Tasks
export function useListTasks(params?: { category?: string; block?: string }) {
  return useQuery({
    queryKey: [...getListTasksQueryKey(), params?.category, params?.block],
    queryFn: async () => {
      let query = supabase.from("tasks").select("*").order("id", { ascending: false });
      if (params?.category) query = query.eq("category", params.category);
      if (params?.block) query = query.eq("block", params.block);
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateTask() {
  return useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      const { data: result, error } = await supabase.from("tasks").insert(data).select().single();
      if (error) throw error;
      return result;
    },
  });
}

export function useUpdateTask() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const { data: result, error } = await supabase.from("tasks").update(data).eq("id", id).select().single();
      if (error) throw error;
      return result;
    },
  });
}

export function useDeleteTask() {
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
      return true;
    },
  });
}

// Habits
export function useListHabits() {
  return useQuery({
    queryKey: getListHabitsQueryKey(),
    queryFn: async () => {
      const { data, error } = await supabase.from("habits").select("*").order("id", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateHabit() {
  return useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      const { data: result, error } = await supabase.from("habits").insert({
        name: data.name,
        type: data.type || 'non_negotiable',
        time_label: data.time_label,
        icon: data.icon,
        completed_today: false,
        streak: 0
      }).select().single();
      if (error) throw error;
      return result;
    },
  });
}

export function useToggleHabit() {
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const { data, error: err1 } = await supabase.from("habits").select("completed_today, streak").eq("id", id).single();
      if (err1) throw err1;
      
      const newCompleted = !data.completed_today;
      const newStreak = newCompleted ? (data.streak + 1) : Math.max(0, data.streak - 1);
      
      const { data: result, error: err2 } = await supabase.from("habits").update({
        completed_today: newCompleted,
        streak: newStreak
      }).eq("id", id).select().single();
      if (err2) throw err2;
      return result;
    },
  });
}

export function useDeleteHabit() {
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const { error } = await supabase.from("habits").delete().eq("id", id);
      if (error) throw error;
      return true;
    },
  });
}

// Goals
export function useListGoals() {
  return useQuery({
    queryKey: getListGoalsQueryKey(),
    queryFn: async () => {
      const { data, error } = await supabase.from("goals").select("*").order("id", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateGoal() {
  return useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      const { data: result, error } = await supabase.from("goals").insert(data).select().single();
      if (error) throw error;
      return result;
    },
  });
}

export function useUpdateGoal() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const { data: result, error } = await supabase.from("goals").update(data).eq("id", id).select().single();
      if (error) throw error;
      return result;
    },
  });
}

export function useDeleteGoal() {
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const { error } = await supabase.from("goals").delete().eq("id", id);
      if (error) throw error;
      return true;
    },
  });
}

// Agency Pipeline
export function useListAgencyPipeline() {
  return useQuery({
    queryKey: ["agency_pipeline"],
    queryFn: async () => {
      const { data, error } = await supabase.from("agency_pipeline").select("*").order("id", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreatePipelineItem() {
  return useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      const { data: result, error } = await supabase.from("agency_pipeline").insert(data).select().single();
      if (error) throw error;
      return result;
    },
  });
}

export function useUpdatePipelineItem() {
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: any }) => {
        const { data: result, error } = await supabase.from("agency_pipeline").update(data).eq("id", id).select().single();
        if (error) throw error;
        return result;
      },
    });
  }

// Content Series
export function useListContentSeries() {
  return useQuery({
    queryKey: ["content_series"],
    queryFn: async () => {
      const { data, error } = await supabase.from("content_series").select("*").order("id", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

// Curriculum Outputs
export function useGetTodayCurriculum() {
  return useQuery({
    queryKey: ["curriculum_outputs", "today"],
    queryFn: async () => {
      // First try to fetch today's
      const todayString = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase.from("curriculum_outputs")
        .select("*")
        .eq("date", todayString)
        .single();
      
      if (error && error.code !== "PGRST116") throw error; // PGRST116 is not found
      
      if (!data) {
        // If it doesn't exist, create it
        const { data: newData, error: insertError } = await supabase.from("curriculum_outputs")
          .insert({ date: todayString })
          .select()
          .single();
        if (insertError) throw insertError;
        return newData;
      }
      return data;
    },
  });
}

export function useUpdateCurriculum() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const { data: result, error } = await supabase.from("curriculum_outputs").update(data).eq("id", id).select().single();
      if (error) throw error;
      return result;
    },
  });
}

// Analytics 
export function useGetDashboardSummary() {
  return useQuery({
    queryKey: getGetDashboardSummaryQueryKey(),
    queryFn: async () => {
      const [{ count: tasksTotal }, { count: tasksCompleted }, { count: habitsTotal }, { count: habitsCompletedToday }, { data: goals }] = await Promise.all([
        supabase.from("tasks").select("*", { count: 'exact', head: true }),
        supabase.from("tasks").select("*", { count: 'exact', head: true }).eq("completed", true),
        supabase.from("habits").select("*", { count: 'exact', head: true }),
        supabase.from("habits").select("*", { count: 'exact', head: true }).eq("completed_today", true),
        supabase.from("goals").select("progress, target")
      ]);

      let avgProgress = 0;
      if (goals && goals.length > 0) {
        avgProgress = goals.reduce((acc, g) => acc + (g.target > 0 ? (Number(g.progress) / Number(g.target)) * 100 : 0), 0) / goals.length;
      }

      const { data: agencyClients } = await supabase.from("agency_pipeline").select("*");
      const clientValue = agencyClients ? agencyClients.reduce((acc, c) => acc + Number(c.value), 0) : 0;

      return {
        tasksTotal: tasksTotal || 0,
        tasksCompleted: tasksCompleted || 0,
        habitsTotal: habitsTotal || 0,
        habitsCompletedToday: habitsCompletedToday || 0,
        goalsTotal: goals?.length || 0,
        goalsAvgProgress: Math.round(avgProgress),
        totalRevenue: clientValue,
        revenueChange: 0
      };
    },
  });
}

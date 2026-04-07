import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Debug() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [configInfo, setConfigInfo] = useState<any>({});

  useEffect(() => {
    async function checkSupabase() {
      // 1. Check Configuration
      const url = import.meta.env.VITE_SUPABASE_URL || "NOT SET (Using placeholder)";
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY ? "SET (Starts with " + import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 10) + "...)" : "NOT SET";
      
      setConfigInfo({
        supabaseUrl: url,
        anonKeyStatus: key
      });

      // 2. Perform Hard Fetch
      try {
        const { data: tasksData, error: tasksError } = await supabase
          .from("tasks")
          .select("*")
          .limit(5);

        if (tasksError) {
          setError(tasksError);
        } else {
          setData(tasksData);
        }
      } catch (err: any) {
        setError({ message: err.message || "Unknown JS Error during fetch" });
      } finally {
        setLoading(false);
      }
    }

    checkSupabase();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-red-500">Supabase Connection Debugger</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>1. Environment Variables in Netlify</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 dark:bg-zinc-900 p-4 rounded text-sm overflow-x-auto">
            {JSON.stringify(configInfo, null, 2)}
          </pre>
          {(configInfo.supabaseUrl?.includes("placeholder") || configInfo.anonKeyStatus === "NOT SET") && (
            <div className="mt-4 p-4 bg-red-100 text-red-800 rounded border border-red-300">
              <strong>CRITICAL ISSUE FOUND:</strong> The Vite environment variables are not set in your Netlify build. <br/>
              <b>Fix:</b> Go to Netlify → Site Configuration → Environment Variables. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then completely redeploy.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Raw API Response (Table: tasks)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Fetching from Supabase...</p>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="p-4 bg-red-100 text-red-800 rounded border border-red-300 overflow-x-auto">
                  <h3 className="font-bold">Fetch Error:</h3>
                  <pre className="text-sm mt-2">{JSON.stringify(error, null, 2)}</pre>
                  {error.code === '42501' && (
                    <p className="mt-2 font-bold">This is an RLS (Row Level Security) Error! Run the SQL snippet below in the Supabase Dashboard to allow read access.</p>
                  )}
                </div>
              )}
              
              {!error && data && data.length === 0 && (
                <div className="p-4 bg-yellow-100 text-yellow-800 rounded border border-yellow-300 overflow-x-auto">
                  <h3 className="font-bold">Connected, but Data Array is EMPTY []</h3>
                  <p className="mt-2">If your table has data in Supabase but it's returning empty here, it means <b>Row Level Security (RLS) is blocking you</b> because you are fetching anonymously without an RLS policy!</p>
                </div>
              )}

              {!error && data && data.length > 0 && (
                <div className="p-4 bg-green-100 text-green-800 rounded border border-green-300">
                  <h3 className="font-bold">Success! Data returned from Database:</h3>
                  <pre className="text-sm mt-2 overflow-x-auto bg-white/50 p-2 rounded">{JSON.stringify(data, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>SQL Fix for RLS</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">If you are getting an active block or empty data, run this in your Supabase SQL Editor to temporarily grant public read access:</p>
          <pre className="bg-gray-100 dark:bg-zinc-900 p-4 rounded text-sm overflow-x-auto select-all">
{`-- Temporarily allow public read access for debugging
CREATE POLICY "Public Read Access" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.habits FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.goals FOR SELECT USING (true);

-- Ensure RLS is enabled so policies apply
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;`}
          </pre>
        </CardContent>
      </Card>

    </div>
  );
}

import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout";

import Dashboard from "@/pages/dashboard";
import Tasks from "@/pages/tasks";
import Habits from "@/pages/habits";
import Goals from "@/pages/goals";
import Agency from "@/pages/agency";
import Content from "@/pages/content";
import Curriculum from "@/pages/curriculum";
import Analytics from "@/pages/analytics";
import CalendarPage from "@/pages/calendar";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/habits" component={Habits} />
      <Route path="/goals" component={Goals} />
      <Route path="/agency" component={Agency} />
      <Route path="/content" component={Content} />
      <Route path="/curriculum" component={Curriculum} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/calendar" component={CalendarPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Layout>
            <Router />
          </Layout>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

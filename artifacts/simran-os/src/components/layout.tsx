import { ReactNode } from "react";
import { Sidebar } from "./sidebar";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] w-full bg-background text-foreground relative overflow-hidden">
      {/* Floating decorative shapes */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl animate-float" />
        <div className="absolute top-1/3 -left-32 w-64 h-64 rounded-full bg-secondary/5 blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 right-1/4 w-48 h-48 rounded-full bg-accent/5 blur-3xl animate-float" />
      </div>

      <Sidebar />
      <main className="flex-1 w-full lg:pl-64 flex flex-col relative z-10 transition-all duration-300 ease-in-out">
        <div className="flex-1 p-6 md:p-10 w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

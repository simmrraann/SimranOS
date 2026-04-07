import { ReactNode } from "react";
import { Sidebar } from "./sidebar";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] w-full gradient-bg text-foreground relative overflow-hidden">
      {/* Floating decorative orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl float-animation" />
        <div className="absolute top-1/2 -left-48 w-80 h-80 rounded-full bg-accent/5 blur-3xl float-animation" style={{ animationDelay: "2s" }} />
        <div className="absolute -bottom-24 right-1/3 w-72 h-72 rounded-full bg-secondary/5 blur-3xl float-animation" style={{ animationDelay: "4s" }} />
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

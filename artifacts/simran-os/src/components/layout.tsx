import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { useLocation } from "wouter";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] w-full bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 w-full lg:pl-64 flex flex-col relative transition-all duration-300 ease-in-out">
        <div className="flex-1 p-6 md:p-10 w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

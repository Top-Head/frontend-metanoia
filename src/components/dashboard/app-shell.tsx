import type { ReactNode } from "react";
import SidebarDashboard, { type Area } from "./sidebar";

export function AppShell({ area, bleed = false, children }: { area: Area; bleed?: boolean; children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-ink lg:flex-row">
      <SidebarDashboard area={area} compact={bleed} />
      <main className="min-w-0 flex-1">
        {bleed ? (
          children
        ) : (
          <div className="mx-auto w-full max-w-[1200px] px-5 pb-20 pt-8 sm:px-8 lg:px-12 lg:pt-12">{children}</div>
        )}
      </main>
    </div>
  );
}

import type { ReactNode } from "react";
import SidebarDashboard from "@/components/dashboard/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-canvas">
      <SidebarDashboard />
      <div className="min-w-0 flex-1 pb-10 pt-8">{children}</div>
    </div>
  );
}

import SidebarDashboard from "@/components/dashboard/sidebar";
import DashboardTopbar from "@/components/dashboard/topbar";
import Cards from "@/components/dashboard/Cards";
import Service from "@/components/dashboard/Service";
import Calendar from "@/components/dashboard/Calendar";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-canvas">
      <div className="flex">
        <SidebarDashboard />
        <div className="min-w-0 flex-1 pb-10 pt-8">
          <DashboardTopbar />
          <div className="grid grid-cols-1 gap-8 px-8 pt-8 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0">
              <Cards />
              <Service />
            </div>
            <Calendar />
          </div>
        </div>
      </div>
    </main>
  );
}

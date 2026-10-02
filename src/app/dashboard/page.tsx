import SidebarDashboard from "@/components/dashboard/sidebar";
import Cards from "@/components/dashboard/Cards";
import Service from "@/components/dashboard/Service";
import Calendar from "@/components/dashboard/Calendar";
import Header from "@/components/Header";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-canvas">
      <Header forceSolid activeLabel="Meu Aprendizado" />
      <div className="flex">
        <SidebarDashboard />
        <div className="min-w-0 flex-1 pt-24">
          <div className="px-8">
            <h1 className="truncate text-2xl font-bold text-ink">
              Bem-vindo de volta, Mentor Alex
            </h1>
            <p className="truncate text-sm text-ink-soft">
              Você tem 4 novas solicitações de serviço esta manhã.
            </p>
          </div>
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
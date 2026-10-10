import Image from "next/image";
import { Bell } from "lucide-react";
import SidebarDashboard from "@/components/dashboard/sidebar";
import Cards from "@/components/dashboard/Cards";
import Service from "@/components/dashboard/Service";
import Calendar from "@/components/dashboard/Calendar";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-canvas">
      <div className="flex">
        <SidebarDashboard />
        <div className="min-w-0 flex-1 pb-10 pt-8">
          <div className="flex items-center justify-between gap-6 px-8">
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold text-ink">
                Bem-vindo de volta, Mentor Alex
              </h1>
              <p className="truncate text-sm text-ink-soft">
                Você tem 4 novas solicitações de serviço esta manhã.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <button
                type="button"
                aria-label="Notificações"
                className="relative flex size-10 cursor-pointer items-center justify-center rounded-lg bg-line text-ink transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <Bell size={18} />
                <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-danger" />
              </button>
              <Image
                src="/Image+Border.svg"
                alt="Avatar do usuário"
                width={36}
                height={36}
                className="rounded-full"
              />
            </div>
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

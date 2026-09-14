import { Bell } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="mt-8 ml-8 flex h-13 w-207.5 items-center justify-between gap-4">
      <div className="min-w-0">
        <h1 className="truncate text-base font-bold tracking-tight text-[#101822] text-[24px]">
          Welcome back, Mentor Alex
        </h1>
        <p className="truncate text-[14px] text-slate-500">
          You have 4 new service requests this morning.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          aria-label="Notificações"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-[#E7ECF3] transition-colors hover:bg-[#dbe2ec] focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <Bell className="h-5 w-5 text-[#0D131B]" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <button
          type="button"
          aria-label="Perfil"
          className="rounded-full transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <Image
            src="/Image+Border.svg"
            alt="Avatar do usuário"
            width={40}
            height={40}
          />
        </button>
      </div>
    </header>

  );
}

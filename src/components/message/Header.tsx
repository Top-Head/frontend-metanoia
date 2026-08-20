import { Search } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-white px-6 md:px-10 py-3 border-b border-[#e7ecf3]">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 text-[#136dec]">
          <svg className="size-8" fill="currentColor" viewBox="0 0 48 48">
            <path
              clipRule="evenodd"
              d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
              fillRule="evenodd"
            />
          </svg>
          <h2 className="text-lg font-bold tracking-tight text-[#0d131b]">
            Academia Metanoia
          </h2>
        </div>

        <div className="hidden md:flex relative w-54">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4c6c9a]"
            size={18}
          />
          <input
            type="text"
            placeholder="Search mentors..."
            className="w-full bg-[#e7ecf3] border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#136dec]/20 outline-none"
          />
        </div>
      </div>

      <nav className="flex items-center gap-4 md:gap-28">
        <div className="hidden lg:flex gap-6 text-sm font-medium">
          <a className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
            Marketplace
          </a>
          <a className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
            My Learning
          </a>
          <a className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
            Mentoring
          </a>
          <a className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
            Messages
          </a>
        </div>
        <div className="flex gap-2">
          <img src="/Button.svg" alt="" />
          <img src="/Button(1).svg" alt="" />
          <img src="/Image+Border.svg" alt="" />
        </div>
      </nav>
    </header>
  );
}

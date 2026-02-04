"use client";

import Image from "next/image";
import { Search } from "lucide-react"; 

export default function Page() {
  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 h-[72px] flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="text-blue-600">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <h2 className="text-xl font-bold tracking-tight">
            Academia Metanoia
            </h2>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors cursor-pointer">
            Encontre Mentores
            </a>
            <a className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors cursor-pointer">
            Torne-se um Mentor
            </a>
            <a className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors cursor-pointer">
            Quem somos
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button className="bg-slate-100 text-slate-900 px-5 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition">
              Iniciar Sessão
            </button>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition">
              Inscreva-se gratuitamente
            </button>
          </div>
        </div>
      </header>

      <section className="relative w-full py-12 lg:py-20 px-6 lg:px-20 bg-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-24 w-64 h-64 bg-blue-600 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-[1200px] mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Aprenda com os Melhores. <br />
              <span className="text-blue-600">Conecte-se com Mentores Especialistas.</span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
            Encontre sua combinação perfeita em nosso mercado global de mentores profissionais nas áreas de tecnologia, artes e negócios.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="flex items-center bg-white border border-slate-200 p-2 rounded-xl shadow-xl">
              <div className="pl-4 pr-2 text-slate-400">
                <Search size={20} />
              </div>
              <input
                className="flex-1 border-none bg-transparent focus:ring-0 text-slate-900 text-base py-3 outline-none"
                placeholder="Busque por especialidade (ex. Tecnológia, Psicológia, Arts)"
                type="text"
              />
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold transition-transform active:scale-95">
                Encontre Mentores
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
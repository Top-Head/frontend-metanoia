"use client";

import React, { useState, useMemo, useEffect, useEffectEvent } from "react";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  Code, 
  Brain, 
  Palette, 
  Briefcase, 
  Beaker, 
  Star, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { MENTORES_DATA } from "@/data/mentors";

export default function Page() {
  const [termoBusca, setTermoBusca] = useState("");

  const mentoresFiltrados = useMemo(() => {
    return MENTORES_DATA.filter(m => 
      m.name.toLowerCase().includes(termoBusca.toLowerCase()) || 
      m.role.toLowerCase().includes(termoBusca.toLowerCase())
    );
  }, [termoBusca]);
 

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-blue-600">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor" />
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800">Academia Metanoia</h2>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Encontrar Mentores</a>
            <a className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Tornar-se Mentor</a>
            <a className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Sobre Nós</a>
          </nav>

          <div className="flex items-center gap-4">
            <button className="text-sm font-bold text-slate-700 hover:text-slate-900">Entrar</button>
            <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition shadow-md shadow-blue-200">
              Cadastre-se Grátis
            </button>
          </div>
        </div>
      </header>

      <section
      className="
        border-b border-slate-100
        py-16 lg:py-24 px-6
        relative
        bg-white
        overflow-visible
      "
     
    >
      <div className="max-w-[1000px] mx-auto text-center space-y-8">
       
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight md:leading-snug">
            Aprenda com os Melhores. <br />
            <span className="text-blue-600">
              Conecte-se com Mentores Especialistas.
            </span>
          </h1>

          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-normal">
            Encontre o par perfeito em nosso mercado global de mentores profissionais
            nas áreas de tecnologia, artes e negócios.
          </p>
        </div>

      
        <div className="max-w-2xl mx-auto mt-10">
          <div className="flex items-center bg-white border border-slate-200 p-2 rounded-2xl shadow-lg shadow-slate-200/50">
          
            <div className="pl-4 pr-2 text-slate-400">
              <Search size={20} strokeWidth={2.5} />
            </div>

            
            <input
              type="text"
              aria-label="Buscar mentores por especialidade"
              className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 text-base py-3 px-4 outline-none"
              placeholder="Busque por especialidade (ex. Tecnologia, Psicologia, Artes)"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />

          
            <button
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors transform active:scale-95"
              type="button"
            >
              Buscar Mentores
            </button>
          </div>
        </div>
      </div>
    </section>

      <main className="max-w-[1440px] mx-auto px-6 lg:px-20 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center gap-2 pb-2">
                <Filter size={18} className="text-blue-600" />
                <h3 className="font-bold text-slate-800">Filtros</h3>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categorias</p>
                <div className="space-y-1">
                  <BotaoFiltro icon={Grid3X3} label="Todas Categorias" active />
                  <BotaoFiltro icon={Code} label="Tecnologia" />
                  <BotaoFiltro icon={Brain} label="Psicologia" />
                  <BotaoFiltro icon={Palette} label="Artes" />
                  <BotaoFiltro icon={Briefcase} label="Negócios" />
                  <BotaoFiltro icon={Beaker} label="Ciências" />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preço por Hora ($)</p>
                <div className="px-1">
                  <div className="h-1 w-full bg-slate-100 rounded-full relative">
                    <div className="absolute left-[20%] right-[30%] h-full bg-blue-600 rounded-full" />
                    <div className="absolute left-[20%] -top-1.5 size-4 bg-blue-600 border-2 border-white rounded-full shadow-md cursor-pointer" />
                    <div className="absolute right-[30%] -top-1.5 size-4 bg-blue-600 border-2 border-white rounded-full shadow-md cursor-pointer" />
                  </div>
                  <div className="flex justify-between mt-4 text-xs font-bold text-slate-600">
                    <span>$20</span>
                    <span>$250</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avaliação Mínima</p>
                <div className="space-y-3">
                  <OpcaoAvaliacao label="4 Estrelas ou mais" active />
                  <OpcaoAvaliacao label="3 Estrelas ou mais" />
                  <OpcaoAvaliacao label="Todas Avaliações" />
                </div>
              </div>

              <button className="w-full py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors mt-4">
                Limpar Todos Filtros
              </button>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
              <h2 className="text-2xl font-bold text-slate-800">
                Mentores em Destaque <span className="text-slate-300 font-medium ml-2">({mentoresFiltrados.length})</span>
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Ordenar por:</span>
                <select className="bg-transparent border-none text-xs font-bold text-slate-800 focus:ring-0 cursor-pointer">
                  <option>Recomendados</option>
                  <option>Preço: Menor para Maior</option>
                </select>
              </div>
            </div>

            {mentoresFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"> 
                {mentoresFiltrados.map((mentor) => (
                  <div key={mentor.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    <div className="relative h-52 overflow-hidden bg-slate-200">
                      <img src={mentor.image} alt={mentor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 right-3 bg-white/95 px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-[11px] font-black">{mentor.rating}</span>
                        <span className="text-[10px] text-slate-400 font-bold">({mentor.reviews})</span>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div>
                        <h4 className="font-bold text-lg text-slate-900">{mentor.name}</h4>
                        <p className="text-blue-600 text-xs font-bold uppercase tracking-wide mt-1">{mentor.role}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5">
                        {mentor.skills.map(skill => (
                          <span key={skill} className="px-2 py-1 bg-slate-50 text-[9px] font-black text-slate-400 rounded-md border border-slate-100 uppercase tracking-tighter">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400">A partir de</p>
                          <p className="text-lg font-black text-slate-900">${mentor.price}<span className="text-xs font-normal text-slate-400">/h</span></p>
                        </div>
                        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-black hover:bg-blue-700 transition shadow-lg shadow-blue-100">
                          Ver Perfil
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-100">
                <p className="text-slate-400 font-medium">Nenhum mentor encontrado para "{termoBusca}"</p>
              </div>
            )}

            <div className="mt-16 flex items-center justify-center gap-2">
              <button className="p-2.5 rounded-xl border border-slate-200 hover:bg-white transition shadow-sm text-slate-400">
                <ChevronLeft size={18} />
              </button>
              <button className="size-10 rounded-xl bg-blue-600 text-white font-black text-sm shadow-lg shadow-blue-200">1</button>
              <button className="size-10 rounded-xl hover:bg-white font-bold text-slate-400 text-sm transition border border-transparent hover:border-slate-100">2</button>
              <button className="size-10 rounded-xl hover:bg-white font-bold text-slate-400 text-sm transition border border-transparent hover:border-slate-100">3</button>
              <button className="p-2.5 rounded-xl border border-slate-200 hover:bg-white transition shadow-sm text-slate-400">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="text-blue-600">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Academia Metanoia</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-medium">
              Capacitando a próxima geração de pensadores, criadores e líderes por meio de mentoria direta com veteranos da indústria.
            </p>
          </div>
          
          <GrupoRodape titulo="Plataforma" links={["Buscar Mentores", "Comunidade", "Recursos"]} />
          <GrupoRodape titulo="Suporte" links={["Central de Ajuda", "Termos de Serviço", "Política de Privacidade"]} />
        </div>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 mt-20 pt-8 border-t border-slate-50 text-center">
          <p className="text-slate-300 text-xs font-bold tracking-widest">© 2024 ACADEMIA METANOIA AI - TODOS OS DIREITOS RESERVADOS.</p>
        </div>
      </footer>
    </div>
  );
}

const BotaoFiltro = ({ icon: Icon, label, active = false }: any) => (
  <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
    active ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
  }`}>
    <Icon size={16} strokeWidth={active ? 2.5 : 2} />
    <span className="text-xs">{label}</span>
  </button>
);

const OpcaoAvaliacao = ({ label, active = false }: { label: string, active?: boolean }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <div className={`size-4 rounded border flex items-center justify-center transition-all ${active ? 'bg-blue-600 border-blue-600' : 'border-slate-200'}`}>
      {active && <div className="size-1.5 bg-white rounded-full" />}
    </div>
    <span className={`text-xs font-bold transition-colors ${active ? 'text-slate-800' : 'text-slate-400 group-hover:text-slate-600'}`}>{label}</span>
    {label.includes('Estrelas') && <Star size={10} className="fill-yellow-400 text-yellow-400 ml-[-4px]" />}
  </label>
);

const GrupoRodape = ({ titulo, links }: { titulo: string, links: string[] }) => (
  <div className="space-y-6">
    <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">{titulo}</h4>
    <ul className="space-y-4">
      {links.map(link => (
        <li key={link}>
          <a href="#" className="text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors">{link}</a>
        </li>
      ))}
    </ul>
  </div>
);
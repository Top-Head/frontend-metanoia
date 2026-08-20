import React from 'react';
import Link from 'next/link';
import { 
  Verified, 
  Users, 
  Clock, 
  Star, 
  Mail, 
  Globe, 
  Link as LinkIcon, 
  Share2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const MentorProfile = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7f8] font-sans text-[#0d131b]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-10 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-6 border border-[#e7ecf3] shadow-sm sticky top-24">
              <div className="aspect-square rounded-xl bg-slate-200 mb-6 overflow-hidden">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuADvhiG2GPyFDW5FYOjMcUNjzmrdU5nqtCCKrFRKMYDUagtaQ1kRbCPu87eZYB5Du1SNMkF5SrO9UmV84kRz1-uwOXR3YmI6K3ypWk7u6dBxiRX1N2OnIgbJaTRCY2V1T8s8xNZjyoHOKCnm_BPP8WmqEd0bbfQ2AfT7BvYV3aX7NLl7bFPqOzClcJZrNQ05r6SpfLpEMDHcYoC_WaVLV8fcD2gVBiUtmROclfclDW07Ku2ZPEUJgXNE-KOJKYS-t90IHQUUEhB6xY" 
                  alt="Dr. Helena" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold">Dr. Helena Schmidt</h1>
                <Verified className="text-[#136dec] fill-[#136dec]/10" size={20} />
              </div>
              <p className="text-[#4c6c9a] text-sm leading-snug mb-6">Senior UI/UX Design Specialist & Academic Mentor</p>
              
              <div className="space-y-4 py-6 border-t border-[#e7ecf3]">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <Users size={18} className="text-[#4c6c9a]" /> 500+ Estudantes
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <Clock size={18} className="text-[#4c6c9a]" /> 1,200+ Horas Mentoradas
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <Star size={18} className="text-[#4c6c9a]" /> 4.9/5.0 Classificação média
                </div>
              </div>
            <Link href="/messages">
              <button className="w-full mt-2 bg-[#136dec] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#136dec]/20 transition-all">
                <Mail size={18} /> Enviar Mensagem
              </button>
            </Link>
              
              <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-[#e7ecf3] text-[#4c6c9a]">
                 <Globe size={20} className="cursor-pointer hover:text-[#136dec]" />
                 <LinkIcon size={20} className="cursor-pointer hover:text-[#136dec]" />
                 <Share2 size={20} className="cursor-pointer hover:text-[#136dec]" />
              </div>
            </div>
          </aside>

          <div className="lg:col-span-6 space-y-8">
            <section className="bg-white rounded-2xl p-6 md:p-8 border border-[#e7ecf3] shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Sobre Mim</h2>
              <div className="text-[#0d131b] space-y-4 leading-relaxed opacity-90">
                <p>
                   Educador apaixonado com mais de 10 anos de experiência em Design de UI/UX e Matemática Avançada.
                   Eu me concentro em preencher a lacuna entre a teoria e a prática padrão da indústria.
                </p>
                <p>
                    Tendo sido mentor em empresas de design de primeira linha e ensinado em universidades globais,
                    trago uma perspectiva única que combina rigor analítico com resolução criativa de problemas.
                </p>
              </div>
              
              <h3 className="font-bold mt-8 mb-4">Experiência principal</h3>
              <div className="flex flex-wrap gap-2">
                {['UI/UX Design', 'Product Strategy', 'Design Systems', 'Advanced Mathematics', 'Prototyping'].map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-[#136dec]/10 text-[#136dec] rounded-full text-xs font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 md:p-8 border border-[#e7ecf3] shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Avaliações de estudantes</h2>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">4.9</span>
                  <div className="flex text-yellow-400">
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" className="opacity-50" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {[1, 2].map((review) => (
                  <div key={review} className="pb-6 border-b border-[#e7ecf3] last:border-0 last:pb-0">
                    <div className="flex justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-slate-200" />
                        <div>
                          <p className="font-bold text-sm">Marcus Thompson</p>
                          <p className="text-xs text-[#4c6c9a]">2 weeks ago • UI/UX Coaching</p>
                        </div>
                      </div>
                      <div className="flex text-yellow-400"><Star size={14} fill="currentColor" /></div>
                    </div>
                    <p className="text-sm text-slate-600 italic">"Helena é uma mentora incrível. Ela me ajudou a reestruturar meu portfólio e conseguir meu primeiro cargo de designer sênior."</p>
                  </div>
                ))}
              </div>
              <button className="text-[#136dec] font-bold text-sm hover:underline mt-6">Ver todas as avaliações</button>
            </section>
          </div>

          <aside className="lg:col-span-3">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-[#e7ecf3] shadow-md">
                <h2 className="text-xl font-bold mb-6">Agende uma Sessão</h2>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center justify-between p-3 border-2 border-[#136dec] bg-[#136dec]/5 rounded-xl cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="size-4 border-2 border-[#136dec] rounded-full flex items-center justify-center">
                        <div className="size-2 bg-[#136dec] rounded-full" />
                      </div>
                      <span className="text-sm font-semibold">1:1 Mentoria</span>
                    </div>
                    <span className="text-sm font-bold">$50<span className="font-normal text-xs text-slate-500">/hr</span></span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-[#e7ecf3] rounded-xl hover:border-[#136dec] transition-colors cursor-pointer">
                    <span className="text-sm font-medium text-slate-600">Revisão do Projecto</span>
                    <span className="text-sm font-bold">$35</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold">Novembero 2024</span>
                    <div className="flex gap-1">
                      <ChevronLeft size={18} className="cursor-pointer text-slate-400 hover:text-[#136dec]" />
                      <ChevronRight size={18} className="cursor-pointer text-slate-400 hover:text-[#136dec]" />
                    </div>
                  </div>

                </div>

                <button className="w-full bg-[#136dec] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-[#136dec]/20 hover:-translate-y-0.5 transition-all">
                  Reserve Agora
                </button>
                <p className="text-[10px] text-center text-[#4c6c9a] mt-4 italic">Nenhum pagamento será feito até que a sessão seja confirmada</p>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
                <ShieldCheck className="text-[#136dec] shrink-0" size={20} />
                <div>
                  <p className="text-xs font-bold text-blue-900">Garantia de devolução do dinheiro</p>
                  <p className="text-[10px] text-blue-700/80 leading-tight mt-0.5">Se você não estiver satisfeito com sua primeira sessão, reembolsaremos você 100%.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MentorProfile;
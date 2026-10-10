import {
  Brain,
  Briefcase,
  Code,
  GraduationCap,
  Languages,
  Megaphone,
  MessageSquare,
  Music,
  Palette,
  Sigma,
  Wallet,
  type LucideIcon,
} from "lucide-react";

interface CategoryVisual {
  icon: LucideIcon;
  /** Classes de fundo e texto do ícone. */
  tone: string;
}

const VISUALS: Record<string, CategoryVisual> = {
  programacao: { icon: Code, tone: "bg-blue-50 text-blue-600" },
  design: { icon: Palette, tone: "bg-pink-50 text-pink-600" },
  psicologia: { icon: Brain, tone: "bg-violet-50 text-violet-600" },
  negocios: { icon: Briefcase, tone: "bg-amber-50 text-amber-600" },
  idiomas: { icon: Languages, tone: "bg-teal-50 text-teal-600" },
  matematica: { icon: Sigma, tone: "bg-indigo-50 text-indigo-600" },
  "financas-pessoais": { icon: Wallet, tone: "bg-emerald-50 text-emerald-600" },
  "marketing-digital": { icon: Megaphone, tone: "bg-orange-50 text-orange-600" },
  musica: { icon: Music, tone: "bg-rose-50 text-rose-600" },
  comunicacao: { icon: MessageSquare, tone: "bg-cyan-50 text-cyan-600" },
};

const FALLBACK: CategoryVisual = { icon: GraduationCap, tone: "bg-primary/10 text-primary" };

export function categoryVisual(slug?: string): CategoryVisual {
  return (slug && VISUALS[slug]) || FALLBACK;
}

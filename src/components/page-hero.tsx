import type { ReactNode } from "react";

interface PageHeroProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export function PageHero({ title, description, icon }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-ink pb-12 pt-32 text-white md:pt-36">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-40 size-96 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-32 size-96 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <span className="mb-5 inline-flex size-12 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white backdrop-blur-sm">
          {icon}
        </span>
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
          {description}
        </p>
      </div>
    </section>
  );
}
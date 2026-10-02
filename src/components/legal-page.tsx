import type { ReactNode } from "react";
import { FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PageHero } from "@/components/page-hero";

interface LegalSection {
  title: string;
  body: string;
}

interface LegalPageProps {
  title: string;
  description: string;
  sections: LegalSection[];
  footer?: ReactNode;
}

export function LegalPage({
  title,
  description,
  sections,
  footer,
}: LegalPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas font-sans text-ink">
      <Header forceSolid />
      <PageHero
        icon={<FileText size={22} />}
        title={title}
        description={description}
      />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 md:px-8">
        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 text-xl font-bold text-ink">
                {section.title}
              </h2>
              <p className="leading-relaxed text-ink/80">{section.body}</p>
            </section>
          ))}
        </div>
        {footer}
      </main>
      <Footer />
    </div>
  );
}